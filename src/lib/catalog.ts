import "server-only";
import { prisma } from "./db";

/** Product Type aktif + produk aktif di dalamnya (untuk sidebar). */
export async function getCatalogTree() {
  const types = await prisma.productType.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      products: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
        select: { slug: true, name: true },
      },
    },
  });
  return types.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    count: t.products.length,
    products: t.products,
  }));
}

/** Daftar Product Type untuk dropdown navbar. */
export async function getNavTypes() {
  return prisma.productType.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    select: { slug: true, name: true },
  });
}