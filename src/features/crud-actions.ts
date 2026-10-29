"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { deleteMediaIfUnused, saveUpload } from "@/lib/media";
import { slugify } from "@/lib/utils";
import { getModule, type FieldDef, type ModuleDef } from "./modules";

export type FormState = { ok: boolean; message?: string; errors?: Record<string, string> };

// Dynamic Prisma delegate access lives only here (module definitions are the allow-list: getModule() rejects unknown keys).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (m: ModuleDef): any => (prisma as any)[m.model];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const anyDb = (name: string): any => (prisma as any)[name];

const MAX_GALLERY = 40;

function fieldSchema(f: FieldDef): z.ZodTypeAny {
  const req = `${f.label} is required`;
  switch (f.type) {
    case "text": case "textarea": case "longtext": case "slug": {
      let s = z.string().trim();
      if (f.max) s = s.max(f.max, `${f.label} must be at most ${f.max} characters`);
      if (f.required) s = s.min(1, req);
      return f.required ? s : s.transform((v) => (v === "" ? null : v));
    }
    case "url": {
      const s = z.string().trim().max(f.max ?? 255, `${f.label} is too long`).refine((v) => {
        if (!v) return true;
        try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; }
      }, "Enter a valid http(s) URL");
      return s.transform((v) => (v === "" ? null : v));
    }
    case "number":
      return z.preprocess((v) => (v === "" || v == null ? 0 : Number(v)), z.number({ invalid_type_error: `${f.label} must be a number` }).int().min(0).max(100000));
    case "boolean":
      return z.preprocess((v) => v === "on" || v === "true", z.boolean());
    case "date":
      return z.preprocess((v) => (v === "" || v == null ? null : new Date(String(v))), z.date({ invalid_type_error: "Invalid date" }).nullable());
    case "select":
      return z.enum((f.options ?? []).map((o) => o.value) as [string, ...string[]], { errorMap: () => ({ message: `${f.label} is invalid` }) });
    case "image": case "pdf": case "relation": {
      const base = z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().positive().nullable());
      return f.required ? base.refine((v) => v !== null, req) : base;
    }
    case "images":
      return z.any();
  }
}

function parse(m: ModuleDef, fd: FormData) {
  const shape: Record<string, z.ZodTypeAny> = {};
  const raw: Record<string, unknown> = {};
  for (const f of m.fields) {
    if (f.type === "images") continue; // handled separately
    shape[f.name] = fieldSchema(f);
    raw[f.name] = fd.get(f.name) ?? "";
  }
  return z.object(shape).safeParse(raw);
}

function parseIdList(v: FormDataEntryValue | null): number[] {
  const ids = String(v ?? "").split(",").map((x) => Number(x.trim())).filter((n) => Number.isInteger(n) && n > 0);
  return [...new Set(ids)].slice(0, MAX_GALLERY);
}

async function uniqueSlug(m: ModuleDef, base: string, selfId: number | null): Promise<string> {
  const root = slugify(base) || "item";
  let slug = root;
  for (let i = 2; i < 200; i++) {
    const found = await db(m).findUnique({ where: { slug } });
    if (!found || found.id === selfId) return slug;
    slug = `${root}-${i}`;
  }
  return `${root}-${Date.now()}`;
}

function revalidate(m: ModuleDef) {
  for (const p of m.publicPaths) revalidatePath(p, p === "/" ? "page" : "layout"); // "layout" ikut menyegarkan /products/[slug], dll.
  revalidatePath("/sitemap.xml");
  revalidatePath(`/dashboard-admin/${m.key}`);
  revalidatePath("/dashboard-admin");
}

async function syncImages(m: ModuleDef, id: number, ids: number[]) {
  const mi = m.multiImage!;
  const child = anyDb(mi.model);
  const old: number[] = (await child.findMany({ where: { [mi.fk]: id } })).map((r: Record<string, number>) => r[mi.media]);
  await prisma.$transaction([
    child.deleteMany({ where: { [mi.fk]: id } }),
    ...(ids.length ? [child.createMany({ data: ids.map((mid, i) => ({ [mi.fk]: id, [mi.media]: mid, displayOrder: i })) })] : []),
  ]);
  for (const o of old) if (!ids.includes(o)) await deleteMediaIfUnused(o);
}

