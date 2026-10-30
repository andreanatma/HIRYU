"use client";

import { useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { Icon } from "@/components/ui";

/* ------------------------------------------------------------------ */
/*  Alert (error / success / info) untuk halaman login & signup        */
/* ------------------------------------------------------------------ */
export function AuthAlert({ tone, children }: { tone: "error" | "success" | "info"; children: React.ReactNode }) {
  const map = {
    error: { box: "border-error/30 bg-error-container text-on-error-container auth-shake", icon: "error" },
    success: { box: "border-emerald-300 bg-[#ECFDF5] text-[#065F46]", icon: "check_circle" },
    info: { box: "border-primary-fixed-dim bg-primary-fixed text-brand-hover", icon: "info" },
  }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex items-start gap-3 rounded-md border px-4 py-3 text-body-sm ${map.box}`}>
      <Icon name={map.icon} fill className="mt-px text-[20px]" />
      <div>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Input dengan ikon, toggle show/hide password, peringatan Caps Lock */
/* ------------------------------------------------------------------ */
type AuthInputProps = {
  name: string;
  label: string;
  icon: string;
  type?: "text" | "email" | "password";
  error?: string;
  hint?: React.ReactNode;
  value?: string;
  onChange?: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
};

export function AuthInput({ name, label, icon, type = "text", error, hint, value, onChange, autoComplete, placeholder, required = true, autoFocus }: AuthInputProps) {
  const uid = useId();
  const id = `${name}-${uid}`;
  const isPassword = type === "password";
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const describedBy = [error ? `${id}-err` : null, caps ? `${id}-caps` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="group/field relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-outline transition-colors duration-200 group-focus-within/field:text-primary">
          <Icon name={icon} className="text-[20px]" />
        </span>
        <input
          id={id}
          name={name}
          type={isPassword && show ? "text" : type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`auth-input ${isPassword ? "!pr-12" : ""}`}
          {...(value !== undefined ? { value, onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value) } : {})}
          {...(isPassword
            ? {
                onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => setCaps(e.getModifierState?.("CapsLock") ?? false),
                onBlur: () => setCaps(false),
              }
            : {})}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-outline transition-all duration-200 hover:bg-primary-light hover:text-primary active:scale-90"
          >
            <Icon name={show ? "visibility_off" : "visibility"} className="text-[20px]" />
          </button>
        )}
      </div>
      {caps && (
        <p id={`${id}-caps`} className="mt-1.5 flex items-center gap-1.5 text-body-sm text-tertiary">
          <Icon name="keyboard_capslock" className="text-[16px]" />
          Caps Lock is on
        </p>
      )}
      {hint && !error && (
        <div id={`${id}-hint`} className="mt-1.5 text-body-sm text-on-surface-variant">
          {hint}
        </div>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-body-sm text-error">
          <Icon name="error" fill className="text-[16px]" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tombol submit dengan spinner + panah animasi                        */
/* ------------------------------------------------------------------ */
export function AuthSubmit({ children, pendingText = "Please wait…", icon = "arrow_forward" }: { children: React.ReactNode; pendingText?: string; icon?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className="auth-btn shine group">
      {pending ? (
        <>
          <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-navy/25 border-t-navy" aria-hidden="true" />
          {pendingText}
        </>
      ) : (
        <>
          {children}
          <Icon name={icon} className="text-[20px] transition-transform duration-300 group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Indikator kekuatan password (aturan sama dengan passwordSchema)     */
/* ------------------------------------------------------------------ */
export function PasswordStrength({ value }: { value: string }) {
  const checks = [
    { ok: value.length >= 10, label: "10+ characters" },
    { ok: /[A-Za-z]/.test(value), label: "A letter" },
    { ok: /[0-9]/.test(value), label: "A number" },
  ];
  const bonus = value.length >= 14 || /[^A-Za-z0-9]/.test(value) ? 1 : 0;
  const base = checks.filter((c) => c.ok).length;
  const score = value ? (base === 3 ? 3 + bonus : Math.min(base, 2)) : 0; // 0..4
  const meta = [
    { label: "", bar: "bg-line" },
    { label: "Weak", bar: "bg-error" },
    { label: "Fair", bar: "bg-accent-hover" },
    { label: "Good", bar: "bg-primary" },
    { label: "Strong", bar: "bg-success" },
  ][score];

  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1.5" aria-hidden="true">
          {[1, 2, 3, 4].map((n) => (
            <span key={n} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${n <= score ? meta.bar : "bg-line"}`} />
          ))}
        </div>
        <span className="w-12 text-right text-label-md text-on-surface-variant">{meta.label}</span>
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {checks.map((c) => (
          <li key={c.label} className={`flex items-center gap-1 text-label-md transition-colors duration-300 ${c.ok ? "text-success" : "text-outline"}`}>
            <Icon name={c.ok ? "check_circle" : "radio_button_unchecked"} fill={c.ok} className="text-[15px]" />
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
