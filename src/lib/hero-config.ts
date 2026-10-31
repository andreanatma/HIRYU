// Konfigurasi hero. Boleh dipakai di server MAUPUN client (tanpa akses database).
import { T } from "./dictionary";

export type HeroPageKey = "service" | "products" | "portfolio" | "about" | "gallery" | "blogs" | "contact";

export type HeroPageDef = {
  key: HeroPageKey;
  label: string;
  icon: string;
  /** Teks bawaan bila judul / deskripsi dikosongkan di dashboard. */
  defTitle: string;
  defText: string;
};

export const HERO_PAGES: readonly HeroPageDef[] = [
  { key: "service", label: "Services", icon: "design_services", defTitle: T.svc_hero_title, defText: T.svc_hero_text },
  { key: "products", label: "Products", icon: "science", defTitle: T.prod_hero_title, defText: T.prod_hero_text },
  { key: "portfolio", label: "Portfolio", icon: "folder_special", defTitle: T.pf_hero_title, defText: T.pf_hero_text },
  { key: "about", label: "About Us", icon: "info", defTitle: "PT Hiryu Techno Indonesia", defText: T.about_hero_text },
  { key: "gallery", label: "Gallery", icon: "photo_camera", defTitle: T.gal_hero_title, defText: T.gal_hero_text },
  { key: "blogs", label: "Blogs", icon: "terminal", defTitle: T.blog_hero_title, defText: T.blog_hero_text },
  { key: "contact", label: "Contact Us", icon: "headset_mic", defTitle: T.contact_hero_title, defText: T.contact_hero_text },
] as const;

export const HOME_HERO_MAX = 8; // jumlah maksimum gambar slider homepage
export const HERO_TITLE_MAX = 160;
export const HERO_TEXT_MAX = 500;

/** Nama field form. Dipakai bersama oleh form (client) dan server action. */
export const heroField = (key: HeroPageKey, f: "imageId" | "title" | "description") => `${key}_${f}`;
export const HOME_SLIDES_FIELD = "home_slides";
