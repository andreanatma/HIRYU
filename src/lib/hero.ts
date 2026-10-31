import "server-only";
import { cache } from "react";
import { prisma } from "./db";
import { HERO_PAGES, type HeroPageKey } from "./hero-config";

export type ResolvedHero = { title: string; text: string; imageId: number | null };

/** ID media untuk slider hero homepage (urut). Kosong → homepage memakai gambar bawaan. */
export const getHomeSlides = cache(async (): Promise<number[]> => {
  try {
    const rows = await prisma.homeHeroSlide.findMany({ orderBy: [{ displayOrder: "asc" }, { id: "asc" }], select: { imageId: true } });
    return rows.map((r) => r.imageId);
  } catch (e) {
    // Mis. migrasi belum dijalankan: jangan sampai homepage ikut mati.
    console.error("getHomeSlides", e);
    return [];
  }
});

type HeroRow = { title: string | null; description: string | null; imageId: number | null };

const getAllPageHeroes = cache(async (): Promise<Map<string, HeroRow>> => {
  const map = new Map<string, HeroRow>();
  try {
    const rows = await prisma.pageHero.findMany();
    for (const r of rows) map.set(r.pageKey, { title: r.title, description: r.description, imageId: r.imageId });
  } catch (e) {
    console.error("getAllPageHeroes", e);
  }
  return map;
});

/** Hero satu halaman: nilai dari dashboard, atau teks bawaan bila kosong. */
export async function getPageHero(key: HeroPageKey): Promise<ResolvedHero> {
  const def = HERO_PAGES.find((p) => p.key === key)!;
  const row = (await getAllPageHeroes()).get(key);
  return {
    title: row?.title?.trim() || def.defTitle,
    text: row?.description?.trim() || def.defText,
    imageId: row?.imageId ?? null,
  };
}

/** Semua nilai mentah untuk form dashboard (judul / deskripsi kosong = memakai default). */
export async function getHeroFormValues() {
  const [slides, map] = await Promise.all([getHomeSlides(), getAllPageHeroes()]);
  const pages: Record<string, { imageId: number | null; title: string; description: string }> = {};
  for (const p of HERO_PAGES) {
    const r = map.get(p.key);
    pages[p.key] = { imageId: r?.imageId ?? null, title: r?.title ?? "", description: r?.description ?? "" };
  }
  return { slides, pages };
}
