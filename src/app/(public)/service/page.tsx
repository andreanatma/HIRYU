import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getPageHero } from "@/lib/hero";
import { t } from "@/lib/dictionary";
import { pageParam, truncate } from "@/lib/utils";
import { PUBLIC_PER_PAGE } from "@/lib/page-limits";
import { EmptyState, Icon, MediaImg, Pagination } from "@/components/ui";
import { CtaBand, PageHero } from "@/components/public";
import { Reveal } from "@/components/public/reveal";

type SP = Promise<Record<string, string | string[] | undefined>>;
const PER = PUBLIC_PER_PAGE.services;

export async function generateMetadata({ searchParams }: { searchParams: SP }) {
  const page = pageParam((await searchParams).page);
  return buildMetadata({ pageKey: "service", title: t("nav_services"), description: t("svc_meta_desc"), path: page > 1 ? `/service?page=${page}` : "/service" });
}

export default async function Services({ searchParams }: { searchParams: SP }) {
  const hero = await getPageHero("service");
  const total = await prisma.service.count({ where: { isActive: true } });
  const pages = Math.max(1, Math.ceil(total / PER));
  const page = Math.min(pageParam((await searchParams).page), pages);
  const items = await prisma.service.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }], skip: (page - 1) * PER, take: PER, include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } } });
  return (
    <>
      <PageHero eyebrow={t("svc_hero_eyebrow")} title={hero.title} text={hero.text} imageId={hero.imageId} icon="design_services" blend="mist" />

      {/* Latar: mist → biru muda (grid blueprint) → putih; sama dengan section Services di homepage */}
      <section className="sec-deco sec-grid bg-gradient-to-b from-mist to-white pb-14 pt-6 md:pb-16 md:pt-8">
        <div className="container-x">
          {items.length === 0 ? (
            <EmptyState icon="design_services" title={t("svc_empty_t")} text={t("svc_empty_x")} />
          ) : (
            <div className="flow-cards [--cols:1] md:[--cols:2] lg:[--cols:3] [--gap:1.25rem] md:[--gap:1.5rem]">
              {items.map((s, i) => (
                <Reveal key={s.id} delay={(i % 3) * 100} className="h-full">
                  <Link href={`/service/${s.slug}`} className="card card-lift shine group relative flex h-full flex-col overflow-hidden">
                    <div className="relative overflow-hidden">
                      <MediaImg id={s.imageId ?? s.images[0]?.mediaId} alt={s.name} className="h-48 w-full transition-transform duration-700 ease-out group-hover:scale-110" icon="design_services" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
                      <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-label-md font-extrabold text-navy shadow-md transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">{String((page - 1) * PER + i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <h2 className="text-headline-md text-navy transition-colors group-hover:text-primary">{s.name}</h2>
                      <p className="mt-2 flex-1 text-body-sm text-on-surface-variant">{truncate(s.description, 170)}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-title-md text-primary">{t("learn_more")}<Icon name="arrow_forward" className="arrow-shift text-[18px]" /></span>
                    </div>
                    <span className="accent-bar" />
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
          {items.length > 0 && <Pagination page={page} pages={pages} basePath="/service" prev={t("pg_prev")} next={t("pg_next")} />}
        </div>
      </section>

      <CtaBand title={t("svc_cta_t")} text={t("svc_cta_x")} tight />
    </>
  );
}