"use client";

import { useActionState } from "react";
import Link from "next/link";
import { SubmitButton } from "@/components/client";
import { changeOwnPassword, loginAction, bootstrapSignupAction } from "../auth-actions";
import { createUser, saveSettings, updateUser } from "../admin-actions";
import type { FormState } from "../crud-actions";
import { SETTING_FIELDS } from "@/lib/settings-fields";

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
  return (
    <form action={a} className="space-y-4">
      <Msg s={s} />
      <Field label="Email" name="email"><input id="email" name="email" type="email" required autoComplete="username" className="input" placeholder="name@company.com" /></Field>
      <Field label="Password" name="password"><input id="password" name="password" type="password" required autoComplete="current-password" className="input" /></Field>
      <SubmitButton className="btn-accent w-full !py-3" pendingText="Checking…">Sign in to dashboard</SubmitButton>
    </form>
  );
}

export function SignupForm() {
  const [s, a] = useActionState(bootstrapSignupAction, init);
  const e = s.errors ?? {};
  return (
    <form action={a} className="space-y-4">
      <Msg s={s} />
      <Field label="Full name" name="name" error={e.name}><input id="name" name="name" required className="input" autoComplete="name" /></Field>
      <Field label="Email" name="email" error={e.email}><input id="email" name="email" type="email" required className="input" autoComplete="username" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Password (min. 10 characters)" name="password" error={e.password}><input id="password" name="password" type="password" required className="input" autoComplete="new-password" /></Field>
        <Field label="Confirm password" name="confirm" error={e.confirm}><input id="confirm" name="confirm" type="password" required className="input" autoComplete="new-password" /></Field>
      </div>
      <Field label="Bootstrap token (BOOTSTRAP_TOKEN)" name="token" error={e.token}><input id="token" name="token" type="password" required className="input" autoComplete="off" /></Field>
      <SubmitButton className="btn-accent w-full !py-3">Create Super Admin</SubmitButton>
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
