"use client";

import { useActionState, useEffect, useState } from "react";
import { SubmitButton } from "@/components/client";
import { Icon } from "@/components/ui";
import { submitContact } from "@/features/public-actions";
import type { FormState } from "@/features/crud-actions";
import { T as t } from "@/lib/dictionary";
import { cn } from "@/lib/utils";

const init: FormState = { ok: false };
const MAX_MSG = 2000;
const KEYS = ["name", "company", "email", "subject", "message"] as const;

// Input: hover halus; label berubah biru saat kolomnya difokuskan (group/f).
const FIELD = "input transition-colors duration-200 hover:border-[#B7C4D6]";
const LABEL = "label transition-colors duration-200 group-focus-within/f:text-primary";

function Err({ id, text }: { id: string; text?: string }) {
  return text ? <p id={`${id}-e`} role="alert" className="mt-1 text-body-sm text-error">{text}</p> : null;
}

export function ContactForm() {
  // React 19 mengosongkan form setelah action selesai, termasuk saat validasi gagal.
  // Nilai terakhir disimpan lalu dipakai sebagai defaultValue agar pengunjung tidak perlu mengetik ulang.
  const [saved, setSaved] = useState<Partial<Record<(typeof KEYS)[number], string>>>({});
  const [len, setLen] = useState(0);
  const [s, a] = useActionState(async (prev: FormState, fd: FormData): Promise<FormState> => {
    const next: Partial<Record<(typeof KEYS)[number], string>> = {};
    for (const k of KEYS) next[k] = String(fd.get(k) ?? "");
    setSaved(next);
    return submitContact(prev, fd);
  }, init);
  useEffect(() => { setLen(saved.message?.length ?? 0); }, [saved]);
  const e = s.errors ?? {};

  if (s.ok) {
    return (
      <div role="status" className="hero-in flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-success/30 bg-[#ECFDF5] px-6 py-12 text-center text-[#065F46]">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-lg shadow-success/30"><Icon name="check" className="text-[30px]" /></span>
        <h3 className="text-title-lg">{t.f_sent_title}</h3>
        <p className="max-w-md text-body-md">{s.message}</p>
      </div>
    );
  }

  return (
    // flex-1 + flex-col: form mengisi sisa tinggi kartu, kolom Message yang menyerap tambahan tinggi.
    <form action={a} className="flex flex-1 flex-col gap-4 sm:gap-5" noValidate>
      {s.message && <div role="alert" className="auth-shake rounded border border-error/30 bg-error-container px-4 py-3 text-body-sm text-on-error-container">{s.message}</div>}

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="group/f"><label className={LABEL} htmlFor="name">{t.f_name} <span className="text-error">*</span></label><input id="name" name="name" required maxLength={120} defaultValue={saved.name} className={FIELD} autoComplete="name" aria-invalid={!!e.name} aria-describedby={e.name ? "name-e" : undefined} /><Err id="name" text={e.name} /></div>
        <div className="group/f"><label className={LABEL} htmlFor="company">{t.f_company}</label><input id="company" name="company" maxLength={160} defaultValue={saved.company} className={FIELD} autoComplete="organization" aria-invalid={!!e.company} aria-describedby={e.company ? "company-e" : undefined} /><Err id="company" text={e.company} /></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="group/f"><label className={LABEL} htmlFor="email">{t.f_email} <span className="text-error">*</span></label><input id="email" name="email" type="email" required maxLength={190} defaultValue={saved.email} className={FIELD} autoComplete="email" inputMode="email" aria-invalid={!!e.email} aria-describedby={e.email ? "email-e" : undefined} /><Err id="email" text={e.email} /></div>
        <div className="group/f"><label className={LABEL} htmlFor="subject">{t.f_subject} <span className="text-error">*</span></label><input id="subject" name="subject" required maxLength={200} defaultValue={saved.subject} className={FIELD} aria-invalid={!!e.subject} aria-describedby={e.subject ? "subject-e" : undefined} /><Err id="subject" text={e.subject} /></div>
      </div>

      <div className="group/f flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-3">
          <label className={LABEL} htmlFor="message">{t.f_message} <span className="text-error">*</span></label>
          <span aria-hidden="true" className={cn("mb-1.5 text-label-md tabular-nums transition-colors", len > MAX_MSG * 0.9 ? "text-error" : "text-outline")}>{len}/{MAX_MSG}</span>
        </div>
        <textarea id="message" name="message" required rows={6} maxLength={MAX_MSG} defaultValue={saved.message} onChange={(ev) => setLen(ev.target.value.length)} className={cn(FIELD, "min-h-[10rem] flex-1 resize-y lg:resize-none")} aria-invalid={!!e.message} aria-describedby={e.message ? "message-e" : undefined} placeholder={t.f_placeholder} />
        <Err id="message" text={e.message} />
      </div>

      <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>

      <SubmitButton className="btn-accent shine group/btn w-full !py-3.5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30 active:translate-y-0 active:scale-[0.99]" pendingText={t.f_sending}>
        <Icon name="send" className="text-[20px] transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-1" />{t.f_send}
      </SubmitButton>
    </form>
  );
}