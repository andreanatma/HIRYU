import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getT } from "@/lib/i18n";
import { loc } from "@/lib/lang";
import { formatDate, pageParam, str, truncate } from "@/lib/utils";
import { EmptyState, Icon, MediaImg, Pagination } from "@/components/ui";
import { PageHero } from "@/components/public";

export async function generateMetadata() {
  const { t } = await getT();
  return buildMetadata({ pageKey: "blogs", title: t("nav_blogs"), description: t("blog_meta_desc"), path: "/blogs" });
}
const PER = 9;

export default async function Blogs({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang, t } = await getT();
  const sp = await searchParams;
  const q = str(sp.q).trim().slice(0, 80);
  const page = pageParam(sp.page);
  const where = { status: "PUBLISHED" as const, ...(q ? { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }, { titleId: { contains: q } }, { excerptId: { contains: q } }] } : {}) };
  const [total, items] = await Promise.all([prisma.blog.count({ where }), prisma.blog.findMany({ where, orderBy: { publishedAt: "desc" }, skip: (page - 1) * PER, take: PER })]);
  return (
    <>
      <PageHero eyebrow={t("blog_eyebrow")} title={t("blog_hero_title")} text={t("blog_hero_text")} icon="terminal" />
      <section className="container-x">
        <form role="search" className="mb-8 flex max-w-xl gap-3"><div className="relative flex-1"><Icon name="search" className="pointer-events-none absolute left-3 top-2.5 text-outline" /><input name="q" defaultValue={q} className="input !pl-10" placeholder={t("blog_search_ph")} aria-label={t("blog_search_ph")} /></div><button className="btn-primary">{t("blog_search_btn")}</button></form>
        {items.length === 0 ? <EmptyState icon="article" title={q ? t("blog_none_q") : t("blog_none")} /> : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((b) => (
              <article key={b.id} className="card flex flex-col overflow-hidden transition-shadow hover:shadow-md">
                <MediaImg id={b.featuredImageId} alt={loc(b, "title", lang)} className="h-48 w-full" icon="article" />
                <div className="flex flex-1 flex-col p-6"><p className="text-label-sm text-on-surface-variant">{formatDate(b.publishedAt, false, lang)}</p><h2 className="mt-2 text-title-lg"><Link href={`/blogs/${b.slug}`} className="hover:text-primary">{loc(b, "title", lang)}</Link></h2><p className="mt-2 flex-1 text-body-sm text-on-surface-variant">{truncate(loc(b, "excerpt", lang), 140)}</p><Link href={`/blogs/${b.slug}`} className="mt-4 inline-flex items-center gap-1 text-title-md text-primary">{t("read")}<Icon name="chevron_right" className="text-[16px]" /></Link></div>
              </article>
            ))}
          </div>
        )}
        <Pagination page={page} pages={Math.max(1, Math.ceil(total / PER))} basePath="/blogs" params={q ? { q } : undefined} prev={t("pg_prev")} next={t("pg_next")} />
      </section>
    </>
  );
}