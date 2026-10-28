import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirectIfRenamed } from "@/lib/redirects";
import { buildMetadata, jsonLd, SITE_URL } from "@/lib/seo";
import { getT } from "@/lib/i18n";
import { loc } from "@/lib/lang";
import { formatDate } from "@/lib/utils";
import { Icon, MediaImg, SafeText } from "@/components/ui";

type P = { params: Promise<{ slug: string }> };
async function get(slug: string) {
  const b = await prisma.blog.findUnique({ where: { slug } });
  if (!b) return null;
  if (b.status === "PUBLISHED") return b;
  return (await getSession()) ? b : null;
}

export async function generateMetadata({ params }: P) {
  const [b, { lang, t }] = await Promise.all([get((await params).slug), getT()]);
  if (!b) return {};
  const title = loc(b, "title", lang);
  if (b.status !== "PUBLISHED") return { title: `${t("preview")}: ${title}`, robots: { index: false, follow: false } };
  return buildMetadata({ title: loc(b, "metaTitle", lang) || title, description: loc(b, "metaDescription", lang) || loc(b, "excerpt", lang) || undefined, path: `/blogs/${b.slug}`, image: b.featuredImageId ? `/media/${b.featuredImageId}` : null, type: "article" });
}

export default async function BlogDetail({ params }: P) {
  const slug = (await params).slug;
  const [b, { lang, t }] = await Promise.all([get(slug), getT()]);
  if (!b) { await redirectIfRenamed("blog", slug, "/blogs"); notFound(); }
  const title = loc(b, "title", lang);
  return (
    <article className="container-x max-w-3xl pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "BlogPosting", headline: title, inLanguage: lang, datePublished: b.publishedAt?.toISOString(), dateModified: b.updatedAt.toISOString(), image: b.featuredImageId ? `${SITE_URL}/media/${b.featuredImageId}` : undefined, mainEntityOfPage: `${SITE_URL}/blogs/${b.slug}`, description: loc(b, "excerpt", lang) || undefined }) }} />
      {b.status !== "PUBLISHED" && <div role="status" className="mb-6 rounded border border-accent bg-[#FEF3C7] px-4 py-3 text-body-sm text-[#92400E]">{t("draft_notice")}</div>}
      <Link href="/blogs" className="mb-6 inline-flex items-center gap-1 text-label-md text-on-surface-variant hover:text-primary"><Icon name="arrow_back" className="text-[16px]" />{t("blog_all")}</Link>
      <h1 className="text-display-md-mobile md:text-display-md">{title}</h1>
      <p className="mt-3 text-body-sm text-on-surface-variant">{formatDate(b.publishedAt, false, lang)}</p>
      {b.featuredImageId && <MediaImg id={b.featuredImageId} alt={title} className="my-8 h-72 w-full rounded-lg md:h-96" />}
      <div className="mt-8"><SafeText text={loc(b, "content", lang)} /></div>
    </article>
  );
}