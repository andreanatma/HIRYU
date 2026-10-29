import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { formatDate, pageParam, str, truncate } from "@/lib/utils";
import { EmptyState, Icon, MediaImg, Pagination } from "@/components/ui";
import { PageHero } from "@/components/public";

export const generateMetadata = () => buildMetadata({ pageKey: "blogs", title: "Blogs", description: "Technical articles about equipment, measurement, and calibration.", path: "/blogs" });
const PER = 9;

export default async function Blogs({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const q = str(sp.q).trim().slice(0, 80);
  const page = pageParam(sp.page);
  const where = { status: "PUBLISHED" as const, ...(q ? { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }] } : {}) };
  const [total, items] = await Promise.all([prisma.blog.count({ where }), prisma.blog.findMany({ where, orderBy: { publishedAt: "desc" }, skip: (page - 1) * PER, take: PER })]);
  return (
    <>
      <PageHero eyebrow="Knowledge center" title="Articles & Technical Insights" text="Guides and articles about equipment, measurement, and calibration." icon="terminal" />
      <section className="container-x py-14">
        <form role="search" className="card mb-10 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="relative flex-1">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input name="q" defaultValue={q} className="input !h-12 !pl-10" placeholder="Search articles…" aria-label="Search articles" />
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-primary !h-12 !px-6">Search</button>
            {q && <Link href="/blogs" className="btn-ghost !h-12">Reset</Link>}
          </div>
        </form>

        {q && (
          <p className="mb-6 text-body-md text-on-surface-variant" role="status">
            {total} {total === 1 ? "article" : "articles"} found for “<span className="text-navy">{q}</span>”
          </p>
        )}

        {items.length === 0 ? (
          <div className="card"><EmptyState icon="article" title={q ? "No articles found" : "No articles yet"} text={q ? "Try a different keyword." : "Articles will appear here once they are published."} /></div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((b) => (
              <article key={b.id} className="card flex flex-col overflow-hidden transition-shadow hover:shadow-md">
                <MediaImg id={b.featuredImageId} alt={b.title} className="h-48 w-full" icon="article" />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-label-sm text-on-surface-variant">{formatDate(b.publishedAt)}</p>
                  <h2 className="mt-2 text-title-lg"><Link href={`/blogs/${b.slug}`} className="hover:text-primary">{b.title}</Link></h2>
                  <p className="mt-2 flex-1 text-body-sm text-on-surface-variant">{truncate(b.excerpt ?? "", 140)}</p>
                  <Link href={`/blogs/${b.slug}`} className="mt-4 inline-flex items-center gap-1 text-title-md text-primary hover:text-brand-hover">Read<Icon name="chevron_right" className="text-[16px]" /></Link>
                </div>
              </article>
            ))}
          </div>
        )}
        <Pagination page={page} pages={Math.max(1, Math.ceil(total / PER))} basePath="/blogs" params={q ? { q } : undefined} />
      </section>
    </>
  );
}