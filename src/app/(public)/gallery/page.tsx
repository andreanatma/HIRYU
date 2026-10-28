import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { Lightbox } from "@/components/client";
import { EmptyState } from "@/components/ui";
import { PageHero } from "@/components/public";

export const generateMetadata = () => buildMetadata({ pageKey: "gallery", title: "Gallery", description: "Photos of our work, equipment, and activities.", path: "/gallery" });

export default async function Gallery() {
  const rows = await prisma.gallery.findMany({ where: { isActive: true, imageId: { not: null } }, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }], select: { id: true, imageId: true } });
  const items = rows.flatMap((r) => (r.imageId ? [{ id: r.id, imageId: r.imageId }] : []));
  return (
    <>
      <PageHero eyebrow="Gallery" title="Our Work in Pictures" text="Photo documentation of our activities." icon="photo_camera" />
      <section className="container-x py-14">{items.length === 0 ? <EmptyState icon="photo_library" title="The gallery is empty" text="Photos will appear here once they are published." /> : <Lightbox items={items} />}</section>
    </>
  );
}
