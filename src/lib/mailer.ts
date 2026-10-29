import "server-only";
import { getSettings } from "./settings";

export type MailStatus = "NOT_CONFIGURED" | "SENT" | "FAILED";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Mengirim notifikasi pesan kontak ke Company Email (Dashboard > General Settings).
 * Penerima: Company Email dari Settings; bila kosong, memakai CONTACT_NOTIFY_EMAIL dari .env.
 * Pengirim (RESEND_API_KEY dan MAIL_FROM) tetap dari .env karena bersifat rahasia.
 * Mengembalikan status NYATA; pesan sudah tersimpan di database sebelum fungsi ini dipanggil.
 */
export async function sendContactNotification(m: {
  name: string;
  company?: string | null;
  email: string;
  subject?: string | null;
  message: string;
}): Promise<MailStatus> {
  const s = await getSettings();
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const toRaw = s.email?.trim() || process.env.CONTACT_NOTIFY_EMAIL?.trim() || "";
  const to = toRaw.split(",").map((x) => x.trim()).filter(Boolean);

  if (!key || !from || to.length === 0) {
    console.warn("[mail] NOT_CONFIGURED", { hasKey: !!key, hasFrom: !!from, recipients: to.length });
    return "NOT_CONFIGURED";
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        reply_to: m.email,
        subject: `[Website] ${m.subject || "New contact message"} — ${m.name}`,
        html: `<p><b>Name:</b> ${esc(m.name)}<br><b>Company:</b> ${esc(m.company ?? "-")}<br><b>Email:</b> ${esc(m.email)}<br><b>Subject:</b> ${esc(m.subject ?? "-")}</p><p>${esc(m.message).replace(/\n/g, "<br>")}</p>`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[mail] Resend error", res.status, await res.text().catch(() => ""));
      return "FAILED";
    }
    return "SENT";
  } catch (e) {
    console.error("[mail] send failed", e);
    return "FAILED";
  }
}