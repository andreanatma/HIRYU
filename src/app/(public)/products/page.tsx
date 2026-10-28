import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { EmptyState } from "@/components/ui";
import { PageHero } from "@/components/public";
import { ProductAccordion } from "@/components/client";

export const generateMetadata = () => buildMetadata({ pageKey: "products", title: "Products", description: "Browse laboratory, testing, and industrial equipment by product type.", path: "/products" });

export default async function Products() {
  const types = await prisma.productType.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: { products: { where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { name: "asc" }], select: { id: true, slug: true, name: true, brand: true, model: true, imageId: true } } },
  });
  return (
    <>
      <PageHero eyebrow="Product catalog" title="Laboratory & Testing Equipment" text="Select a product type to see the available products, then open a product for its details and datasheet." icon="inventory_2" />
      <section className="container-x py-14">
        {types.length === 0 ? <EmptyState icon="inventory_2" title="Products are not available yet" text="The catalog is being prepared." /> : (
          <ProductAccordion groups={types.map((t) => ({ id: t.id, name: t.name, description: t.description, products: t.products }))} />
        )}
      </section>
    </>
  );
}
