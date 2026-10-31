"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { changeOwnPassword, loginAction, bootstrapSignupAction } from "../auth-actions";
import { createUser, saveSettings, updateUser } from "../admin-actions";
import type { FormState } from "../crud-actions";
import { SETTING_FIELDS } from "@/lib/settings-fields";
import { AuthAlert, AuthInput, AuthSubmit, PasswordStrength } from "./auth-ui";
import { FormActions, FormAlert, FormSection, GRID, PasswordField, SPAN2, SegmentedField, SwitchField, TextField, splitLabel, submitVia, useFocusAlert } from "./form-ui";

const init: FormState = { ok: false };

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
  const [s, dispatch, pending] = useActionState(user ? updateUser.bind(null, user.id) : createUser, init);
  const e = s.errors ?? {};
  useFocusAlert(s, !!s.message || Object.keys(e).length > 0);
  return (
    <form onSubmit={submitVia(dispatch)} className="max-w-3xl space-y-6">
      {s.message && <FormAlert tone={s.ok ? "success" : "error"} title={s.message} />}
      <FormSection icon="badge" title="Account details" desc="The name and email this administrator signs in with." delayMs={60}>
        <div className={GRID}>
          <TextField name="name" label="Name" required defaultValue={user?.name ?? ""} error={e.name} icon="person" autoComplete="off" />
          <TextField name="email" label="Email" required type="email" defaultValue={user?.email ?? ""} error={e.email} icon="mail" autoComplete="off" />
        </div>
      </FormSection>
      <FormSection icon="admin_panel_settings" title="Access" desc={user ? "Role and account status." : "Role and the first password."} delayMs={120}>
        <div className="space-y-5">
          <SegmentedField name="role" label="Role" required error={e.role} options={[{ value: "ADMIN", label: "Admin" }, { value: "SUPER_ADMIN", label: "Super Admin" }]} defaultValue={user?.role ?? "ADMIN"} help="Super Admins can manage users and site settings." />
          {user ? (
            <SwitchField name="isActive" label="Account active (the user can sign in)" defaultChecked={user.isActive} />
          ) : (
            <PasswordField name="password" label="Initial password (min. 10 characters, letters + numbers)" required error={e.password} autoComplete="new-password" generate help="Share it securely. The user can change it in Settings." />
          )}
        </div>
      </FormSection>
      <FormActions cancelHref="/dashboard-admin/users" pending={pending} saveLabel={user ? "Save changes" : "Create administrator"} />
    </form>
  );
}

const SETTING_SECTIONS = [
  { title: "Company", desc: "Name and tagline used across the website.", icon: "business", keys: ["company_name", "tagline"] },
  { title: "Homepage hero", desc: "The first thing visitors see on the homepage.", icon: "web", keys: ["hero_title", "hero_subtitle"] },
  { title: "Contact details", desc: "Shown on the Contact page and in the footer.", icon: "contact_phone", keys: ["email", "whatsapp", "office_hours", "address", "maps_embed_url"] },
  { title: "Footer", desc: "Short text under the logo in the footer.", icon: "short_text", keys: ["footer_description"] },
] as const;
const SETTING_META: Record<string, { icon?: string; type?: "email"; inputMode?: "numeric" | "email"; half?: boolean }> = {
  email: { icon: "mail", type: "email", inputMode: "email", half: true },
  whatsapp: { icon: "chat", inputMode: "numeric", half: true },
  office_hours: { icon: "schedule" },
  maps_embed_url: { icon: "map" },
};

export function SettingsForm({ values }: { values: Record<string, string> }) {
  const [s, dispatch, pending] = useActionState(saveSettings, init);
  useFocusAlert(s, !!s.message);
  const used = new Set<string>(SETTING_SECTIONS.flatMap((x) => x.keys));
  const sections = [...SETTING_SECTIONS.map((x) => ({ ...x, keys: [...x.keys] as string[] })), { title: "Other", desc: "Additional settings.", icon: "settings", keys: SETTING_FIELDS.map((f) => f.key).filter((k) => !used.has(k)) }].filter((x) => x.keys.length > 0);
  return (
    <form onSubmit={submitVia(dispatch)} className="max-w-3xl space-y-6">
      {s.message && <FormAlert tone={s.ok ? "success" : "error"} title={s.message} />}
      {sections.map((sec, i) => (
        <FormSection key={sec.title} icon={sec.icon} title={sec.title} desc={sec.desc} delayMs={60 + i * 60}>
          <div className={GRID}>
            {sec.keys.map((k) => {
              const f = SETTING_FIELDS.find((x) => x.key === k)!;
              const m = SETTING_META[k] ?? {};
              const multiline = f.type === "textarea";
              return (
                <div key={k} className={m.half ? undefined : SPAN2}>
                  <TextField name={k} label={f.label} defaultValue={values[k] ?? ""} error={s.errors?.[k]} max={1000} multiline={multiline} rows={3} icon={m.icon} type={m.type} inputMode={m.inputMode} />
                </div>
              );
            })}
          </div>
        </FormSection>
      ))}
      <FormActions pending={pending} saveLabel="Save settings" note="Changes appear on the public website right after saving." />
    </form>
  );
}

export function PasswordForm() {
  const [s, dispatch, pending] = useActionState(changeOwnPassword, init);
  const e = s.errors ?? {};
  const formRef = useRef<HTMLFormElement>(null);
  useFocusAlert(s, !!s.message);
  useEffect(() => { if (s.ok) formRef.current?.reset(); }, [s]);
  return (
    <form ref={formRef} onSubmit={submitVia(dispatch)} className="max-w-3xl space-y-6">
      {s.message && <FormAlert tone={s.ok ? "success" : "error"} title={s.message} />}
      <FormSection icon="lock_reset" title="Change my password" desc="Use at least 10 characters with letters and numbers." delayMs={60}>
        <div className="space-y-5">
          <PasswordField name="current" label="Current password" required error={e.current} autoComplete="current-password" />
          <div className={GRID}>
            <PasswordField name="password" label="New password" required error={e.password} autoComplete="new-password" />
            <PasswordField name="confirm" label="Confirm new password" required error={e.confirm} autoComplete="new-password" />
          </div>
        </div>
      </FormSection>
      <FormActions pending={pending} saveLabel="Change password" note="You will stay signed in on this device." />
    </form>
  );
}