async function recordSlugChange(m: ModuleDef, oldSlug: string, newSlug: string) {
  if (!m.slugRedirect || oldSlug === newSlug) return;
  const entity = m.slugRedirect;
  await prisma.slugRedirect.deleteMany({ where: { entity, oldSlug: newSlug } }); // avoid loops
  await prisma.slugRedirect.updateMany({ where: { entity, newSlug: oldSlug }, data: { newSlug } }); // collapse chains
  await prisma.slugRedirect.upsert({ where: { entity_oldSlug: { entity, oldSlug } }, update: { newSlug }, create: { entity, oldSlug, newSlug } });
}

export async function saveEntity(moduleKey: string, id: number | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const m = getModule(moduleKey);
  if (!m) return { ok: false, message: "Module not found." };

  const parsed = parse(m, fd);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] = i.message;
    return { ok: false, message: "Please review the highlighted fields.", errors };
  }
  const data = { ...(parsed.data as Record<string, unknown>) };

  // Server-side relation and media validation (never trust IDs coming from the browser).
  for (const f of m.fields) {
    if (f.type === "relation" && data[f.name] != null) {
      const row = await anyDb(f.relation!.model).findUnique({ where: { id: data[f.name] as number } });
      if (!row) return { ok: false, message: "Please review the highlighted fields.", errors: { [f.name]: `${f.label} is invalid` } };
    }
    if ((f.type === "image" || f.type === "pdf") && data[f.name] != null) {
      const mf = await prisma.mediaFile.findUnique({ where: { id: data[f.name] as number } });
      const okType = mf && (f.type === "pdf" ? mf.mimeType === "application/pdf" : mf.mimeType.startsWith("image/"));
      if (!okType) return { ok: false, message: "Please review the highlighted fields.", errors: { [f.name]: "Invalid file" } };
    }
  }
  let galleryIds: number[] | null = null;
  if (m.multiImage) {
    galleryIds = parseIdList(fd.get(m.multiImage.field));
    const found = await prisma.mediaFile.findMany({ where: { id: { in: galleryIds }, mimeType: { startsWith: "image/" } }, select: { id: true } });
    const ok = new Set(found.map((x) => x.id));
    galleryIds = galleryIds.filter((x) => ok.has(x));
  }

  if (m.slugSource) data.slug = await uniqueSlug(m, String(data.slug || data[m.slugSource] || ""), id);
  if (m.model === "blog") {
    if (data.status === "PUBLISHED" && !data.publishedAt) data.publishedAt = new Date();
    if (data.status === "DRAFT" && !fd.get("publishedAt")) data.publishedAt = null;
  }

  let before: Record<string, unknown> | null = null;
  try {
    if (id) {
      before = await db(m).findUnique({ where: { id } });
      if (!before) return { ok: false, message: "Record not found or already deleted." };
      await db(m).update({ where: { id }, data });
      if (m.slugSource) await recordSlugChange(m, String(before.slug), String(data.slug));
    } else {
      const created = await db(m).create({ data });
      id = created.id as number;
      await logActivity({ userId: user.id, action: "CREATE", entity: m.key, entityId: id, summary: `Created ${m.singular} "${String(data[m.nameField])}"` });
    }
    if (m.multiImage && galleryIds) await syncImages(m, id!, galleryIds);
  } catch (e) {
    console.error("saveEntity", e);
    return { ok: false, message: "Could not save. The slug may already be in use or a database error occurred." };
  }

  if (before) {
    const changed = Object.keys(data).filter((k) => String(before![k] ?? "") !== String(data[k] ?? ""));
    await logActivity({ userId: user.id, action: "UPDATE", entity: m.key, entityId: id, summary: `Updated ${m.singular} "${String(data[m.nameField])}" (fields: ${changed.join(", ") || "none"})` });
    for (const mf of m.mediaFields) {
      const old = before[mf] as number | null;
      if (old && old !== data[mf]) await deleteMediaIfUnused(old);
    }
  }
  revalidate(m);
  redirect(`/dashboard-admin/${m.key}?msg=${encodeURIComponent(`Saved: ${m.singular} saved successfully.`)}`);
}

