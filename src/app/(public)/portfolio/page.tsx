import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getT } from "@/lib/i18n";
import { loc } from "@/lib/lang";
import { EmptyState, MediaImg } from "@/components/ui";
import { CtaBand, PageHero } from "@/components/public";

export async function generateMetadata() {
  const { t } = await getT();
  return buildMetadata({ pageKey: "portfolio", title: t("nav_portfolio"), description: t("pf_meta_desc"), path: "/portfolio" });
}

export default async function Portfolio() {
  const { lang, t } = await getT();
  const items = await prisma.portfolio.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { projectDate: "desc" }, { createdAt: "desc" }], include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } } });
  return (
    <>
      <PageHero eyebrow={t("pf_hero_eyebrow")} title={t("pf_hero_title")} text={t("pf_hero_text")} icon="folder_special" />
      <section className="container-x py-14">
        {items.length === 0 ? <EmptyState icon="folder_special" title={t("pf_empty")} /> : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <Link key={p.id} href={`/portfolio/${p.slug}`} className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
                <div className="overflow-hidden"><MediaImg id={p.imageId ?? p.images[0]?.mediaId} alt={loc(p, "name", lang)} className="h-56 w-full transition-transform duration-500 group-hover:scale-105" icon="folder_special" /></div>
                <div className="p-6"><h2 className="text-headline-md text-navy group-hover:text-primary">{loc(p, "name", lang)}</h2>{p.clientName && <p className="mt-1 text-label-md uppercase text-primary">{p.clientName}</p>}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <CtaBand title={t("pf_cta_t")} text={t("pf_cta_x")} />
    </>
  );
}