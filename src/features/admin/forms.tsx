"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { SubmitButton } from "@/components/client";
import { changeOwnPassword, loginAction, bootstrapSignupAction } from "../auth-actions";
import { createUser, saveSettings, updateUser } from "../admin-actions";
import type { FormState } from "../crud-actions";
import { SETTING_FIELDS } from "@/lib/settings-fields";
import { AuthAlert, AuthInput, AuthSubmit, PasswordStrength } from "./auth-ui";

const init: FormState = { ok: false };

function Msg({ s }: { s: FormState }) {
  if (!s.message) return null;
  return <div role={s.ok ? "status" : "alert"} className={`rounded border px-4 py-3 text-body-sm ${s.ok ? "border-emerald-300 bg-[#ECFDF5] text-[#065F46]" : "border-error/30 bg-error-container text-on-error-container"}`}>{s.message}</div>;
}
function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      {children}
      {error && <p id={`${name}-e`} role="alert" className="mt-1 text-body-sm text-error">{error}</p>}
    </div>
  );
}

export function LoginForm() {
  const [s, a] = useActionState(loginAction, init);
  const [email, setEmail] = useState("");
  return (
    <form action={a} className="space-y-5">
      {s.message && <AuthAlert tone={s.ok ? "success" : "error"}>{s.message}</AuthAlert>}
      <div className="auth-rise" style={{ "--d": "380ms" } as React.CSSProperties}>
        <AuthInput name="email" label="Email" icon="mail" type="email" value={email} onChange={setEmail} autoComplete="username" placeholder="name@company.com" autoFocus />
      </div>
      <div className="auth-rise" style={{ "--d": "460ms" } as React.CSSProperties}>
        <AuthInput name="password" label="Password" icon="lock" type="password" autoComplete="current-password" placeholder="Enter your password" />
      </div>
      <div className="auth-rise" style={{ "--d": "540ms" } as React.CSSProperties}>
        <AuthSubmit pendingText="Checking…">Sign in to dashboard</AuthSubmit>
      </div>
      <p className="auth-rise flex items-center justify-center gap-1.5 text-center text-body-sm text-on-surface-variant" style={{ "--d": "620ms" } as React.CSSProperties}>
        <span className="icon text-[16px]" aria-hidden="true">help</span>
        Forgot your password? Ask a Super Admin to reset it.
      </p>
    </form>
  );
}

export function SignupForm() {
  const [s, a] = useActionState(bootstrapSignupAction, init);
  const e = s.errors ?? {};
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const mismatch = confirm.length > 0 && pw !== confirm;
  const matched = confirm.length > 0 && pw === confirm;
  return (
    <form action={a} className="space-y-5">
      {s.message && <AuthAlert tone={s.ok ? "success" : "error"}>{s.message}</AuthAlert>}
      <div className="auth-rise" style={{ "--d": "360ms" } as React.CSSProperties}>
        <AuthInput name="name" label="Full name" icon="person" value={name} onChange={setName} error={e.name} autoComplete="name" placeholder="Your full name" autoFocus />
      </div>
      <div className="auth-rise" style={{ "--d": "430ms" } as React.CSSProperties}>
        <AuthInput name="email" label="Email" icon="mail" type="email" value={email} onChange={setEmail} error={e.email} autoComplete="username" placeholder="name@company.com" />
      </div>
      <div className="auth-rise space-y-3" style={{ "--d": "500ms" } as React.CSSProperties}>
        <AuthInput name="password" label="Password" icon="lock" type="password" value={pw} onChange={setPw} error={e.password} autoComplete="new-password" placeholder="Min. 10 characters" />
        <PasswordStrength value={pw} />
      </div>
      <div className="auth-rise" style={{ "--d": "570ms" } as React.CSSProperties}>
        <AuthInput
          name="confirm"
          label="Confirm password"
          icon="lock_reset"
          type="password"
          value={confirm}
          onChange={setConfirm}
          error={e.confirm ?? (mismatch ? "Password confirmation does not match" : undefined)}
          hint={matched ? <span className="flex items-center gap-1.5 text-success"><span className="icon text-[16px]" aria-hidden="true">check_circle</span>Passwords match</span> : undefined}
          autoComplete="new-password"
          placeholder="Re-enter your password"
        />
      </div>
      <div className="auth-rise" style={{ "--d": "640ms" } as React.CSSProperties}>
        <AuthInput name="token" label="Bootstrap token" icon="vpn_key" type="password" error={e.token} autoComplete="off" placeholder="BOOTSTRAP_TOKEN from the server" />
      </div>
      <div className="auth-rise" style={{ "--d": "710ms" } as React.CSSProperties}>
        <AuthSubmit pendingText="Creating account…" icon="rocket_launch">Create Super Admin</AuthSubmit>
      </div>
    </form>
  );
}

