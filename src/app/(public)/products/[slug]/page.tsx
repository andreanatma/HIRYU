import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata, jsonLd, SITE_URL } from "@/lib/seo";
import { redirectIfRenamed } from "@/lib/redirects";
import { t } from "@/lib/dictionary";
import { Icon, MediaImg, SafeText } from "@/components/ui";
import { CtaBand } from "@/components/public";

type P = { params: Promise<{ slug: string }> };
const get = (slug: string) => prisma.product.findFirst({ where: { slug, isActive: true, productType: { is: { isActive: true } } }, include: { productType: true, pdf: true } });

export async function generateMetadata({ params }: P) {
  const p = await get((await params).slug);
  if (!p) return {};
  return buildMetadata({ title: p.metaTitle || [p.name, p.brand].filter(Boolean).join(" – "), description: p.metaDescription || p.description.slice(0, 155), path: `/products/${p.slug}`, image: p.imageId ? `/media/${p.imageId}` : null });
}

export default async function ProductDetail({ params }: P) {
  const slug = (await params).slug;
  const p = await get(slug);
  if (!p) { await redirectIfRenamed("product", slug, "/products"); notFound(); }
  const name = p.name;
  const typeName = p.productType?.name ?? null;
  const facts: [string, string | null][] = [[t("f_brand"), p.brand], [t("f_origin"), p.productOrigin], [t("f_model"), p.model], [t("f_type"), typeName]];
  const hasPdf = !!p.pdf && p.pdf.isPublic && p.pdf.mimeType === "application/pdf";
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "Product", name, description: p.description, brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined, model: p.model ?? undefined, image: p.imageId ? `${SITE_URL}/media/${p.imageId}` : undefined, url: `${SITE_URL}/products/${p.slug}` }) }} />
      <div className="container-x pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-label-md text-on-surface-variant">
          <Link href="/products" className="hover:text-primary">{t("nav_products")}</Link><Icon name="chevron_right" className="text-[14px]" />
          {typeName && <><Link href="/products" className="hover:text-primary">{typeName}</Link><Icon name="chevron_right" className="text-[14px]" /></>}
          <span className="text-on-surface">{name}</span>
        </nav>
        <div className="grid gap-10 lg:grid-cols-2">
          <MediaImg id={p.imageId} alt={name} className="h-80 w-full rounded-lg border border-line lg:h-[440px]" icon="science" />
          <div>
            <h1 className="text-display-md-mobile text-navy md:text-display-md">{name}</h1>
            <dl className="mt-6 divide-y divide-line rounded-lg border border-line">
              {facts.filter(([, v]) => v).map(([k, v]) => <div key={k} className="grid grid-cols-3 gap-2 px-4 py-3"><dt className="text-title-md text-navy">{k}</dt><dd className="col-span-2 text-on-surface-variant">{v}</dd></div>)}
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              {hasPdf && <a href={`/media/${p.pdf!.id}?download=1`} className="btn-accent"><Icon name="download" className="text-[18px]" />{t("download_pdf")}</a>}
              <Link href="/contact" className="btn-secondary">{t("request_quote")}</Link>
            </div>
          </div>
        </div>
        <section className="mt-12 max-w-4xl" aria-labelledby="intro-h"><h2 id="intro-h" className="mb-4 text-headline-lg text-navy">{t("intro")}</h2><SafeText text={p.description} /></section>
      </div>
      <CtaBand title={t("prod_cta_t")} text={t("prod_cta_x")} />
    </>
  );
}