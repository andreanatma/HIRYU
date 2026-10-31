/**
 * Batas jumlah data per halaman untuk SETIAP menu. Ubah angkanya di sini saja.
 * Semakin kecil angkanya, semakin pendek halaman yang harus di-scroll.
 */

/** Website publik (kartu/foto per halaman). Kelipatan 3 agar baris grid 3 kolom selalu penuh. */
export const PUBLIC_PER_PAGE = {
  services: 9,
  portfolio: 9,
  gallery: 12,
  // products & blogs sudah punya batas sendiri di halamannya (12 dan 9) — angkanya sama dengan ini.
  products: 12,
  blogs: 9,
} as const;

/** Dashboard admin: default + pilihan "Rows" per menu (kunci = key modul di src/features/modules.ts). */
export type AdminLimit = { def: number; options: number[] };

const STANDARD: AdminLimit = { def: 10, options: [10, 20, 50] };

export const ADMIN_PAGE_LIMITS: Record<string, AdminLimit> = {
  services: STANDARD,
  "product-types": STANDARD,
  products: STANDARD,
  portfolio: STANDARD,
  gallery: { def: 12, options: [12, 24, 48] },
  blogs: STANDARD,
  "our-team": STANDARD,
  brands: STANDARD,
};

/** Menentukan jumlah baris per halaman dari ?per=… — hanya nilai yang ada di daftar pilihan yang diterima. */
export function adminLimit(key: string, raw?: string): { per: number; def: number; options: number[] } {
  const cfg = ADMIN_PAGE_LIMITS[key] ?? STANDARD;
  const n = Number(raw);
  const per = cfg.options.includes(n) ? n : cfg.def;
  return { per, def: cfg.def, options: cfg.options };
}