export function UserForm({ user }: { user?: { id: number; name: string; email: string; role: string; isActive: boolean } }) {
  const [s, a] = useActionState(user ? updateUser.bind(null, user.id) : createUser, init);
  const e = s.errors ?? {};
  return (
    <form action={a} className="card max-w-2xl space-y-5 p-6">
      <Msg s={s} />
      <Field label="Name" name="name" error={e.name}><input id="name" name="name" required defaultValue={user?.name} className="input" /></Field>
      <Field label="Email" name="email" error={e.email}><input id="email" name="email" type="email" required defaultValue={user?.email} className="input" /></Field>
      <Field label="Role" name="role" error={e.role}>
        <select id="role" name="role" defaultValue={user?.role ?? "ADMIN"} className="input"><option value="ADMIN">Admin</option><option value="SUPER_ADMIN">Super Admin</option></select>
      </Field>
      {user ? (
        <label className="flex items-center gap-3 text-body-md"><input type="checkbox" name="isActive" defaultChecked={user.isActive} className="h-[18px] w-[18px] accent-primary-container" />Account active</label>
      ) : (
        <Field label="Initial password (min. 10 characters, letters + numbers)" name="password" error={e.password}><input id="password" name="password" type="password" required autoComplete="new-password" className="input" /></Field>
      )}
      <div className="flex justify-end gap-3 border-t border-[#E8F1FF] pt-5"><Link href="/dashboard-admin/users" className="btn-secondary">Cancel</Link><SubmitButton>Save</SubmitButton></div>
    </form>
  );
}

export function SettingsForm({ values }: { values: Record<string, string> }) {
  const [s, a] = useActionState(saveSettings, init);
  return (
    <form action={a} className="card max-w-3xl space-y-5 p-6">
      <Msg s={s} />
      {SETTING_FIELDS.map((f) => (
        <Field key={f.key} label={f.label} name={f.key} error={s.errors?.[f.key]}>
          {f.type === "textarea" ? <textarea id={f.key} name={f.key} rows={3} defaultValue={values[f.key]} className="input" maxLength={1000} /> : <input id={f.key} name={f.key} defaultValue={values[f.key]} className="input" maxLength={1000} />}
        </Field>
      ))}
      <div className="flex justify-end border-t border-[#E8F1FF] pt-5"><SubmitButton>Save settings</SubmitButton></div>
    </form>
  );
}

export function PasswordForm() {
  const [s, a] = useActionState(changeOwnPassword, init);
  const e = s.errors ?? {};
  return (
    <form action={a} className="card max-w-3xl space-y-5 p-6">
      <h2 className="text-title-lg">Change my password</h2>
      <Msg s={s} />
      <Field label="Current password" name="current" error={e.current}><input id="current" name="current" type="password" required autoComplete="current-password" className="input" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="New password" name="password" error={e.password}><input id="password" name="password" type="password" required autoComplete="new-password" className="input" /></Field>
        <Field label="Confirm" name="confirm" error={e.confirm}><input id="confirm" name="confirm" type="password" required autoComplete="new-password" className="input" /></Field>
      </div>
      <div className="flex justify-end"><SubmitButton>Change password</SubmitButton></div>
    </form>
  );
}
