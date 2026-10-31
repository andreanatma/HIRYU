import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirectIfRenamed } from "@/lib/redirects";
import { buildMetadata, jsonLd, SITE_URL } from "@/lib/seo";
import { t } from "@/lib/dictionary";
import { formatDate, truncate } from "@/lib/utils";
import { Icon, MediaImg, SafeText } from "@/components/ui";
import { CtaBand } from "@/components/public";
import { Reveal } from "@/components/public/reveal";
import { DetailBadge, DetailBreadcrumb, DetailCard, SectionHead } from "@/components/detail-parts";

type P = { params: Promise<{ slug: string }> };
async function get(slug: string) {
  const b = await prisma.blog.findUnique({ where: { slug } });
  if (!b) return null;
  if (b.status === "PUBLISHED") return b;
  return (await getSession()) ? b : null;
}

export async function generateMetadata({ params }: P) {
  const b = await get((await params).slug);
  if (!b) return {};
  if (b.status !== "PUBLISHED") return { title: `${t("preview")}: ${b.title}`, robots: { index: false, follow: false } };
  return buildMetadata({ title: b.metaTitle || b.title, description: b.metaDescription || b.excerpt || undefined, path: `/blogs/${b.slug}`, image: b.featuredImageId ? `/media/${b.featuredImageId}` : null, type: "article" });
}

export default async function BlogDetail({ params }: P) {
  const slug = (await params).slug;
  const b = await get(slug);
  if (!b) { await redirectIfRenamed("blog", slug, "/blogs"); notFound(); }

  // Artikel lain (tautan internal + halaman lebih padat)
  const related = await prisma.blog.findMany({
    where: { status: "PUBLISHED", NOT: { id: b.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  const hasRelated = related.length > 0;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "BlogPosting", headline: b.title, inLanguage: "en", datePublished: b.publishedAt?.toISOString(), dateModified: b.updatedAt.toISOString(), image: b.featuredImageId ? `${SITE_URL}/media/${b.featuredImageId}` : undefined, mainEntityOfPage: `${SITE_URL}/blogs/${b.slug}`, description: b.excerpt || undefined }) }} />

      <section className={hasRelated ? "sec-deco sec-rings-full bg-gradient-to-b from-white to-[#E8F1FF] pb-14 pt-8 md:pb-16" : "sec-deco sec-rings-full bg-gradient-to-b from-white to-white pb-14 pt-8 md:pb-16"}>
        <div className="container-x">
          <DetailBreadcrumb trail={[{ label: t("nav_blogs"), href: "/blogs" }]} current={b.title} />

          {b.status !== "PUBLISHED" && <div role="status" className="mb-6 rounded-lg border border-accent bg-[#FEF3C7] px-4 py-3 text-body-sm text-[#92400E]">{t("draft_notice")}</div>}

          <Reveal>
            <DetailCard className="mx-auto max-w-4xl">
              <DetailBadge icon="article">{t("blog_eyebrow")}</DetailBadge>
              <h1 className="mt-3 break-words text-headline-lg text-navy md:text-headline-xl">{b.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="h-1 w-14 rounded bg-accent" />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-label-md font-semibold text-primary ring-1 ring-line">
                  <Icon name="event" className="text-[14px]" />{formatDate(b.publishedAt)}
                </span>
              </div>

              {b.featuredImageId && (
                <div className="group mt-6 overflow-hidden rounded-xl border border-line shadow-sm">
                  <MediaImg id={b.featuredImageId} alt={b.title} icon="article" className="aspect-[16/10] w-full transition-transform duration-700 ease-out group-hover:scale-105 md:aspect-[16/9]" />
                </div>
              )}

              <div className="mt-6 break-words md:mt-8"><SafeText text={b.content} /></div>

              <div className="mt-9 flex flex-wrap gap-3 border-t border-line pt-6">
                <Link href="/blogs" className="btn-secondary group !px-6 hover:-translate-y-0.5">
                  <Icon name="arrow_back" className="text-[18px] transition-transform duration-300 group-hover:-translate-x-1" />{t("blog_all")}
                </Link>
                <Link href="/contact" className="btn-accent group !px-6 shadow-lg shadow-accent/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30">
                  {t("nav_contact")}<Icon name="arrow_forward" className="text-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </DetailCard>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="sec-deco sec-warm bg-gradient-to-b from-[#E8F1FF] via-[#FFFBEA] to-white py-14 md:py-16">
          <div className="container-x">
            <Reveal><SectionHead eyebrow={t("blog_eyebrow")} title="More Articles" linkHref="/blogs" linkLabel={t("blog_all")} /></Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {related.map((x, i) => (
                <Reveal key={x.id} delay={(i % 3) * 100} className="h-full">
                  <article className="card card-lift group relative flex h-full flex-col overflow-hidden">
                    <Link href={`/blogs/${x.slug}`} className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40" aria-label={x.title}>
                      <div className="relative overflow-hidden">
                        <MediaImg id={x.featuredImageId} alt={x.title} className="h-44 w-full transition-transform duration-700 ease-out group-hover:scale-110 sm:h-48" icon="article" />
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-label-sm text-navy shadow-sm backdrop-blur">{formatDate(x.publishedAt)}</span>
                      </div>
                      <div className="flex flex-1 flex-col p-5 md:p-6">
                        <h3 className="line-clamp-2 text-title-lg text-navy transition-colors group-hover:text-primary">{x.title}</h3>
                        <p className="mt-2 flex-1 text-body-sm text-on-surface-variant">{truncate(x.excerpt ?? "", 140)}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-title-md text-primary">{t("read")}<Icon name="arrow_forward" className="arrow-shift text-[16px]" /></span>
                      </div>
                    </Link>
                    <span className="accent-bar" />
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand title={t("pf_cta_t")} text={t("pf_detail_cta_x")} tight />
    </>
  );
}