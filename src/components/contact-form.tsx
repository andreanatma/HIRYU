"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/client";
import { submitContact } from "@/features/public-actions";
import type { FormState } from "@/features/crud-actions";
import { T as t } from "@/lib/dictionary";

const init: FormState = { ok: false };

function Err({ id, text }: { id: string; text?: string }) {
  return text ? <p id={`${id}-e`} role="alert" className="mt-1 text-body-sm text-error">{text}</p> : null;
}

export function ContactForm() {
  const [s, a] = useActionState(submitContact, init);
  const e = s.errors ?? {};
  if (s.ok) return <div role="status" className="rounded-lg border border-success/40 bg-[#ECFDF5] p-6 text-[#065F46]"><h3 className="text-title-lg">{t.f_sent_title}</h3><p className="mt-1 text-body-md">{s.message}</p></div>;
  return (
    <form action={a} className="space-y-5" noValidate>
      {s.message && <div role="alert" className="rounded border border-error/30 bg-error-container px-4 py-3 text-body-sm text-on-error-container">{s.message}</div>}
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className="label" htmlFor="name">{t.f_name} <span className="text-error">*</span></label><input id="name" name="name" required maxLength={120} className="input" autoComplete="name" aria-invalid={!!e.name} aria-describedby={e.name ? "name-e" : undefined} /><Err id="name" text={e.name} /></div>
        <div><label className="label" htmlFor="company">{t.f_company}</label><input id="company" name="company" maxLength={160} className="input" autoComplete="organization" aria-invalid={!!e.company} /><Err id="company" text={e.company} /></div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className="label" htmlFor="email">{t.f_email} <span className="text-error">*</span></label><input id="email" name="email" type="email" required maxLength={190} className="input" autoComplete="email" aria-invalid={!!e.email} aria-describedby={e.email ? "email-e" : undefined} /><Err id="email" text={e.email} /></div>
        <div><label className="label" htmlFor="subject">{t.f_subject} <span className="text-error">*</span></label><input id="subject" name="subject" required maxLength={200} className="input" aria-invalid={!!e.subject} aria-describedby={e.subject ? "subject-e" : undefined} /><Err id="subject" text={e.subject} /></div>
      </div>
      <div><label className="label" htmlFor="message">{t.f_message} <span className="text-error">*</span></label><textarea id="message" name="message" required rows={6} maxLength={2000} className="input" aria-invalid={!!e.message} aria-describedby={e.message ? "message-e" : undefined} placeholder={t.f_placeholder} /><Err id="message" text={e.message} /></div>
      <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <SubmitButton className="btn-accent w-full !py-3.5" pendingText={t.f_sending}>{t.f_send}</SubmitButton>
    </form>
  );
}