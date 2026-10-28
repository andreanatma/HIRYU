import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { EmptyState, MediaImg } from "@/components/ui";
import { CtaBand, PageHero } from "@/components/public";

export const generateMetadata = () => buildMetadata({ pageKey: "portfolio", title: "Portfolio", description: "Selected projects and technical work.", path: "/portfolio" });

export default async function Portfolio() {
  const items = await prisma.portfolio.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { projectDate: "desc" }, { createdAt: "desc" }], include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } } });
  return (
    <>
      <PageHero eyebrow="Our work" title="Selected Projects" text="A look at technical projects we have delivered for our clients." icon="folder_special" />
      <section className="container-x py-14">
        {items.length === 0 ? <EmptyState icon="folder_special" title="Projects are not available yet" /> : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <Link key={p.id} href={`/portfolio/${p.slug}`} className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
                <div className="overflow-hidden"><MediaImg id={p.imageId ?? p.images[0]?.mediaId} alt={p.name} className="h-56 w-full transition-transform duration-500 group-hover:scale-105" icon="folder_special" /></div>
                <div className="p-6"><h2 className="text-headline-md text-navy group-hover:text-primary">{p.name}</h2>{p.clientName && <p className="mt-1 text-label-md uppercase text-primary">{p.clientName}</p>}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <CtaBand title="Discuss Your Project" text="Tell us about your equipment needs and we will propose a suitable approach." />
    </>
  );
}
