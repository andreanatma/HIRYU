import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getT } from "@/lib/i18n";
import { loc } from "@/lib/lang";
import { EmptyState, MediaImg } from "@/components/ui";
import { CtaBand, PageHero, SectionHead } from "@/components/public";
import { AboutSections } from "@/components/about-sections";

export async function generateMetadata() {
  const { t } = await getT();
  return buildMetadata({
    pageKey: "about-us",
    title: t("nav_about"),
    description: t("about_meta_desc"),
    path: "/about-us",
  });
}

export default async function AboutUs() {
  const { lang, t } = await getT();
  const [sections, team] = await Promise.all([
    prisma.aboutSection.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    }),
    prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    }),
  ]);

  return (
    <>
      <PageHero
        eyebrow={t("about_eyebrow")}
        title="PT Hiryu Techno Indonesia"
        text={t("about_hero_text")}
        icon="info"
      />
      
      {sections.length === 0 ? (
        <div className="container-x py-14">
          <EmptyState
            icon="info"
            title={t("about_empty_t")}
            text={t("about_empty_x")}
          />
        </div>
      ) : (
        <AboutSections
          sections={sections.map((s) => ({
            id: s.id,
            heading: loc(s, "heading", lang),
            body: loc(s, "body", lang),
            imageId: s.imageId,
          }))}
        />
      )}

      {team.length > 0 && (
        <div className="container-x py-14">
          <section aria-labelledby="team-h">
            <SectionHead eyebrow={t("team_eyebrow")} title={t("team_title")} />
            <h2 id="team-h" className="sr-only">
              {t("team_title")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <div key={m.id} className="card overflow-hidden">
                  <MediaImg
                    id={m.photoId}
                    alt={m.name}
                    className="aspect-[4/3] w-full"
                    icon="person"
                  />
                  <div className="p-5">
                    <h3 className="text-title-lg text-navy">{m.name}</h3>
                    <p className="text-body-sm text-primary">
                      {loc(m, "position", lang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <CtaBand title={t("about_cta_t")} text={t("about_cta_x")} />
    </>
  );
}