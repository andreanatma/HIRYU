import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata, jsonLd, SITE_URL } from "@/lib/seo";
import { redirectIfRenamed } from "@/lib/redirects";
import { getCatalogTree } from "@/lib/catalog";
import { Icon, SafeText } from "@/components/ui";
import { CtaBand } from "@/components/public";
import { ProductSidebar } from "@/components/product-sidebar";
import { ProductImage } from "@/components/product-parts";

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
  const facts: [string, string | null][] = [
    ["Brand", p.brand],
    ["Product origin", p.productOrigin],
    ["Model", p.model],
    ["Product type", typeName],
  ];
  const hasPdf = !!p.pdf && p.pdf.isPublic && p.pdf.mimeType === "application/pdf";

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
      <div className="container-x pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-label-md text-on-surface-variant">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-primary"><Icon name="home" className="text-[16px]" />Home</Link>
          <Icon name="chevron_right" className="text-[14px]" />
          <Link href="/products" className="hover:text-primary">Products</Link>
          <Icon name="chevron_right" className="text-[14px]" />
          {typeName && typeSlug && (
            <>
              <Link href={`/products?type=${typeSlug}`} className="hover:text-primary">{typeName}</Link>
              <Icon name="chevron_right" className="text-[14px]" />
            </>
          )}
          <span className="text-on-surface">{p.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <ProductSidebar groups={tree} activeType={typeSlug} activeProduct={p.slug} />

          <article className="border border-line bg-white p-5 sm:p-6">
            <div className="grid gap-8 md:grid-cols-5">
              <ProductImage id={p.imageId} alt={p.name} className="md:col-span-2" />
              <div className="md:col-span-3">
                <h1 className="border-b border-line pb-4 text-headline-lg text-navy">{p.name}</h1>
                <div className="mt-4 space-y-2">
                  {facts.filter(([, v]) => v).map(([k, v]) => (
                    <p key={k} className="text-body-md">
                      <strong className="mr-2 text-navy">{k}</strong>
                      <span className="text-on-surface-variant">{v}</span>
                    </p>
                  ))}
                </div>
                <div className="mt-5">
                  <h2 className="text-title-md text-navy">Introduction:</h2>
                  <div className="mt-2"><SafeText text={p.description} /></div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {hasPdf && (
                    <a href={`/media/${p.pdf!.id}?download=1`} className="btn-accent">
                      <Icon name="download" className="text-[18px]" />Download PDF
                    </a>
                  )}
                  <Link href="/contact" className="btn-secondary">Request a Quote</Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
      <CtaBand title="Need a quotation or technical advice?" text="Send us the product name and model and our team will follow up." />
    </>
  );
}