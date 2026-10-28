import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getT } from "@/lib/i18n";
import { loc } from "@/lib/lang";
import { EmptyState, MediaImg, SafeText } from "@/components/ui";
import { CtaBand, PageHero, SectionHead } from "@/components/public";

export async function generateMetadata() {
  const { t } = await getT();
  return buildMetadata({ pageKey: "about-us", title: t("nav_about"), description: t("about_meta_desc"), path: "/about-us" });
}

export default async function AboutUs() {
  const { lang, t } = await getT();
  const [sections, team] = await Promise.all([
    prisma.aboutSection.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { id: "asc" }] }),
    prisma.teamMember.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { id: "asc" }] }),
  ]);
  return (
    <>
      <PageHero eyebrow={t("about_eyebrow")} title="PT Hiryu Techno Indonesia" text={t("about_hero_text")} icon="info" />
      <div className="container-x py-14">
        {sections.length === 0 ? <EmptyState icon="info" title={t("about_empty_t")} text={t("about_empty_x")} /> : (
          <div className="space-y-16">
            {sections.map((s, i) => (
              <section key={s.id} aria-labelledby={`about-${s.id}`} className={`grid items-center gap-10 ${s.imageId ? "lg:grid-cols-2" : ""}`}>
                <div className={i % 2 === 1 && s.imageId ? "lg:order-2" : ""}><h2 id={`about-${s.id}`} className="text-headline-xl text-navy">{loc(s, "heading", lang)}</h2><div className="mb-5 mt-3 h-1 w-14 rounded bg-accent" /><SafeText text={loc(s, "body", lang)} /></div>
                {s.imageId && <MediaImg id={s.imageId} alt={loc(s, "heading", lang)} className="h-72 w-full rounded-lg lg:h-96" />}
              </section>
            ))}
          </div>
        )}
        {team.length > 0 && (
          <section className="mt-20" aria-labelledby="team-h">
            <SectionHead eyebrow={t("team_eyebrow")} title={t("team_title")} />
            <h2 id="team-h" className="sr-only">{t("team_title")}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => <div key={m.id} className="card overflow-hidden"><MediaImg id={m.photoId} alt={m.name} className="aspect-[4/3] w-full" icon="person" /><div className="p-5"><h3 className="text-title-lg text-navy">{m.name}</h3><p className="text-body-sm text-primary">{loc(m, "position", lang)}</p></div></div>)}
            </div>
          </section>
        )}
      </div>
      <CtaBand title={t("about_cta_t")} text={t("about_cta_x")} />
    </>
  );
}