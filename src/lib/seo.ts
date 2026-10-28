import "server-only";
import type { Metadata } from "next";
import { prisma } from "./db";
import { getSettings } from "./settings";

export const SITE_URL = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const PAGE_KEYS = [
  { key: "home", label: "Home", path: "/" },
  { key: "service", label: "Services", path: "/service" },
  { key: "products", label: "Products", path: "/products" },
  { key: "portfolio", label: "Portfolio", path: "/portfolio" },
  { key: "about-us", label: "About Us", path: "/about-us" },
  { key: "gallery", label: "Gallery", path: "/gallery" },
  { key: "blogs", label: "Blogs", path: "/blogs" },
  { key: "contact", label: "Contact Us", path: "/contact" },
] as const;

type Opts = { pageKey?: string; title?: string; description?: string; path: string; image?: string | null; type?: "website" | "article"; noindex?: boolean };

import { getLang } from "./i18n";
import { sv } from "./lang";

export async function buildMetadata(o: Opts): Promise<Metadata> {
  const lang = await getLang();
  const [s, seo] = await Promise.all([getSettings(), o.pageKey ? prisma.seoSetting.findUnique({ where: { pageKey: o.pageKey } }) : null]);
  const title = (lang === "id" && seo?.titleId) || seo?.title || o.title || s.company_name;
  const description = (lang === "id" && seo?.descriptionId) || seo?.description || o.description || sv(s, "tagline", lang);
  const image = seo?.ogImageId ? `/media/${seo.ogImageId}` : o.image ?? undefined;
  const noindex = seo?.noindex || o.noindex;
  return {
    title,
    description,
    alternates: { canonical: o.path },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: { title, description, url: o.path, siteName: s.company_name, type: o.type ?? "website", locale: lang === "id" ? "id_ID" : "en_US", images: image ? [{ url: image }] : undefined },
    twitter: { card: image ? "summary_large_image" : "summary", title, description },
  };
}

export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
