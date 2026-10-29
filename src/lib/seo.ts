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
  const s = await getSettings();
  const title = o.title || s.company_name;
  const description = o.description || s.tagline;
  const image = o.image ?? undefined;
  return {
    title, description,
    alternates: { canonical: o.path },
    robots: o.noindex ? { index: false, follow: false } : undefined,
    openGraph: { title, description, url: o.path, siteName: s.company_name, type: o.type ?? "website", locale: "en_US", images: image ? [{ url: image }] : undefined },
    twitter: { card: image ? "summary_large_image" : "summary", title, description },
  };
}

export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
