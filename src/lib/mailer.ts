import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { getSettings } from "./settings";

export type MailStatus = "NOT_CONFIGURED" | "SENT" | "FAILED";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Hilangkan CR/LF agar input pengunjung tidak bisa menyisipkan header email. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

/**
 * Konfigurasi SMTP dari .env (rahasia, tidak disimpan di database):
 *   SMTP_HOST, SMTP_PORT (587 = STARTTLS, 465 = SSL), SMTP_SECURE ("true" untuk 465),
 *   SMTP_USER, SMTP_PASS, MAIL_FROM (opsional; default = SMTP_USER)
 */
function smtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS ?? "";
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE.toLowerCase() === "true" : port === 465;
  const from = process.env.MAIL_FROM?.trim() || user || "";
  if (!host || !from) return null;
  return { host, port, secure, user, pass, from };
}

let cached: { key: string; tx: Transporter } | null = null;
function getTransporter(c: NonNullable<ReturnType<typeof smtpConfig>>): Transporter {
  const key = `${c.host}|${c.port}|${c.secure}|${c.user}|${c.pass.length}`;
  if (cached?.key === key) return cached.tx;
  const tx = nodemailer.createTransport({
    host: c.host,
    port: c.port,
    secure: c.secure, // true hanya untuk port 465; port 587 memakai STARTTLS otomatis
    ...(c.user ? { auth: { user: c.user, pass: c.pass } } : {}),
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 12_000,
  });
  cached = { key, tx };
  return tx;
}

/**
 * Mengirim pesan kontak ke Company Email (Dashboard > General Settings) lewat SMTP.
 * Penerima: Company Email dari Settings; bila kosong, memakai CONTACT_NOTIFY_EMAIL dari .env.
 * Boleh lebih dari satu penerima, pisahkan dengan koma.
 *
 * Alur: dipanggil SEBELUM pesan disimpan ke database. Mengembalikan status NYATA
 * (SENT / FAILED / NOT_CONFIGURED) yang kemudian ikut disimpan sebagai riwayat.
 * Fungsi ini tidak pernah melempar error.
 */
export async function sendContactNotification(m: {
  name: string;
  company?: string | null;
  email: string;
  subject?: string | null;
  message: string;
}): Promise<MailStatus> {
  const s = await getSettings();
  const cfg = smtpConfig();
  const toRaw = s.email?.trim() || process.env.CONTACT_NOTIFY_EMAIL?.trim() || "";
  const to = toRaw.split(",").map((x) => x.trim()).filter(Boolean);

  if (!cfg || to.length === 0) {
    const missing = [
      !process.env.SMTP_HOST?.trim() && "SMTP_HOST",
      !(process.env.MAIL_FROM?.trim() || process.env.SMTP_USER?.trim()) && "SMTP_USER atau MAIL_FROM",
      to.length === 0 && "penerima (Company Email di Settings atau CONTACT_NOTIFY_EMAIL)",
    ].filter(Boolean);
    console.warn(`[mail] NOT_CONFIGURED — belum diisi: ${missing.join(", ")}`);
    return "NOT_CONFIGURED";
  }

  const subject = `[Website] ${oneLine(m.subject || "New contact message")} — ${oneLine(m.name)}`;
  const when = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "long", timeStyle: "short" });

  const text = [
    "Pesan baru dari formulir kontak website",
    "",
    `Nama     : ${oneLine(m.name)}`,
    `Company  : ${m.company ? oneLine(m.company) : "-"}`,
    `Email    : ${oneLine(m.email)}`,
    `Subjek   : ${m.subject ? oneLine(m.subject) : "-"}`,
    `Waktu    : ${when} WIB`,
    "",
    m.message,
    "",
    "— Balas email ini untuk menjawab langsung ke pengirim.",
  ].join("\n");

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;max-width:600px">
  <h2 style="margin:0 0 12px;font-size:18px">Pesan baru dari formulir kontak website</h2>
  <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:14px">
    <tr><td style="color:#64748b">Nama</td><td><b>${esc(m.name)}</b></td></tr>
    <tr><td style="color:#64748b">Company</td><td>${esc(m.company ?? "-")}</td></tr>
    <tr><td style="color:#64748b">Email</td><td><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></td></tr>
    <tr><td style="color:#64748b">Subjek</td><td>${esc(m.subject ?? "-")}</td></tr>
    <tr><td style="color:#64748b">Waktu</td><td>${esc(when)} WIB</td></tr>
  </table>
  <div style="margin-top:14px;padding:14px;border-left:4px solid #FFD43B;background:#f8fafc;font-size:14px;line-height:1.6">${esc(m.message).replace(/\n/g, "<br>")}</div>
  <p style="margin-top:16px;font-size:12px;color:#64748b">Balas email ini untuk menjawab langsung ke pengirim.</p>
</div>`;

  try {
    await getTransporter(cfg).sendMail({
      from: cfg.from, // untuk Gmail/Outlook harus sama dengan akun SMTP_USER
      to,
      replyTo: m.email, // tombol "Balas" langsung ke klien
      subject,
      text,
      html,
    });
    return "SENT";
  } catch (e) {
    const err = e as { code?: string; responseCode?: number; message?: string };
    // Jangan log kredensial; cukup kode & pesan error.
    console.error("[mail] SMTP send failed", { code: err.code, responseCode: err.responseCode, message: err.message });
    return "FAILED";
  }
}