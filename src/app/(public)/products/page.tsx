import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { t } from "@/lib/dictionary";
import { EmptyState } from "@/components/ui";
import { PageHero } from "@/components/public";
import { ProductAccordion } from "@/components/client";

export async function generateMetadata() {
  return buildMetadata({ pageKey: "products", title: t("nav_products"), description: t("prod_meta_desc"), path: "/products" });
}

export default async function Products() {
  const types = await prisma.productType.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: { products: { where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { name: "asc" }], select: { id: true, slug: true, name: true, brand: true, model: true, imageId: true } } },
  });
  return (
    <>
      <PageHero eyebrow={t("prod_hero_eyebrow")} title={t("prod_hero_title")} text={t("prod_hero_text")} icon="inventory_2" />
      <section className="container-x py-14">
        {types.length === 0 ? <EmptyState icon="inventory_2" title={t("prod_empty_t")} text={t("prod_empty_x")} /> : (
          <ProductAccordion groups={types.map((ty) => ({
            id: ty.id,
            name: ty.name,
            description: ty.description || null,
            products: ty.products.map((p) => ({ id: p.id, slug: p.slug, name: p.name, brand: p.brand, model: p.model, imageId: p.imageId })),
          }))} />
        )}
      </section>
    </>
  );
}