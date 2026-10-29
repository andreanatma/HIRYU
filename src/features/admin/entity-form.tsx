"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { FieldDef } from "../modules";
import { saveEntity, type FormState } from "../crud-actions";
import { FileField, MultiImageField, SubmitButton } from "@/components/client";

const initial: FormState = { ok: false };

export type EntityValues = Record<string, string | number | boolean | number[] | null>;

export function EntityForm({ moduleKey, id, fields, values, fileNames, relationOptions }: { moduleKey: string; id: number | null; fields: FieldDef[]; values: EntityValues; fileNames: Record<string, string>; relationOptions: Record<string, { value: string; label: string }[]> }) {
  const [state, action] = useActionState(saveEntity.bind(null, moduleKey, id), initial);
  const main = fields.filter((f) => !f.group);
  const seo = fields.filter((f) => f.group === "seo");

  const render = (f: FieldDef) => {
    const err = state.errors?.[f.name];
    const v = values[f.name] ?? "";
    const common = { id: f.name, name: f.name, "aria-invalid": !!err, "aria-describedby": err ? `${f.name}-e` : undefined } as const;
    if (f.type === "boolean") {
      return (
        <label key={f.name} className="flex items-center gap-3 text-body-md" htmlFor={f.name}>
          <input id={f.name} name={f.name} type="checkbox" defaultChecked={Boolean(v)} className="h-[18px] w-[18px] accent-primary" />{f.label}
        </label>
      );
    }
    return (
      <div key={f.name}>
        <label className="label" htmlFor={f.name}>{f.label}{f.required && <span className="text-error"> *</span>}</label>
        {f.type === "image" || f.type === "pdf" ? (
          <FileField name={f.name} kind={f.type === "pdf" ? "pdf" : "image"} initialId={v ? Number(v) : null} initialName={fileNames[f.name]} error={err} />
        ) : f.type === "images" ? (
          <MultiImageField name={f.name} initial={Array.isArray(v) ? v : []} />
        ) : f.type === "textarea" || f.type === "longtext" ? (
          <textarea {...common} className="input" rows={f.rows ?? 4} maxLength={f.max} defaultValue={String(v)} placeholder={f.placeholder} />
        ) : f.type === "select" ? (
          <select {...common} className="input" defaultValue={String(v || f.def || f.options?.[0]?.value)}>{f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
        ) : f.type === "relation" ? (
          <select {...common} className="input" defaultValue={String(v)} required={f.required}>
            <option value="">— Select —</option>
            {(relationOptions[f.name] ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ) : (
          <input {...common} className="input" type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "url" ? "url" : "text"} min={f.type === "number" ? 0 : undefined} maxLength={f.max} defaultValue={String(v)} placeholder={f.placeholder} />
        )}
        {f.help && !err && <p className="mt-1 text-body-sm text-on-surface-variant">{f.help}</p>}
        {err && f.type !== "image" && f.type !== "pdf" && <p id={`${f.name}-e`} role="alert" className="mt-1 text-body-sm text-error">{err}</p>}
      </div>
    );
  };

  return (
    <form action={action} className="card space-y-5 p-6">
      {state.message && !state.ok && <div role="alert" className="rounded border border-error/30 bg-error-container px-4 py-3 text-body-sm text-on-error-container">{state.message}</div>}
      {main.map(render)}
      {seo.length > 0 && (
        <fieldset className="space-y-5 rounded border border-line p-4">
          <legend className="px-2 text-label-md text-on-surface-variant">SEO settings</legend>
          {seo.map(render)}
        </fieldset>
      )}
      <div className="flex justify-end gap-3 border-t border-surface-container pt-5">
        <Link href={`/dashboard-admin/${moduleKey}`} className="btn-secondary">Cancel</Link>
        <SubmitButton>Save Changes</SubmitButton>
      </div>
    </form>
  );
}