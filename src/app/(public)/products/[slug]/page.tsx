import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata, jsonLd, SITE_URL } from "@/lib/seo";
import { redirectIfRenamed } from "@/lib/redirects";
import { Icon, MediaImg, SafeText } from "@/components/ui";
import { CtaBand } from "@/components/public";

type P = { params: Promise<{ slug: string }> };
// Visible only when the product AND its product type are active; otherwise the visitor gets a 404.
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
  const facts: [string, string | null][] = [["Brand", p.brand], ["Product Origin", p.productOrigin], ["Model", p.model], ["Product Type", p.productType?.name ?? null]];
  const hasPdf = !!p.pdf && p.pdf.isPublic && p.pdf.mimeType === "application/pdf";
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined, model: p.model ?? undefined, image: p.imageId ? `${SITE_URL}/media/${p.imageId}` : undefined, url: `${SITE_URL}/products/${p.slug}` }) }} />
      <div className="container-x pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-label-md text-on-surface-variant">
          <Link href="/products" className="hover:text-primary">Products</Link><Icon name="chevron_right" className="text-[14px]" />
          {p.productType && <><Link href="/products" className="hover:text-primary">{p.productType.name}</Link><Icon name="chevron_right" className="text-[14px]" /></>}
          <span className="text-on-surface">{p.name}</span>
        </nav>
        <div className="grid gap-10 lg:grid-cols-2">
          <MediaImg id={p.imageId} alt={p.name} className="h-80 w-full rounded-lg border border-line lg:h-[440px]" icon="science" />
          <div>
            <h1 className="text-display-md-mobile text-navy md:text-display-md">{p.name}</h1>
            <dl className="mt-6 divide-y divide-line rounded-lg border border-line">
              {facts.filter(([, v]) => v).map(([k, v]) => <div key={k} className="grid grid-cols-3 gap-2 px-4 py-3"><dt className="text-title-md text-navy">{k}</dt><dd className="col-span-2 text-on-surface-variant">{v}</dd></div>)}
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              {hasPdf && <a href={`/media/${p.pdf!.id}?download=1`} className="btn-accent"><Icon name="download" className="text-[18px]" />Download PDF</a>}
              <Link href="/contact" className="btn-secondary">Request a Quote</Link>
            </div>
          </div>
        </div>
        <section className="mt-12 max-w-4xl" aria-labelledby="intro-h"><h2 id="intro-h" className="mb-4 text-headline-lg text-navy">Introduction</h2><SafeText text={p.description} /></section>
      </div>
      <CtaBand title="Need a quotation or technical advice?" text="Send us the product name and model and our team will follow up." />
    </>
  );
}
