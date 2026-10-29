import "server-only";
import type { Metadata } from "next";
import { prisma } from "./db";
import { getSettings } from "./settings";

const rawUrl = (process.env.SITE_URL ?? "http://localhost:3000").trim().replace(/\/+$/, "");
export const SITE_URL = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;

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

type Opts = {
  pageKey?: string;
  title?: string;
  description?: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noindex?: boolean;
  publishedTime?: Date | string | null;
  modifiedTime?: Date | string | null;
};

/** Rapikan spasi dan potong di batas kata agar sesuai tampilan hasil pencarian. */
function clean(text: string | null | undefined, max = 160): string | undefined {
  const t = (text ?? "").replace(/\s+/g, " ").trim();
  if (!t) return undefined;
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:\s]+$/, "") + "…";
}

const abs = (u: string) => (/^https?:\/\//i.test(u) ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);
const iso = (d: Date | string | null | undefined) => (d ? new Date(d).toISOString() : undefined);

export async function buildMetadata(o: Opts): Promise<Metadata> {
  const [s, seo] = await Promise.all([
    getSettings(),
    o.pageKey ? prisma.seoSetting.findUnique({ where: { pageKey: o.pageKey } }) : null,
  ]);

  const isHome = o.path === "/";
  const defaultHomeTitle = `${s.company_name} – ${s.tagline.replace(/\.$/, "")}`;
  const title = seo?.title || o.title || (isHome ? defaultHomeTitle : s.company_name);
  const description = clean(seo?.description || o.description || s.tagline);
  const imagePath = seo?.ogImageId ? `/media/${seo.ogImageId}` : o.image ?? undefined;
  const image = imagePath ? abs(imagePath) : undefined;
  const noindex = seo?.noindex || o.noindex;
  const type = o.type ?? "website";

  return {
    // Beranda memakai judul absolut agar template "%s | Nama Perusahaan" tidak menggandakan nama.
    title: isHome ? { absolute: title } : title,
    description,
    alternates: { canonical: o.path },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: o.path,
      siteName: s.company_name,
      type,
      locale: "en_US",
      images: image ? [{ url: image, alt: title }] : undefined,
      ...(type === "article"
        ? { publishedTime: iso(o.publishedTime), modifiedTime: iso(o.modifiedTime) }
        : {}),
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [image] : undefined },
  };
}

/** Serialisasi JSON-LD yang aman untuk disisipkan di <script>. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function breadcrumbLd(items: [name: string, path: string][]): string {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: abs(path),
    })),
  });
}

export function organizationLd(s: { company_name: string; email: string; whatsapp: string; address: string }): string {
  const wa = s.whatsapp.replace(/\D/g, "");
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.company_name,
    url: SITE_URL,
    email: s.email || undefined,
    telephone: wa ? `+${wa}` : undefined,
    address: s.address ? { "@type": "PostalAddress", streetAddress: s.address, addressCountry: "ID" } : undefined,
  });
}