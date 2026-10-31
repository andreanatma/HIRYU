import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getPageHero } from "@/lib/hero";
import { t } from "@/lib/dictionary";
import { formatDate, pageParam, str, truncate } from "@/lib/utils";
import { EmptyState, Icon, MediaImg, Pagination } from "@/components/ui";
import { PageHero } from "@/components/public";
import { Reveal } from "@/components/public/reveal";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const page = pageParam(sp.page);
  return buildMetadata({
    pageKey: "blogs", title: "Blogs",
    description: "Technical articles about equipment, measurement, and calibration.",
    path: page > 1 ? `/blogs?page=${page}` : "/blogs",
    noindex: !!str(sp.q).trim(),
  });
}

const PER = 9;

export default async function Blogs({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const hero = await getPageHero("blogs");
  const sp = await searchParams;
  const q = str(sp.q).trim().slice(0, 80);
  const page = pageParam(sp.page);
  const where = { status: "PUBLISHED" as const, ...(q ? { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }] } : {}) };
  const [total, items] = await Promise.all([
    prisma.blog.count({ where }),
    prisma.blog.findMany({ where, orderBy: { publishedAt: "desc" }, skip: (page - 1) * PER, take: PER }),
  ]);

  return (
    <>
      {/* Hero memudar ke putih, lalu section dimulai dari putih → biru muda (sama dengan section Blogs di homepage) */}
      <PageHero eyebrow={t("blog_eyebrow")} title={hero.title} text={hero.text} imageId={hero.imageId} icon="terminal" blend="white" />

      <section className="sec-deco sec-rings-full bg-gradient-to-b from-white to-[#E8F1FF] pb-14 pt-6 md:pb-16 md:pt-8">
        <div className="container-x">
          <Reveal>
            <form
              role="search"
              className="card mb-8 flex flex-col gap-3 p-4 transition-shadow duration-300 focus-within:shadow-[0_18px_40px_-22px_rgba(8,102,217,0.45)] sm:flex-row sm:items-center sm:p-5 md:mb-10"
            >
              <div className="relative flex-1">
                <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input name="q" defaultValue={q} className="input !h-12 !pl-10" placeholder={t("blog_search_ph")} aria-label={t("blog_search_ph")} />
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-primary !h-12 flex-1 !px-6 sm:flex-none">{t("blog_search_btn")}</button>
                {q && <Link href="/blogs" className="btn-ghost !h-12">Reset</Link>}
              </div>
            </form>
          </Reveal>

          {q && (
            <p className="mb-6 text-body-md text-on-surface-variant" role="status">
              {total} {total === 1 ? "article" : "articles"} found for “<span className="text-navy">{q}</span>”
            </p>
          )}

          {items.length === 0 ? (
            <div className="card">
              <EmptyState
                icon="article"
                title={q ? t("blog_none_q") : t("blog_none")}
                text={q ? "Try a different keyword." : "Articles will appear here once they are published."}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {items.map((b, i) => (
                <Reveal key={b.id} delay={(i % 3) * 100} className="h-full">
                  <article className="card card-lift group relative flex h-full flex-col overflow-hidden">
                    <Link href={`/blogs/${b.slug}`} className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40" aria-label={b.title}>
                      <div className="relative overflow-hidden">
                        <MediaImg id={b.featuredImageId} alt={b.title} className="h-44 w-full transition-transform duration-700 ease-out group-hover:scale-110 sm:h-48" icon="article" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-label-sm text-navy shadow-sm backdrop-blur">{formatDate(b.publishedAt)}</span>
                      </div>
                      <div className="flex flex-1 flex-col p-5 md:p-6">
                        <h2 className="line-clamp-2 text-title-lg text-navy transition-colors group-hover:text-primary">{b.title}</h2>
                        <p className="mt-2 flex-1 text-body-sm text-on-surface-variant">{truncate(b.excerpt ?? "", 140)}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-title-md text-primary">
                          {t("read")}<Icon name="arrow_forward" className="arrow-shift text-[16px]" />
                        </span>
                      </div>
                    </Link>
                    <span className="accent-bar" />
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          <Pagination page={page} pages={Math.max(1, Math.ceil(total / PER))} basePath="/blogs" params={q ? { q } : undefined} prev={t("pg_prev")} next={t("pg_next")} />
        </div>
      </section>
    </>
  );
}