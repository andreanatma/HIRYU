"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils";

export const GRID = "grid gap-5 sm:grid-cols-2";
export const SPAN2 = "sm:col-span-2";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const ctl = (invalid: boolean, extra?: string) => cn("input", invalid && "!border-error focus:!border-error focus:!ring-error/15", extra);
const describedBy = (name: string, error?: string, help?: string) => (error ? `${name}-e` : help ? `${name}-h` : undefined);

/** "Judul (keterangan)" -> judul + keterangan. */
export function splitLabel(label: string): { title: string; hint?: string } {
  const m = label.match(/^(.*?)\s*\((.+)\)\s*$/);
  return m ? { title: m[1], hint: m[2] } : { title: label };
}

/**
 * Kirim form lewat dispatch useActionState tanpa `action=` pada <form>.
 * Dengan begitu React 19 TIDAK mengosongkan isian saat validasi gagal.
 */
export function submitVia(dispatch: (fd: FormData) => void) {
  return (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
}

/** Gulir + fokus ke kotak pesan setiap kali hasil submit berubah. */
export function useFocusAlert(trigger: unknown, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const el = document.getElementById("form-alert");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  }, [trigger, active]);
}

export function Spinner({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent", className)} />;
}

export function FormAlert({ tone, title, children }: { tone: "error" | "success"; title?: string; children?: React.ReactNode }) {
  const ok = tone === "success";
  return (
    <div id="form-alert" tabIndex={-1} role={ok ? "status" : "alert"} className={cn("adm-pop flex items-start gap-3 rounded-xl border px-4 py-3 text-body-sm outline-none", ok ? "border-emerald-300 bg-[#ECFDF5] text-[#065F46]" : "border-error/30 bg-error-container text-on-error-container")}>
      <Icon name={ok ? "check_circle" : "error"} fill className="mt-0.5 text-[20px]" />
      <div className="min-w-0 flex-1">{title && <p className="font-semibold">{title}</p>}{children}</div>
    </div>
  );
}

export function FormSection({ icon, title, desc, children, delayMs = 0 }: { icon: string; title: string; desc?: string; children: React.ReactNode; delayMs?: number }) {
  return (
    <section className="card adm-in overflow-hidden" style={delay(delayMs)}>
      <header className="flex items-center gap-3 border-b border-line bg-mist/60 px-5 py-4 sm:px-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-primary"><Icon name={icon} className="text-[20px]" /></span>
        <div className="min-w-0">
          <h2 className="text-title-md text-navy">{title}</h2>
          {desc && <p className="text-body-sm text-slate-text">{desc}</p>}
        </div>
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

type Common = { name: string; label: string; required?: boolean; help?: string; error?: string; className?: string };

/** Pembungkus label + bantuan + pesan error + penghitung karakter. */
export function Field({ name, label, required, help, error, className, counter, plain, children }: Common & { counter?: { len: number; max: number }; plain?: boolean; children: React.ReactNode }) {
  const { title, hint } = splitLabel(label);
  const inline = !!hint && hint.length <= 28;
  const below = hint && !inline ? cap(hint) : undefined;
  const text = (
    <>
      {title}{required && <span className="text-error"> *</span>}
      {inline && <span className="ml-1.5 font-normal text-slate-text">({hint})</span>}
    </>
  );
  const labelCls = "mb-1.5 block text-body-sm font-semibold text-navy";
  const notes = [below, help].filter(Boolean) as string[];
  return (
    <div className={className}>
      {plain ? <p className={labelCls}>{text}</p> : <label htmlFor={name} className={labelCls}>{text}</label>}
      {children}
      {(error || notes.length > 0 || counter) && (
        <div className="mt-1.5 flex items-start justify-between gap-3 text-body-sm">
          <div className="min-w-0 flex-1">
            {error ? (
              <p id={`${name}-e`} role="alert" className="flex items-center gap-1 font-medium text-error"><Icon name="error" fill className="text-[16px]" />{error}</p>
            ) : notes.length > 0 ? (
              <p id={`${name}-h`} className="text-slate-text">{notes.map((n, i) => <span key={i} className="block">{n}</span>)}</p>
            ) : null}
          </div>
          {counter && (
            <span className={cn("shrink-0 tabular-nums text-label-md", counter.len >= counter.max ? "text-error" : counter.len >= counter.max * 0.9 ? "text-[#92400E]" : "text-outline")}>{counter.len}/{counter.max}</span>
          )}
        </div>
      )}
    </div>
  );
}

export function TextField({ name, label, required, help, error, className, type = "text", multiline, rows = 4, max, defaultValue = "", placeholder, icon, inputMode, autoComplete }: Common & {
  type?: "text" | "number" | "date" | "url" | "email"; multiline?: boolean; rows?: number; max?: number; defaultValue?: string | number; placeholder?: string; icon?: string;
  inputMode?: "numeric" | "email" | "url" | "text"; autoComplete?: string;
}) {
  const [len, setLen] = useState(String(defaultValue).length);
  const invalid = !!error;
  const common = { id: name, name, placeholder, "aria-invalid": invalid, "aria-describedby": describedBy(name, error, help) } as const;
  return (
    <Field name={name} label={label} required={required} help={help} error={error} className={className} counter={max ? { len, max } : undefined}>
      <div className="relative">
        {icon && !multiline && <Icon name={icon} className="pointer-events-none absolute left-3 top-[9px] text-[20px] text-outline" />}
        {multiline ? (
          <textarea {...common} rows={rows} maxLength={max} defaultValue={String(defaultValue)} onInput={(e) => setLen(e.currentTarget.value.length)} className={ctl(invalid, "min-h-[96px] resize-y")} />
        ) : (
          <input {...common} type={type} min={type === "number" ? 0 : undefined} maxLength={max} inputMode={inputMode ?? (type === "number" ? "numeric" : undefined)} autoComplete={autoComplete} defaultValue={String(defaultValue)} onInput={(e) => setLen(e.currentTarget.value.length)} className={ctl(invalid, icon ? "!pl-10" : undefined)} />
        )}
      </div>
    </Field>
  );
}

function makePassword(length = 14) {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";
  const digits = "23456789";
  const all = letters + digits;
  const r = new Uint32Array(length * 2);
  crypto.getRandomValues(r);
  const chars = Array.from({ length }, (_, i) => all[r[i] % all.length]);
  chars[0] = letters[r[length] % letters.length];
  chars[1] = digits[r[length + 1] % digits.length];
  for (let i = length - 1; i > 0; i--) { const j = r[length + i] % (i + 1); [chars[i], chars[j]] = [chars[j], chars[i]]; }
  return chars.join("");
}

/** Input password dengan tombol tampil/sembunyi (dan opsional pembuat password acak). Tidak terkontrol, jadi form.reset() tetap bekerja. */
export function PasswordField({ name, label, required, help, error, className, autoComplete, generate }: Common & { autoComplete?: string; generate?: boolean }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const invalid = !!error;
  return (
    <Field name={name} label={label} required={required} help={help} error={error} className={className}>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Icon name="lock" className="pointer-events-none absolute left-3 top-[9px] text-[20px] text-outline" />
          <input ref={ref} id={name} name={name} type={show ? "text" : "password"} required={required} autoComplete={autoComplete} aria-invalid={invalid} aria-describedby={describedBy(name, error, help)} className={ctl(invalid, "!pl-10 !pr-11")} />
          <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} className="adm-icon-btn absolute right-1 top-[3px] !h-9 !w-9"><Icon name={show ? "visibility_off" : "visibility"} className="text-[20px]" /></button>
        </div>
        {generate && (
          <button type="button" className="btn-secondary shrink-0 !px-3" onClick={() => { if (ref.current) ref.current.value = makePassword(); setShow(true); }}>
            <Icon name="auto_fix_high" className="text-[20px]" /><span className="hidden sm:inline">Generate</span>
          </button>
        )}
      </div>
    </Field>
  );
}

export function SelectField({ name, label, required, help, error, className, options, defaultValue, placeholder, nativeRequired }: Common & { options: { value: string; label: string }[]; defaultValue?: string; placeholder?: string; nativeRequired?: boolean }) {
  const invalid = !!error;
  return (
    <Field name={name} label={label} required={required} help={help} error={error} className={className}>
      <div className="relative">
        <select id={name} name={name} required={nativeRequired} defaultValue={defaultValue ?? ""} aria-invalid={invalid} aria-describedby={describedBy(name, error, help)} className={ctl(invalid, "appearance-none !pr-10")}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <Icon name="expand_more" className="pointer-events-none absolute right-3 top-[9px] text-[22px] text-outline" />
      </div>
    </Field>
  );
}

/** Pilihan 2-3 opsi sebagai tombol segmen (radio). */
export function SegmentedField({ name, label, required, help, error, className, options, defaultValue }: Common & { options: { value: string; label: string }[]; defaultValue?: string }) {
  return (
    <Field name={name} label={label} required={required} help={help} error={error} className={className} plain>
      <div role="radiogroup" aria-label={splitLabel(label).title} className="grid auto-cols-fr grid-flow-col gap-1 rounded-lg border border-line bg-mist p-1">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer">
            <input type="radio" name={name} value={o.value} defaultChecked={o.value === defaultValue} className="peer sr-only" />
            <span className="flex h-9 items-center justify-center rounded-md px-3 text-body-sm font-semibold text-slate-text transition-all duration-200 hover:text-navy peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-primary">{o.label}</span>
          </label>
        ))}
      </div>
    </Field>
  );
}

