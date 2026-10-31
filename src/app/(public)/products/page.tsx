import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getPageHero } from "@/lib/hero";
import { t } from "@/lib/dictionary";
import { getCatalogTree } from "@/lib/catalog";
import { pageParam, str } from "@/lib/utils";
import { EmptyState, Icon, Pagination } from "@/components/ui";
import { PageHero } from "@/components/public";
import { Reveal } from "@/components/public/reveal";
import { ProductSidebar } from "@/components/product-sidebar";
import { ProductCard } from "@/components/product-parts";

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
  const hero = await getPageHero("products");
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
    <>
      <PageHero
        eyebrow={t("prod_hero_eyebrow")}
        title={active ? active.name : hero.title}
        text={hero.text}
        imageId={hero.imageId}
        icon="science"
        blend="mist"
      />

      {/* Latar: mist → biru muda (pola titik) → putih */}
      <section className="sec-deco sec-dots bg-gradient-to-b from-mist to-white pb-14 pt-4 md:pb-16 md:pt-6">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-label-md text-on-surface-variant">
            <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-primary"><Icon name="home" className="text-[16px]" />Home</Link>
            <Icon name="chevron_right" className="text-[14px]" />
            {active ? <Link href="/products" className="transition-colors hover:text-primary">Products</Link> : <span className="text-on-surface">Products</span>}
            {active && (
              <>
                <Icon name="chevron_right" className="text-[14px]" />
                <span className="text-on-surface">{active.name}</span>
              </>
            )}
          </nav>

          {/* Judul + jumlah produk berada di atas kedua kolom, sehingga sidebar dan baris kartu pertama dimulai di garis yang sama */}
          <Reveal>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-2 border-b border-line pb-4">
              <div>
                <h2 id="prod-h" className="text-headline-lg text-navy">{active ? active.name : "All Products"}</h2>
                <div className="mt-2 h-1 w-12 rounded bg-accent" />
              </div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-body-sm text-on-surface-variant shadow-sm ring-1 ring-line">
                <Icon name="inventory_2" className="text-[16px] text-primary" />{total} product(s)
              </p>
            </div>
          </Reveal>

          <div className="grid items-start gap-6 lg:grid-cols-[290px_1fr] lg:gap-8">
            <ProductSidebar groups={tree} activeType={active?.slug} />

            <section aria-labelledby="prod-h">
              {items.length === 0 ? (
                <EmptyState
                  icon="inventory_2"
                  title={active ? "No products in this category yet." : t("prod_empty_t")}
                  text={active ? undefined : t("prod_empty_x")}
                />
              ) : (
                <ul className="flow-cards [--cols:2] xl:[--cols:3] [--gap:0.75rem] md:[--gap:1.25rem]">
                  {items.map((p, i) => (
                    <li key={p.id} className="h-full"><ProductCard p={p} index={i} /></li>
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
      </section>
    </>
  );
}