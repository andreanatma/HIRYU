import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata, jsonLd, SITE_URL } from "@/lib/seo";
import { redirectIfRenamed } from "@/lib/redirects";
import { getCatalogTree } from "@/lib/catalog";
import { t } from "@/lib/dictionary";
import { Icon, SafeText } from "@/components/ui";
import { CtaBand } from "@/components/public";
import { Reveal } from "@/components/public/reveal";
import { ProductSidebar } from "@/components/product-sidebar";
import { DetailBreadcrumb } from "@/components/detail-parts";
import { ProductCard, ProductImage } from "@/components/product-parts";

type P = { params: Promise<{ slug: string }> };
const get = (slug: string) =>
  prisma.product.findFirst({
    where: { slug, isActive: true, productType: { is: { isActive: true } } },
    include: { productType: true, pdf: true },
  });

export async function generateMetadata({ params }: P) {
  const p = await get((await params).slug);
  if (!p) return {};
  return buildMetadata({
    title: p.metaTitle || [p.name, p.brand].filter(Boolean).join(" – "),
    description: p.metaDescription || p.description.slice(0, 155),
    path: `/products/${p.slug}`,
    image: p.imageId ? `/media/${p.imageId}` : null,
  });
}

export default async function ProductDetail({ params }: P) {
  const slug = (await params).slug;
  const p = await get(slug);
  if (!p) {
    await redirectIfRenamed("product", slug, "/products");
    notFound();
  }
  const tree = await getCatalogTree();
  const typeName = p.productType?.name ?? null;
  const typeSlug = p.productType?.slug ?? null;

  // Produk lain pada tipe yang sama (tautan internal + halaman lebih padat)
  const related = await prisma.product.findMany({
    where: { isActive: true, NOT: { id: p.id }, productType: { is: { isActive: true } }, ...(p.productTypeId ? { productTypeId: p.productTypeId } : {}) },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    take: 4,
    select: { id: true, slug: true, name: true, brand: true, model: true, imageId: true },
  });

  const facts: [string, string, string | null][] = [
    ["workspace_premium", "Brand", p.brand],
    ["public", "Product origin", p.productOrigin],
    ["tag", "Model", p.model],
    ["category", "Product type", typeName],
  ];
  const hasPdf = !!p.pdf && p.pdf.isPublic && p.pdf.mimeType === "application/pdf";

  const hasRelated = related.length > 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            description: p.description,
            brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined,
            model: p.model ?? undefined,
            image: p.imageId ? `${SITE_URL}/media/${p.imageId}` : undefined,
            url: `${SITE_URL}/products/${p.slug}`,
          }),
        }}
      />

      <section className={hasRelated ? "sec-deco sec-dots bg-gradient-to-b from-mist to-[#EEF4FC] pb-14 pt-8 md:pb-16" : "sec-deco sec-dots bg-gradient-to-b from-mist to-white pb-14 pt-8 md:pb-16"}>
        <div className="container-x">
          <DetailBreadcrumb
            trail={[
              { label: "Products", href: "/products" },
              ...(typeName && typeSlug ? [{ label: typeName, href: `/products?type=${typeSlug}` }] : []),
            ]}
            current={p.name}
          />

          <div className="grid items-start gap-6 lg:grid-cols-[290px_1fr] lg:gap-8">
            <ProductSidebar groups={tree} activeType={typeSlug} activeProduct={p.slug} />

            <Reveal>
              <article className="rounded-xl border border-white/70 bg-white p-5 shadow-[0_26px_50px_-28px_rgba(7,29,51,0.45)] sm:p-7">
                <div className="grid gap-7 md:grid-cols-5 md:gap-8">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <div aria-hidden="true" className="absolute -inset-2 -z-10 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/25 to-transparent blur-xl" />
                      <ProductImage id={p.imageId} alt={p.name} className="shadow-sm" />
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    {typeName && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-label-md uppercase tracking-wider text-primary">
                        <Icon name="category" className="text-[14px]" />{typeName}
                      </span>
                    )}
                    <h1 className="mt-3 text-headline-lg text-navy md:text-headline-xl">{p.name}</h1>
                    <div className="mt-3 h-1 w-14 rounded bg-accent" />

                    {/* Fakta produk: daftar rapat tanpa kartu (label di kiri, nilai di kanan, dipisah garis tipis) */}
                    <dl className="mt-5 divide-y divide-line border-y border-line">
                      {facts.filter(([, , v]) => v).map(([icon, k, v]) => (
                        <div key={k} className="flex items-baseline gap-3 py-2">
                          <dt className="flex w-36 shrink-0 items-center gap-2 text-label-sm uppercase tracking-wide text-slate-text sm:w-40">
                            <Icon name={icon} className="text-[16px] text-primary" />{k}
                          </dt>
                          <dd className="min-w-0 break-words text-title-md text-navy">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-6">
                      <h2 className="text-title-md text-navy">{t("intro")}:</h2>
                      <div className="mt-2"><SafeText text={p.description} /></div>
                    </div>

                    <div className="mt-7 flex flex-wrap gap-3">
                      {hasPdf && (
                        <a href={`/media/${p.pdf!.id}?download=1`} className="btn-accent group !px-6 shadow-lg shadow-accent/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30">
                          <Icon name="download" className="text-[18px] transition-transform duration-300 group-hover:translate-y-0.5" />{t("download_pdf")}
                        </a>
                      )}
                      <Link href="/contact" className="btn-secondary group !px-6 hover:-translate-y-0.5">
                        {t("request_quote")}<Icon name="arrow_forward" className="text-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="sec-deco sec-grid bg-gradient-to-b from-[#EEF4FC] to-white py-14 md:py-16">
          <div className="container-x">
            <Reveal>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="text-label-md uppercase tracking-wider text-primary">{typeName ?? t("prod_eyebrow")}</span>
                  <h2 className="mt-2 text-headline-xl text-navy">Related Products</h2>
                  <div className="mt-3 h-1 w-14 rounded bg-accent" />
                </div>
                <Link href={typeSlug ? `/products?type=${typeSlug}` : "/products"} className="inline-flex items-center gap-1 text-title-md text-primary transition-colors hover:text-brand-hover">
                  {t("prod_all")}<Icon name="arrow_forward" className="arrow-shift text-[18px]" />
                </Link>
              </div>
            </Reveal>
            <ul className="flow-cards [--cols:2] lg:[--cols:4] [--gap:0.75rem] md:[--gap:1.25rem]">
              {related.map((r, i) => (
                <li key={r.id} className="h-full"><ProductCard p={r} index={i} /></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand title={t("prod_cta_t")} text={t("prod_cta_x")} tight />
    </>
  );
}