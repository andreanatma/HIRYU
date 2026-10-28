import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { EmptyState, MediaImg, SafeText } from "@/components/ui";
import { CtaBand, PageHero, SectionHead } from "@/components/public";

export const generateMetadata = () => buildMetadata({ pageKey: "about-us", title: "About Us", description: "Who we are, our vision and mission, and the principles we work by.", path: "/about-us" });

export default async function AboutUs() {
  const [sections, team] = await Promise.all([
    prisma.aboutSection.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { id: "asc" }] }),
    prisma.teamMember.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { id: "asc" }] }),
  ]);
  return (
    <>
      <PageHero eyebrow="About us" title="PT Hiryu Techno Indonesia" text="Service, repair, maintenance, calibration, and supply of laboratory, testing, and industrial equipment." icon="info" />
      <div className="container-x py-14">
        {sections.length === 0 ? <EmptyState icon="info" title="About Us content is being prepared" text="An administrator can add this content in the dashboard." /> : (
          <div className="space-y-16">
            {sections.map((s, i) => (
              <section key={s.id} aria-labelledby={`about-${s.id}`} className={`grid items-center gap-10 ${s.imageId ? "lg:grid-cols-2" : ""}`}>
                <div className={i % 2 === 1 && s.imageId ? "lg:order-2" : ""}><h2 id={`about-${s.id}`} className="text-headline-xl text-navy">{s.heading}</h2><div className="mb-5 mt-3 h-1 w-14 rounded bg-accent" /><SafeText text={s.body} /></div>
                {s.imageId && <MediaImg id={s.imageId} alt={s.heading} className="h-72 w-full rounded-lg lg:h-96" />}
              </section>
            ))}
          </div>
        )}
        {team.length > 0 && (
          <section className="mt-20" aria-labelledby="team-h">
            <SectionHead eyebrow="People" title="Our Team" />
            <h2 id="team-h" className="sr-only">Our Team</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((t) => <div key={t.id} className="card overflow-hidden"><MediaImg id={t.photoId} alt={`Photo of ${t.name}`} className="aspect-[4/3] w-full" icon="person" /><div className="p-5"><h3 className="text-title-lg text-navy">{t.name}</h3><p className="text-body-sm text-primary">{t.position}</p></div></div>)}
            </div>
          </section>
        )}
      </div>
      <CtaBand title="Work with us" text="Talk to our team about your equipment supply, service, or calibration needs." />
    </>
  );
}
