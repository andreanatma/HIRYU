import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { PAGE_KEYS, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Only public, indexable URLs. Never includes /dashboard-admin, drafts, or inactive products/types.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, products, portfolio, blogs] = await Promise.all([
    prisma.service.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.product.findMany({ where: { isActive: true, productType: { is: { isActive: true } } }, select: { slug: true, updatedAt: true } }),
    prisma.portfolio.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.blog.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ]);
  return [
    ...PAGE_KEYS.map((p) => ({ url: `${SITE_URL}${p.path === "/" ? "" : p.path}`, changeFrequency: "weekly" as const, priority: p.path === "/" ? 1 : 0.7 })),
    ...services.map((x) => ({ url: `${SITE_URL}/service/${x.slug}`, lastModified: x.updatedAt, priority: 0.6 })),
    ...products.map((x) => ({ url: `${SITE_URL}/products/${x.slug}`, lastModified: x.updatedAt, priority: 0.7 })),
    ...portfolio.map((x) => ({ url: `${SITE_URL}/portfolio/${x.slug}`, lastModified: x.updatedAt, priority: 0.5 })),
    ...blogs.map((x) => ({ url: `${SITE_URL}/blogs/${x.slug}`, lastModified: x.updatedAt, priority: 0.6 })),
  ];
}