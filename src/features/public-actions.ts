"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/mailer";
import { T as t } from "@/lib/dictionary";
import type { FormState } from "./crud-actions";

const schema = z.object({
  name: z.string().trim().min(2, t.err_name_min).max(120, t.err_name_max),
  company: z.string().trim().max(160, t.err_company_max).optional().transform((v) => v || null),
  email: z.string().trim().toLowerCase().email(t.err_email).max(190),
  subject: z.string().trim().min(3, t.err_subject_min).max(200, t.err_subject_max),
  message: z.string().trim().min(10, t.err_msg_min).max(2000, t.err_msg_max),
});

/**
 * Alur pesan kontak:
 *   1) Klien mengisi form  →  validasi + anti-spam (honeypot, rate limit)
 *   2) Dikirim ke email company lewat SMTP
 *   3) Disimpan ke database sebagai riwayat (beserta status email yang NYATA: SENT / FAILED / NOT_CONFIGURED)
 *
 * Pesan tetap disimpan walau email gagal, supaya tidak ada calon pelanggan yang hilang.
 */
export async function submitContact(_p: FormState, fd: FormData): Promise<FormState> {
  // Honeypot: bots fill the hidden field. Pretend success so we give no signal.
  if (String(fd.get("website") ?? "") !== "") return { ok: true, message: t.ok_received };

  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim();
  const ipHash = createHash("sha256").update(ip + (process.env.BOOTSTRAP_TOKEN ?? "salt")).digest("hex");

  const rl = rateLimit(`contact:${ipHash}`, 5, 10 * 60_000);
  if (!rl.ok) return { ok: false, message: t.err_rate };
  const recent = await prisma.contactMessage.count({ where: { ipHash, createdAt: { gte: new Date(Date.now() - 60 * 60_000) } } });
  if (recent >= 10) return { ok: false, message: t.err_hourly };

  const parsed = schema.safeParse({ name: fd.get("name"), company: fd.get("company") ?? "", email: fd.get("email"), subject: fd.get("subject"), message: fd.get("message") });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] = i.message;
    return { ok: false, message: t.err_review, errors };
  }

  // 2) Kirim ke email company (tidak pernah melempar error; mengembalikan status)
  const emailStatus = await sendContactNotification(parsed.data);

  // 3) Simpan ke database sebagai riwayat, lengkap dengan status email
  try {
    await prisma.contactMessage.create({ data: { ...parsed.data, ipHash, emailStatus } });
  } catch (e) {
    console.error("contact", e);
    // Email sudah sampai ke company → bagi klien pesannya tetap berhasil terkirim.
    if (emailStatus === "SENT") return { ok: true, message: t.ok_received };
    return { ok: false, message: t.err_save };
  }
  return { ok: true, message: t.ok_saved };
}