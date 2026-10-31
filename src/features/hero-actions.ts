"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { deleteMediaIfUnused } from "@/lib/media";
import { HERO_PAGES, HERO_TEXT_MAX, HERO_TITLE_MAX, HOME_HERO_MAX, HOME_SLIDES_FIELD, heroField } from "@/lib/hero-config";
import type { FormState } from "./crud-actions";

const idOrNull = z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().positive().nullable());
const optText = (max: number, label: string) =>
  z.string().trim().max(max, `${label} must be at most ${max} characters`).transform((v) => (v === "" ? null : v));

function parseIdList(v: FormDataEntryValue | null): number[] {
  const ids = String(v ?? "").split(",").map((x) => Number(x.trim())).filter((n) => Number.isInteger(n) && n > 0);
  return [...new Set(ids)].slice(0, HOME_HERO_MAX);
}

/** Menyimpan semua pengaturan hero sekaligus: slider homepage + 1 gambar/judul/deskripsi untuk tiap halaman. Hanya Super Admin. */
export async function saveHeroes(_p: FormState, fd: FormData): Promise<FormState> {
  const me = await requireSuperAdmin();

  // 1) Validasi bentuk data
  const shape: Record<string, z.ZodTypeAny> = {};
  const raw: Record<string, unknown> = {};
  for (const p of HERO_PAGES) {
    shape[heroField(p.key, "imageId")] = idOrNull;
    shape[heroField(p.key, "title")] = optText(HERO_TITLE_MAX, `${p.label} hero title`);
    shape[heroField(p.key, "description")] = optText(HERO_TEXT_MAX, `${p.label} hero description`);
    for (const f of ["imageId", "title", "description"] as const) raw[heroField(p.key, f)] = fd.get(heroField(p.key, f)) ?? "";
  }
  const parsed = z.object(shape).safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] = i.message;
    return { ok: false, message: "Please review the highlighted fields.", errors };
  }
  const data = parsed.data as Record<string, number | string | null>;

  // 2) Validasi media di server (jangan percaya ID dari browser): harus ada & bertipe gambar
  const requestedSlides = parseIdList(fd.get(HOME_SLIDES_FIELD));
  const wanted = new Set<number>(requestedSlides);
  for (const p of HERO_PAGES) { const id = data[heroField(p.key, "imageId")]; if (typeof id === "number") wanted.add(id); }
  const okRows = wanted.size
    ? await prisma.mediaFile.findMany({ where: { id: { in: [...wanted] }, mimeType: { startsWith: "image/" } }, select: { id: true } })
    : [];
  const ok = new Set(okRows.map((r) => r.id));
  const errors: Record<string, string> = {};
  for (const p of HERO_PAGES) {
    const k = heroField(p.key, "imageId");
    const id = data[k];
    if (typeof id === "number" && !ok.has(id)) errors[k] = "Invalid image";
  }
  if (Object.keys(errors).length) return { ok: false, message: "Please review the highlighted fields.", errors };
  const slideIds = requestedSlides.filter((id) => ok.has(id));

  // 3) Simpan dalam satu transaksi
  const [oldPages, oldSlides] = await Promise.all([
    prisma.pageHero.findMany({ select: { pageKey: true, imageId: true } }),
    prisma.homeHeroSlide.findMany({ select: { imageId: true } }),
  ]);
  try {
    await prisma.$transaction([
      ...HERO_PAGES.map((p) => {
        const v = {
          title: data[heroField(p.key, "title")] as string | null,
          description: data[heroField(p.key, "description")] as string | null,
          imageId: data[heroField(p.key, "imageId")] as number | null,
        };
        return prisma.pageHero.upsert({ where: { pageKey: p.key }, update: v, create: { pageKey: p.key, ...v } });
      }),
      prisma.homeHeroSlide.deleteMany({}),
      ...(slideIds.length ? [prisma.homeHeroSlide.createMany({ data: slideIds.map((imageId, i) => ({ imageId, displayOrder: i })) })] : []),
    ]);
  } catch (e) {
    console.error("saveHeroes", e);
    return { ok: false, message: "Could not save hero settings. Make sure the latest database migration has been applied (npx prisma migrate deploy)." };
  }

  // 4) Hapus file lama yang tidak dipakai lagi (setelah transaksi, supaya hitungan pemakaian akurat)
  const oldIds = new Set<number>([...oldSlides.map((r) => r.imageId), ...oldPages.flatMap((r) => (r.imageId ? [r.imageId] : []))]);
  for (const id of oldIds) await deleteMediaIfUnused(id);

  await logActivity({ userId: me.id, action: "SETTINGS", entity: "hero", summary: `Updated hero banners (homepage slides: ${slideIds.length}, page heroes: ${HERO_PAGES.length})` });
  revalidatePath("/", "layout");
  return { ok: true, message: "Hero settings saved." };
}
