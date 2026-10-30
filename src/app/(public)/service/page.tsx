import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { t } from "@/lib/dictionary";
import { truncate } from "@/lib/utils";
import { EmptyState, Icon, MediaImg } from "@/components/ui";
import { CtaBand, PageHero } from "@/components/public";
import { Reveal } from "@/components/public/reveal";

export async function generateMetadata() {
  return buildMetadata({ pageKey: "service", title: t("nav_services"), description: t("svc_meta_desc"), path: "/service" });
}

export default async function Services() {
  const items = await prisma.service.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }], include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } } });
  return (
    <>
      <PageHero eyebrow={t("svc_hero_eyebrow")} title={t("svc_hero_title")} text={t("svc_hero_text")} icon="design_services" blend="mist" />

      {/* Latar: mist → biru muda (grid blueprint) → putih; sama dengan section Services di homepage */}
      <section className="sec-deco sec-grid bg-gradient-to-b from-mist via-[#EAF3FF] to-white pb-14 pt-6 md:pb-16 md:pt-8">
        <div className="container-x">
          {items.length === 0 ? (
            <EmptyState icon="design_services" title={t("svc_empty_t")} text={t("svc_empty_x")} />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {items.map((s, i) => (
                <Reveal key={s.id} delay={(i % 3) * 100} className="h-full">
                  <Link href={`/service/${s.slug}`} className="card card-lift shine group relative flex h-full flex-col overflow-hidden">
                    <div className="relative overflow-hidden">
                      <MediaImg id={s.imageId ?? s.images[0]?.mediaId} alt={s.name} className="h-48 w-full transition-transform duration-700 ease-out group-hover:scale-110" icon="design_services" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
                      <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-label-md font-extrabold text-navy shadow-md transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">{String(i + 1).padStart(2, "0")}</span>
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
        </div>
      </section>

      <CtaBand title={t("svc_cta_t")} text={t("svc_cta_x")} tight />
    </>
  );
}