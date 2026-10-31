import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getPageHero } from "@/lib/hero";
import { t } from "@/lib/dictionary";
import { pageParam } from "@/lib/utils";
import { PUBLIC_PER_PAGE } from "@/lib/page-limits";
import { EmptyState, Icon, MediaImg, Pagination } from "@/components/ui";
import { CtaBand, PageHero } from "@/components/public";
import { Reveal } from "@/components/public/reveal";

type SP = Promise<Record<string, string | string[] | undefined>>;
const PER = PUBLIC_PER_PAGE.portfolio;

export async function generateMetadata({ searchParams }: { searchParams: SP }) {
  const page = pageParam((await searchParams).page);
  return buildMetadata({ pageKey: "portfolio", title: t("nav_portfolio"), description: t("pf_meta_desc"), path: page > 1 ? `/portfolio?page=${page}` : "/portfolio" });
}

export default async function Portfolio({ searchParams }: { searchParams: SP }) {
  const hero = await getPageHero("portfolio");
  const total = await prisma.portfolio.count({ where: { isActive: true } });
  const pages = Math.max(1, Math.ceil(total / PER));
  const page = Math.min(pageParam((await searchParams).page), pages);
  const items = await prisma.portfolio.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { projectDate: "desc" }, { createdAt: "desc" }],
    skip: (page - 1) * PER,
    take: PER,
    include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } },
  });

  return (
    <>
      <PageHero eyebrow={t("pf_hero_eyebrow")} title={hero.title} text={hero.text} imageId={hero.imageId} icon="folder_special" blend="mist" />

      {/* Hero memudar ke putih (blend="white") lalu section dimulai dari putih → krem, jadi tanpa garis batas */}
      <section className="sec-deco sec-grid sec-strong bg-gradient-to-b from-mist via-[#E3EFFF] to-white pb-12 pt-6 md:pb-16 md:pt-8">
        <div className="container-x">
          {items.length === 0 ? (
            <EmptyState icon="folder_special" title={t("pf_empty")} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {items.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 100} className="h-full">
                  <Link
                    href={`/portfolio/${p.slug}`}
                    className="group relative block h-full overflow-hidden rounded-xl bg-navy shadow-md transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 motion-safe:hover:-translate-y-2 hover:shadow-[0_28px_50px_-20px_rgba(8,102,217,0.55)]"
                  >
                    <MediaImg
                      id={p.imageId ?? p.images[0]?.mediaId}
                      alt={p.name}
                      className="aspect-[4/3] w-full transition-transform duration-700 ease-out sm:aspect-[16/11] group-hover:scale-110 group-hover:opacity-90"
                      icon="folder_special"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                      {p.clientName && (
                        <p className="line-clamp-1 text-label-sm uppercase tracking-wider text-accent">
                          {t("client_label")} {p.clientName}
                        </p>
                      )}
                      <h2 className="mt-1 line-clamp-2 text-title-lg text-white">{p.name}</h2>
                      {/* Mobile/touch: selalu terlihat. Desktop: muncul saat hover/fokus. */}
                      <span className="mt-2 inline-flex items-center gap-1 text-body-sm font-semibold text-white transition-all duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                        {t("learn_more")}
                        <Icon name="arrow_forward" className="text-[16px] transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
          {items.length > 0 && <Pagination page={page} pages={pages} basePath="/portfolio" prev={t("pg_prev")} next={t("pg_next")} />}
        </div>
      </section>

      <CtaBand title={t("pf_cta_t")} text={t("pf_cta_x")} />
    </>
  );
}