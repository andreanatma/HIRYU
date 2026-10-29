"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/mailer";
import type { FormState } from "./crud-actions";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120, "Name is too long"),
  company: z.string().trim().max(160, "Company name is too long").optional().transform((v) => v || null),
  email: z.string().trim().toLowerCase().email("Invalid email address").max(190),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(200, "Subject is too long"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message must be at most 2,000 characters"),
});

export async function submitContact(_p: FormState, fd: FormData): Promise<FormState> {
  // Honeypot: bots fill the hidden field. Pretend success so we give no signal.
  if (String(fd.get("website") ?? "") !== "") return { ok: true, message: "Your message has been received." };

  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim();
  const ipHash = createHash("sha256").update(ip + (process.env.BOOTSTRAP_TOKEN ?? "salt")).digest("hex");

  const rl = rateLimit(`contact:${ipHash}`, 5, 10 * 60_000);
  if (!rl.ok) return { ok: false, message: "Too many submissions. Please try again in a few minutes." };
  const recent = await prisma.contactMessage.count({ where: { ipHash, createdAt: { gte: new Date(Date.now() - 60 * 60_000) } } });
  if (recent >= 10) return { ok: false, message: "Hourly submission limit reached. Please try again later." };

  const parsed = schema.safeParse({ name: fd.get("name"), company: fd.get("company") ?? "", email: fd.get("email"), subject: fd.get("subject"), message: fd.get("message") });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] = i.message;
    return { ok: false, message: "Please review the highlighted fields.", errors };
  }

  // 1) Kirim ke email company (Company Email di Settings).
  const emailStatus = await sendContactNotification(parsed.data);

  // 2) Simpan ke database Contact Messages beserta status pengiriman emailnya.
  //    Tetap disimpan walau email gagal, agar pesan pelanggan tidak hilang.
  try {
    await prisma.contactMessage.create({ data: { ...parsed.data, ipHash, emailStatus } });
  } catch (e) {
    console.error("contact save", e);
    return { ok: false, message: "Your message could not be saved. Please try again." };
  }

  revalidatePath("/dashboard-admin");
  revalidatePath("/dashboard-admin/contact");
  return { ok: true, message: "Your message has been sent. Our team will contact you by email." };
}