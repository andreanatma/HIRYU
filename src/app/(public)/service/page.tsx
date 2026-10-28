import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { truncate } from "@/lib/utils";
import { EmptyState, Icon, MediaImg } from "@/components/ui";
import { CtaBand, PageHero } from "@/components/public";

export const generateMetadata = () => buildMetadata({ pageKey: "service", title: "Services", description: "Service & maintenance, calibration, and equipment supply for laboratory and testing equipment.", path: "/service" });

export default async function Services() {
  const items = await prisma.service.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }], include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } } });
  return (
    <>
      <PageHero eyebrow="What we do" title="Service Maintenance, Calibration & Equipment Supply" text="Technical support for laboratory, testing, and industrial equipment." icon="design_services" />
      <section className="container-x py-14">
        {items.length === 0 ? <EmptyState icon="design_services" title="Services are not available yet" text="Content is being prepared." /> : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((s) => (
              <article key={s.id} className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
                <div className="overflow-hidden"><MediaImg id={s.imageId ?? s.images[0]?.mediaId} alt={s.name} className="h-52 w-full transition-transform duration-500 group-hover:scale-105" icon="design_services" /></div>
                <div className="flex flex-1 flex-col p-7"><h2 className="text-headline-md text-navy">{s.name}</h2><p className="mt-3 flex-1 text-body-md text-on-surface-variant">{truncate(s.description, 200)}</p>
                  <Link href={`/service/${s.slug}`} className="mt-5 inline-flex items-center gap-1 text-title-md text-primary hover:text-brand-hover">Learn more<Icon name="arrow_forward" className="text-[18px]" /></Link></div>
              </article>
            ))}
          </div>
        )}
      </section>
      <CtaBand title="Need a service or calibration quote?" text="Describe your equipment and requirements and we will respond within our available scope." />
    </>
  );
}
