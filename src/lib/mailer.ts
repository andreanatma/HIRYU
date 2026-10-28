import "server-only";

export type MailStatus = "NOT_CONFIGURED" | "SENT" | "FAILED";

/**
 * Notifikasi email via Resend HTTP API (tanpa dependency tambahan).
 * Penerima: CONTACT_NOTIFY_EMAIL, atau fallbackTo (email perusahaan di Settings) bila kosong.
 * Aktif hanya bila RESEND_API_KEY, MAIL_FROM, dan penerima tersedia.
 * Mengembalikan status NYATA; tidak mengklaim terkirim bila provider gagal / belum dikonfigurasi.
 */
export async function sendContactNotification(
  m: { name: string; company?: string | null; email: string; subject?: string | null; message: string },
  fallbackTo?: string,
): Promise<MailStatus> {
  const key = process.env.RESEND_API_KEY, from = process.env.MAIL_FROM;
  const to = (process.env.CONTACT_NOTIFY_EMAIL || fallbackTo || "").trim();
  if (!key || !from || !to) return "NOT_CONFIGURED";
  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  const subject = (m.subject || "New contact message").replace(/[\r\n]+/g, " ");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: to.split(",").map((x) => x.trim()).filter(Boolean), reply_to: m.email,
        subject: `[Website] ${subject} — ${m.name}`,
        html: `<p><b>Name:</b> ${esc(m.name)}<br><b>Company:</b> ${esc(m.company ?? "-")}<br><b>Email:</b> ${esc(m.email)}<br><b>Subject:</b> ${esc(subject)}</p><p>${esc(m.message).replace(/\n/g, "<br>")}</p>`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? "SENT" : "FAILED";
  } catch {
    return "FAILED";
  }
}