/** Saklar on/off sebagai pengganti checkbox. */
export function SwitchField({ name, label, defaultChecked, className }: { name: string; label: string; defaultChecked?: boolean; className?: string }) {
  const { title, hint } = splitLabel(label);
  return (
    <label htmlFor={name} className={cn("flex cursor-pointer items-center gap-4 rounded-lg border border-line bg-white p-4 transition-all duration-200 hover:border-primary/40 hover:bg-brand-light/50 has-[:checked]:border-primary/40 has-[:checked]:bg-brand-light/60", className)}>
      <span className="min-w-0 flex-1">
        <span className="block text-body-sm font-semibold text-navy">{title}</span>
        {hint && <span className="block text-body-sm text-slate-text">{cap(hint)}</span>}
      </span>
      <input id={name} name={name} type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <span aria-hidden="true" className="relative h-6 w-11 shrink-0 rounded-full bg-[#C3CDDA] transition-colors duration-300 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-300 peer-checked:bg-primary peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary" />
    </label>
  );
}

/** Bilah aksi yang menempel di bawah layar agar tombol Simpan selalu terjangkau (terutama di HP). */
export function FormActions({ cancelHref, pending, saveLabel = "Save changes", note }: { cancelHref?: string; pending: boolean; saveLabel?: string; note?: string }) {
  return (
    <div className="sticky bottom-3 z-20 flex items-center justify-between gap-3 rounded-xl border border-line bg-white/90 p-3 shadow-[0_18px_40px_-18px_rgba(7,29,51,0.35)] backdrop-blur-xl sm:px-4">
      <p className="hidden items-center gap-1.5 text-body-sm text-slate-text sm:flex">
        <Icon name="info" className="text-[18px]" />{note ?? "Fields marked * are required."}
      </p>
      <div className="flex flex-1 gap-3 sm:flex-none">
        {cancelHref && <Link href={cancelHref} className="btn-secondary flex-1 sm:flex-none">Cancel</Link>}
        <button type="submit" disabled={pending} aria-busy={pending} className="btn-accent flex-1 sm:flex-none">
          {pending ? <><Spinner />Saving…</> : <><Icon name="check" className="text-[20px]" />{saveLabel}</>}
        </button>
      </div>
    </div>
  );
}