import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getCatalogTree } from "@/lib/catalog";
import { pageParam, str } from "@/lib/utils";
import { EmptyState, Icon, Pagination } from "@/components/ui";
import { ProductSidebar } from "@/components/product-sidebar";
import { ProductImage } from "@/components/product-parts";

export async function generateMetadata() {
  return buildMetadata({
    pageKey: "products",
    title: "Products",
    description: "Browse laboratory, testing, and industrial equipment by product type.",
    path: "/products",
  });
}

const PER = 12;

export default async function Products({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const page = pageParam(sp.page);
  const typeSlug = str(sp.type).slice(0, 190);

  const tree = await getCatalogTree();
  const active = tree.find((x) => x.slug === typeSlug) ?? null;

  const where = {
    isActive: true,
    productType: { is: { isActive: true } },
    ...(active ? { productTypeId: active.id } : {}),
  };
  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      skip: (page - 1) * PER,
      take: PER,
      select: { id: true, slug: true, name: true, brand: true, model: true, imageId: true },
    }),
  ]);

  return (
    <div className="container-x pt-8">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-label-md text-on-surface-variant">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-primary"><Icon name="home" className="text-[16px]" />Home</Link>
        <Icon name="chevron_right" className="text-[14px]" />
        {active ? <Link href="/products" className="hover:text-primary">Products</Link> : <span className="text-on-surface">Products</span>}
        {active && (
          <>
            <Icon name="chevron_right" className="text-[14px]" />
            <span className="text-on-surface">{active.name}</span>
          </>
        )}
      </nav>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <ProductSidebar groups={tree} activeType={active?.slug} />

        <section aria-labelledby="prod-h">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2 border-b border-line pb-4">
            <h1 id="prod-h" className="text-headline-lg text-navy">{active ? active.name : "All Products"}</h1>
            <p className="text-body-sm text-on-surface-variant">{total} product(s)</p>
          </div>

          {items.length === 0 ? (
            <EmptyState
              icon="inventory_2"
              title={active ? "No products in this category yet." : "Products are not available yet"}
              text={active ? undefined : "The catalog is being prepared."}
            />
          ) : (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((p) => (
                <li key={p.id}>
                  <Link href={`/products/${p.slug}`} className="group block">
                    <ProductImage id={p.imageId} alt={p.name} />
                    <h2 className="mt-3 line-clamp-2 px-1 text-center text-body-md text-navy group-hover:text-primary">{p.name}</h2>
                    {(p.brand || p.model) && (
                      <p className="mt-0.5 text-center text-body-sm text-on-surface-variant">{[p.brand, p.model].filter(Boolean).join(" · ")}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Pagination
            page={page}
            pages={Math.max(1, Math.ceil(total / PER))}
            basePath="/products"
            params={active ? { type: active.slug } : undefined}
          />
        </section>
      </div>
    </div>
  );
}