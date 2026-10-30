import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirectIfRenamed } from "@/lib/redirects";
import { buildMetadata, jsonLd, SITE_URL } from "@/lib/seo";
import { t } from "@/lib/dictionary";
import { formatDate } from "@/lib/utils";
import { Icon, MediaImg, SafeText } from "@/components/ui";
import { Reveal } from "@/components/public/reveal";

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
  return (
    <article className="container-x max-w-3xl pb-16 pt-6 md:pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "BlogPosting", headline: b.title, inLanguage: "en", datePublished: b.publishedAt?.toISOString(), dateModified: b.updatedAt.toISOString(), image: b.featuredImageId ? `${SITE_URL}/media/${b.featuredImageId}` : undefined, mainEntityOfPage: `${SITE_URL}/blogs/${b.slug}`, description: b.excerpt || undefined }) }} />
      {b.status !== "PUBLISHED" && <div role="status" className="mb-6 rounded border border-accent bg-[#FEF3C7] px-4 py-3 text-body-sm text-[#92400E]">{t("draft_notice")}</div>}

      <Link href="/blogs" className="group mb-5 inline-flex items-center gap-1 text-label-md text-on-surface-variant transition-colors hover:text-primary md:mb-6">
        <Icon name="arrow_back" className="text-[16px] transition-transform duration-300 group-hover:-translate-x-1" />{t("blog_all")}
      </Link>

      <h1 className="break-words text-display-md-mobile text-navy md:text-display-md">{b.title}</h1>
      <div className="mt-4 flex items-center gap-3">
        <span className="rounded-full bg-[#E8F1FF] px-3 py-1 text-label-md font-semibold text-primary">{formatDate(b.publishedAt)}</span>
        <div className="h-1 w-14 rounded bg-accent" />
      </div>

      {b.featuredImageId && (
        <Reveal>
          <div className="group my-6 overflow-hidden rounded-xl shadow-md transition-shadow duration-500 hover:shadow-[0_28px_50px_-20px_rgba(8,102,217,0.45)] md:my-8">
            <MediaImg id={b.featuredImageId} alt={b.title} className="aspect-[16/10] w-full transition-transform duration-700 ease-out group-hover:scale-105 md:aspect-[16/9]" />
          </div>
        </Reveal>
      )}

      <div className="mt-6 break-words md:mt-8"><SafeText text={b.content} /></div>

      <div className="mt-10 border-t border-line pt-6">
        <Link href="/blogs" className="group inline-flex items-center gap-1 text-title-md text-primary">
          <Icon name="arrow_back" className="text-[18px] transition-transform duration-300 group-hover:-translate-x-1" />{t("blog_all")}
        </Link>
      </div>
    </article>
  );
}