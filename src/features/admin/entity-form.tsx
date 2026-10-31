"use client";

import { useActionState } from "react";
import type { FieldDef } from "../modules";
import { saveEntity, type FormState } from "../crud-actions";
import { FileField, MultiImageField } from "@/components/client";
import { Icon } from "@/components/ui";
import { Field, FormActions, FormAlert, FormSection, GRID, SPAN2, SegmentedField, SelectField, SwitchField, TextField, splitLabel, submitVia, useFocusAlert } from "./form-ui";

const initial: FormState = { ok: false };

export type EntityValues = Record<string, string | number | boolean | number[] | null>;

const MEDIA = ["image", "pdf", "images"];
const DISPLAY = ["number", "select", "date", "boolean"];

/** Field pendek boleh berdampingan (2 kolom); judul utama, slug, textarea, dan galeri selalu selebar penuh. */
const isHalf = (f: FieldDef) => {
  if (f.type === "textarea" || f.type === "longtext" || f.type === "slug" || f.type === "images") return false;
  if (f.type === "text") return (f.max ?? 0) <= 160 && f.name !== "name" && f.name !== "title";
  return true;
};

function place(list: FieldDef[]) {
  const out: { f: FieldDef; full: boolean }[] = [];
  for (let i = 0; i < list.length; i++) {
    const f = list[i];
    const next = list[i + 1];
    if (isHalf(f) && next && isHalf(next)) { out.push({ f, full: false }, { f: next, full: false }); i++; }
    else out.push({ f, full: true });
  }
  return out;
}

export function EntityForm({ moduleKey, id, fields, values, fileNames, relationOptions }: { moduleKey: string; id: number | null; fields: FieldDef[]; values: EntityValues; fileNames: Record<string, string>; relationOptions: Record<string, { value: string; label: string }[]> }) {
  const [state, dispatch, pending] = useActionState(saveEntity.bind(null, moduleKey, id), initial);
  const errors = state.errors ?? {};
  const errorCount = Object.keys(errors).length;
  useFocusAlert(state, !!state.message || errorCount > 0);

  const content = fields.filter((f) => !f.group && !MEDIA.includes(f.type) && !DISPLAY.includes(f.type));
  const media = fields.filter((f) => !f.group && MEDIA.includes(f.type));
  const display = fields.filter((f) => !f.group && DISPLAY.includes(f.type));
  const seo = fields.filter((f) => f.group === "seo");
  const seoHasError = seo.some((f) => errors[f.name]);
  const labelOf = (key: string) => { const f = fields.find((x) => x.name === key); return f ? splitLabel(f.label).title : key; };

  const render = ({ f, full }: { f: FieldDef; full: boolean }) => {
    const err = errors[f.name];
    const v = values[f.name] ?? "";
    const base = { name: f.name, label: f.label, required: f.required, help: f.help };
    let control: React.ReactNode;

    if (f.type === "boolean") {
      control = <SwitchField name={f.name} label={f.label} defaultChecked={Boolean(v)} />;
    } else if (f.type === "image" || f.type === "pdf") {
      control = (
        <Field {...base} plain>
          <FileField name={f.name} kind={f.type === "pdf" ? "pdf" : "image"} initialId={v ? Number(v) : null} initialName={fileNames[f.name]} error={err} />
        </Field>
      );
    } else if (f.type === "images") {
      control = <Field {...base} plain><MultiImageField name={f.name} initial={Array.isArray(v) ? v : []} /></Field>;
    } else if (f.type === "textarea" || f.type === "longtext") {
      control = <TextField {...base} error={err} multiline rows={f.type === "longtext" ? Math.max(f.rows ?? 12, 12) : f.rows ?? 4} max={f.max} defaultValue={String(v)} placeholder={f.placeholder} />;
    } else if (f.type === "select") {
      const opts = f.options ?? [];
      const def = String(v || f.def || opts[0]?.value || "");
      control = opts.length <= 3
        ? <SegmentedField {...base} error={err} options={opts} defaultValue={def} />
        : <SelectField {...base} error={err} options={opts} defaultValue={def} />;
    } else if (f.type === "relation") {
      control = <SelectField {...base} error={err} options={relationOptions[f.name] ?? []} defaultValue={String(v)} placeholder="— Select —" nativeRequired={f.required} />;
    } else {
      const type = f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "url" ? "url" : "text";
      const icon = f.type === "slug" ? "tag" : f.type === "url" ? "link" : undefined;
      control = <TextField {...base} error={err} type={type} icon={icon} max={f.max} defaultValue={String(v)} placeholder={f.placeholder} />;
    }
    return <div key={f.name} className={full ? SPAN2 : undefined}>{control}</div>;
  };

  return (
    <form onSubmit={submitVia(dispatch)} className="space-y-6">
      {!state.ok && (state.message || errorCount > 0) && (
        <FormAlert tone="error" title={state.message ?? "Please fix the highlighted fields."}>
          {errorCount > 0 && (
            <ul className="mt-1 list-disc pl-5">
              {Object.entries(errors).map(([k, m]) => <li key={k}><a href={`#${k}`} className="font-medium underline">{labelOf(k)}</a>: {m}</li>)}
            </ul>
          )}
        </FormAlert>
      )}
      {state.ok && state.message && <FormAlert tone="success" title={state.message} />}

      {content.length > 0 && (
        <FormSection icon="edit_note" title="Main information" desc="The text visitors will read on the website." delayMs={60}>
          <div className={GRID}>{place(content).map(render)}</div>
        </FormSection>
      )}

      {media.length > 0 && (
        <FormSection icon="photo_library" title="Media" desc="Images and documents. Drag a file onto a box or click it to upload." delayMs={120}>
          <div className={GRID}>{place(media).map(render)}</div>
        </FormSection>
      )}

      {display.length > 0 && (
        <FormSection icon={moduleKey === "blogs" ? "publish" : "tune"} title={moduleKey === "blogs" ? "Publishing" : "Display & visibility"} desc="Control where and when this item appears." delayMs={180}>
          <div className={GRID}>{place(display).map(render)}</div>
        </FormSection>
      )}

      {seo.length > 0 && (
        <details open={seoHasError} className="group card adm-in overflow-hidden" style={{ "--d": "240ms" } as React.CSSProperties}>
          <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 transition-colors hover:bg-mist/70 sm:px-6 [&::-webkit-details-marker]:hidden">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-primary"><Icon name="search" className="text-[20px]" /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-title-md text-navy">SEO settings</span>
              <span className="block text-body-sm text-slate-text">Optional. Controls how this page appears in search results.</span>
            </span>
            <Icon name="expand_more" className="text-outline transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <div className="border-t border-line p-5 sm:p-6"><div className={GRID}>{place(seo).map(render)}</div></div>
        </details>
      )}

      <FormActions cancelHref={`/dashboard-admin/${moduleKey}`} pending={pending} />
    </form>
  );
}