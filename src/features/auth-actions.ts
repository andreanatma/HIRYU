"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession, getClientIp, getSession, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { hashPassword, passwordSchema, safeEqual, verifyPassword } from "@/lib/password";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import type { FormState } from "./crud-actions";

const loginSchema = z.object({ email: z.string().trim().toLowerCase().email().max(190), password: z.string().min(1).max(128) });

export async function loginAction(_p: FormState, fd: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
  if (!parsed.success) return { ok: false, message: "Invalid email or password." };
  const { email, password } = parsed.data;
  const ip = await getClientIp();
  const key = `login:${ip}:${email}`;
  const rl = rateLimit(key, 5, 15 * 60_000);
  if (!rl.ok) return { ok: false, message: `Too many attempts. Try again in ${Math.ceil(rl.retryAfterSec / 60)} minute(s).` };

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = await verifyPassword(password, user?.passwordHash);
  if (!user || !valid || !user.isActive) {
    await logActivity({ userId: user?.id ?? null, action: "LOGIN_FAILED", entity: "auth", summary: "Failed login attempt" });
    return { ok: false, message: "Incorrect email or password, or the account is deactivated." };
  }
  resetRateLimit(key);
  await createSession(user.id);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await logActivity({ userId: user.id, action: "LOGIN", entity: "auth", summary: "Login successful" });
  redirect("/dashboard-admin");
}

export async function logoutAction(): Promise<void> {
  const u = await getSession();
  await destroySession();
  if (u) await logActivity({ userId: u.id, action: "LOGOUT", entity: "auth", summary: "Logout" });
  redirect("/dashboard-admin/login?reason=logout");
}

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
    email: z.string().trim().toLowerCase().email("Invalid email").max(190),
    password: passwordSchema,
    confirm: z.string(),
    token: z.string().min(1, "Bootstrap token is required"),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Password confirmation does not match" });

/** First Super Admin bootstrap. Works only while the users table is empty and BOOTSTRAP_TOKEN matches. */
export async function bootstrapSignupAction(_p: FormState, fd: FormData): Promise<FormState> {
  const expected = process.env.BOOTSTRAP_TOKEN;
  if (!expected) return { ok: false, message: "Signup is disabled: BOOTSTRAP_TOKEN is not set on the server." };
  const ip = await getClientIp();
  const rl = rateLimit(`bootstrap:${ip}`, 5, 15 * 60_000);
  if (!rl.ok) return { ok: false, message: "Too many attempts. Try again later." };

  const parsed = signupSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] = i.message;
    return { ok: false, message: "Please review the form.", errors };
  }
  const d = parsed.data;
  if (!safeEqual(d.token, expected)) return { ok: false, errors: { token: "Incorrect bootstrap token" }, message: "Incorrect bootstrap token." };

  const passwordHash = await hashPassword(d.password);
  const created = await prisma.$transaction(async (tx) => {
    if ((await tx.user.count()) > 0) return null;
    return tx.user.create({ data: { name: d.name, email: d.email, passwordHash, role: "SUPER_ADMIN" } });
  });
  if (!created) return { ok: false, message: "A Super Admin already exists. Signup is closed." };
  await logActivity({ userId: created.id, action: "CREATE", entity: "users", entityId: created.id, summary: "First Super Admin created via bootstrap" });
  redirect("/dashboard-admin/login?reason=created");
}

/** Dipanggil klien hanya setelah ada interaksi pengguna nyata; server tetap memvalidasi sesi. */
export async function pingSession(): Promise<{ valid: boolean }> {
  return { valid: (await getSession()) !== null };
}

const changePwSchema = z
  .object({ current: z.string().min(1, "Required"), password: passwordSchema, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Password confirmation does not match" });

export async function changeOwnPassword(_p: FormState, fd: FormData): Promise<FormState> {
  const me = await requireUser();
  const parsed = changePwSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] = i.message;
    return { ok: false, message: "Please review the form.", errors };
  }
  const row = await prisma.user.findUnique({ where: { id: me.id } });
  if (!row || !(await verifyPassword(parsed.data.current, row.passwordHash))) return { ok: false, errors: { current: "Current password is incorrect" }, message: "Current password is incorrect." };
  await prisma.user.update({ where: { id: me.id }, data: { passwordHash: await hashPassword(parsed.data.password) } });
  await logActivity({ userId: me.id, action: "PASSWORD", entity: "users", entityId: me.id, summary: "Changed own password" });
  return { ok: true, message: "Password changed successfully." };
}
