export type Lang = "id" | "en";
export const LANGS: Lang[] = ["id", "en"];
export const DEFAULT_LANG: Lang = "en"; // ubah ke "id" bila bahasa utama situs Indonesia
export const LANG_COOKIE = "lang";
export const isLang = (v: unknown): v is Lang => v === "id" || v === "en";

/** Ambil field terlokalisasi: pakai `${field}Id` bila bahasa ID dan terisi, selain itu field asli (EN). */
export function loc(row: object, field: string, lang: Lang): string {
  const r = row as Record<string, unknown>;
  if (lang === "id") {
    const v = r[`${field}Id`];
    if (typeof v === "string" && v.trim()) return v;
  }
  const base = r[field];
  return typeof base === "string" ? base : "";
}

/** Setting situs: pakai `${key}_id` bila bahasa ID dan terisi. */
export function sv(s: Record<string, string>, key: string, lang: Lang): string {
  return (lang === "id" && s[`${key}_id`]) || s[key] || "";
}

export const fmt = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));