export async function deleteEntity(moduleKey: string, id: number): Promise<void> {
  const user = await requireUser();
  const m = getModule(moduleKey);
  if (!m) redirect("/dashboard-admin");
  const row = await db(m).findUnique({ where: { id } });
  if (!row) redirect(`/dashboard-admin/${m.key}?msg=${encodeURIComponent("Record not found.")}`);

  if (m.deleteGuard) {
    const n = await anyDb(m.deleteGuard.model).count({ where: { [m.deleteGuard.fk]: id } });
    if (n > 0) redirect(`/dashboard-admin/${m.key}?msg=${encodeURIComponent(`Cannot delete: ${m.deleteGuard.message} (${n} linked).`)}`);
  }
  let childMedia: number[] = [];
  if (m.multiImage) {
    childMedia = (await anyDb(m.multiImage.model).findMany({ where: { [m.multiImage.fk]: id } })).map((r: Record<string, number>) => r[m.multiImage!.media]);
  }
  await db(m).delete({ where: { id } });
  for (const mf of m.mediaFields) await deleteMediaIfUnused(row[mf] as number | null);
  for (const c of childMedia) await deleteMediaIfUnused(c);
  await logActivity({ userId: user.id, action: "DELETE", entity: m.key, entityId: id, summary: `Deleted ${m.singular} "${String(row[m.nameField])}"` });
  revalidate(m);
  redirect(`/dashboard-admin/${m.key}?msg=${encodeURIComponent(`Deleted: ${m.singular} deleted successfully.`)}`);
}

export type UploadState = { ok: boolean; id?: number; url?: string; name?: string; size?: number; mime?: string; error?: string };

export async function uploadMedia(accept: "image" | "pdf", isPublic: boolean, fd: FormData): Promise<UploadState> {
  const user = await requireUser();
  const file = fd.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file selected." };
  try {
    const r = await saveUpload(file, { accept: [accept], isPublic, userId: user.id });
    if (!r.ok) return { ok: false, error: r.error };
    await logActivity({ userId: user.id, action: "UPLOAD", entity: "media", entityId: r.id, summary: `Uploaded ${r.name} (${r.mime}, ${r.size} B)` });
    return { ok: true, id: r.id, url: r.url, name: r.name, size: r.size, mime: r.mime };
  } catch (e) {
    console.error("upload", e);
    return { ok: false, error: "Could not store the file on the server." };
  }
}

/** Bulk gallery creation: ids come from prior uploadMedia() calls. Validated again on the server. */
export async function createGalleryItems(ids: number[]): Promise<{ ok: boolean; created: number; message: string }> {
  const user = await requireUser();
  const clean = [...new Set(ids.filter((n) => Number.isInteger(n) && n > 0))].slice(0, 100);
  const files = await prisma.mediaFile.findMany({ where: { id: { in: clean }, mimeType: { startsWith: "image/" } } });
  if (files.length === 0) return { ok: false, created: 0, message: "No valid images to add." };
  await prisma.gallery.createMany({ data: files.map((f) => ({ title: f.originalName.replace(/\.[^.]+$/, "").slice(0, 160) || "Image", imageId: f.id })) });
  await logActivity({ userId: user.id, action: "CREATE", entity: "gallery", summary: `Added ${files.length} gallery image(s) via bulk upload` });
  revalidatePath("/gallery"); revalidatePath("/"); revalidatePath("/dashboard-admin/gallery"); revalidatePath("/dashboard-admin");
  return { ok: true, created: files.length, message: `${files.length} image(s) added to the gallery.` };
}
