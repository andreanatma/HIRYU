"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { destroyUserSessions, requireSuperAdmin, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { generateTempPassword, hashPassword, passwordSchema } from "@/lib/password";
import { SETTING_FIELDS } from "@/lib/settings-fields";
import { safeMapsUrl } from "@/lib/maps";
import type { FormState } from "./crud-actions";

const toErrors = (e: z.ZodError) => {
  const errors: Record<string, string> = {};
  for (const i of e.issues) errors[String(i.path[0])] = i.message;
  return errors;
};
const back = (path: string, msg: string): never => redirect(`${path}?msg=${encodeURIComponent(msg)}`);

/* ---------------- Users ---------------- */
async function activeSuperAdminCount() {
  return prisma.user.count({ where: { role: "SUPER_ADMIN", isActive: true } });
}

const userSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().toLowerCase().email("Invalid email").max(190),
  role: z.enum(["SUPER_ADMIN", "ADMIN"]),
  isActive: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
});

export async function createUser(_p: FormState, fd: FormData): Promise<FormState> {
  const me = await requireSuperAdmin();
  const parsed = userSchema.extend({ password: passwordSchema }).safeParse({ ...Object.fromEntries(fd), isActive: "true" });
  if (!parsed.success) return { ok: false, message: "Please review the form.", errors: toErrors(parsed.error) };
  const { password, isActive, ...rest } = parsed.data;
  if (await prisma.user.findUnique({ where: { email: rest.email } })) return { ok: false, errors: { email: "Email already registered" }, message: "Email already registered." };
  const u = await prisma.user.create({ data: { ...rest, isActive, passwordHash: await hashPassword(password) } });
  await logActivity({ userId: me.id, action: "CREATE", entity: "users", entityId: u.id, summary: `Added administrator ${u.email} (${u.role})` });
  revalidatePath("/dashboard-admin/users");
  return back("/dashboard-admin/users", "Saved: administrator added.");
}

export async function updateUser(id: number, _p: FormState, fd: FormData): Promise<FormState> {
  const me = await requireSuperAdmin();
  const parsed = userSchema.safeParse(Object.fromEntries(fd.entries()));
  if (!parsed.success) return { ok: false, message: "Please review the form.", errors: toErrors(parsed.error) };
  const d = parsed.data;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return { ok: false, message: "User not found." };
  const demoting = target.role === "SUPER_ADMIN" && target.isActive && (d.role !== "SUPER_ADMIN" || !d.isActive);
  if (demoting && (await activeSuperAdminCount()) <= 1) return { ok: false, message: "Cannot change or deactivate the last active Super Admin." };
  if (me.id === id && !d.isActive) return { ok: false, message: "You cannot deactivate your own account." };
  const dup = await prisma.user.findFirst({ where: { email: d.email, NOT: { id } } });
  if (dup) return { ok: false, errors: { email: "Email already in use" }, message: "Email already in use." };
  await prisma.user.update({ where: { id }, data: d });
  if (!d.isActive || d.role !== target.role) await destroyUserSessions(id);
  if (d.role !== target.role) await logActivity({ userId: me.id, action: "ROLE_CHANGE", entity: "users", entityId: id, summary: `Role of ${target.email}: ${target.role} → ${d.role}` });
  await logActivity({ userId: me.id, action: "UPDATE", entity: "users", entityId: id, summary: `Updated user ${d.email}${d.isActive ? "" : " (deactivated)"}` });
  revalidatePath("/dashboard-admin/users");
  return back("/dashboard-admin/users", "Saved: user updated.");
}

export async function deleteUser(id: number): Promise<void> {
  const me = await requireSuperAdmin();
  const t = await prisma.user.findUnique({ where: { id } });
  if (!t) return back("/dashboard-admin/users", "User not found.");
  if (t.id === me.id) return back("/dashboard-admin/users", "You cannot delete your own account.");
  if (t.role === "SUPER_ADMIN" && t.isActive && (await activeSuperAdminCount()) <= 1) return back("/dashboard-admin/users", "Cannot delete the last active Super Admin.");
  await prisma.user.delete({ where: { id } });
  await logActivity({ userId: me.id, action: "DELETE", entity: "users", entityId: id, summary: `Deleted user ${t.email}` });
  return back("/dashboard-admin/users", "Deleted: user removed.");
}

export async function resetUserPassword(id: number): Promise<void> {
  const me = await requireSuperAdmin();
  const t = await prisma.user.findUnique({ where: { id } });
  if (!t) return back("/dashboard-admin/users", "User not found.");
  const temp = generateTempPassword();
  await prisma.user.update({ where: { id }, data: { passwordHash: await hashPassword(temp) } });
  await destroyUserSessions(id);
  await logActivity({ userId: me.id, action: "PASSWORD", entity: "users", entityId: id, summary: `Reset password of ${t.email}` });
  // The temporary password is shown once via a flash cookie, never in the URL or logs.
  const { cookies } = await import("next/headers");
  (await cookies()).set("apex_flash_pw", `${t.email}|${temp}`, { httpOnly: true, sameSite: "lax", path: "/dashboard-admin/users", maxAge: 60, secure: process.env.NODE_ENV === "production" });
  redirect("/dashboard-admin/users");
}

/* ---------------- Contact ---------------- */
export async function setMessageStatus(id: number, status: "UNREAD" | "READ" | "REPLIED"): Promise<void> {
  const me = await requireUser();
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  await logActivity({ userId: me.id, action: "UPDATE", entity: "contact", entityId: id, summary: `Message #${id} status → ${status}` });
  revalidatePath("/dashboard-admin/contact");
  revalidatePath("/dashboard-admin");
  redirect(`/dashboard-admin/contact/${id}?msg=${encodeURIComponent("Message status updated.")}`);
}

export async function deleteMessage(id: number): Promise<void> {
  const me = await requireUser();
  await prisma.contactMessage.delete({ where: { id } }).catch(() => undefined);
  await logActivity({ userId: me.id, action: "DELETE", entity: "contact", entityId: id, summary: `Deleted message #${id}` });
  revalidatePath("/dashboard-admin");
  return back("/dashboard-admin/contact", "Deleted: message removed.");
}

/* ---------------- Settings ---------------- */
export async function saveSettings(_p: FormState, fd: FormData): Promise<FormState> {
  const me = await requireSuperAdmin();
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of SETTING_FIELDS) {
    let v: z.ZodTypeAny = z.string().trim().max(1000);
    // Optional fields: empty is allowed; otherwise the value must be well-formed.
    if (f.key === "email") v = z.string().trim().max(190).refine((x) => !x || z.string().email().safeParse(x).success, "Enter a valid email address");
    if (f.key === "whatsapp") v = z.string().trim().max(30).transform((x) => x.replace(/[\s+()-]/g, "")).refine((x) => !x || /^[1-9]\d{7,14}$/.test(x), "Use international format, digits only (e.g. 628123456789)");
    if (f.key === "maps_embed_url") v = z.string().trim().max(1000).refine((x) => !x || safeMapsUrl(x) !== null, "Must be a Google Maps embed URL (https://www.google.com/maps/embed?...)");
    shape[f.key] = v;
  }
  const parsed = z.object(shape).safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, message: "Invalid input.", errors: toErrors(parsed.error) };
  const entries = Object.entries(parsed.data as Record<string, string>);
  await prisma.$transaction(entries.map(([key, value]) => prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })));
  await logActivity({ userId: me.id, action: "SETTINGS", entity: "settings", summary: `Updated site settings (${entries.length} fields)` });
  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}