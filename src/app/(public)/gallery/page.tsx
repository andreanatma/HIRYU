import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { t } from "@/lib/dictionary";
import { GalleryGrid } from "@/components/gallery-grid";
import { EmptyState } from "@/components/ui";
import { PageHero } from "@/components/public";

export async function generateMetadata() {
  return buildMetadata({ pageKey: "gallery", title: t("nav_gallery"), description: t("gal_meta_desc"), path: "/gallery" });
}

export default async function Gallery() {
  const rows = await prisma.gallery.findMany({
    where: { isActive: true, imageId: { not: null } },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    select: { id: true, imageId: true },
  });
  const items = rows.flatMap((r) => (r.imageId ? [{ id: r.id, imageId: r.imageId }] : []));

  return (
    <>
      {/* Hero memudar ke mist, lalu section dimulai dari mist → putih (sama dengan section Gallery di homepage) */}
      <PageHero eyebrow={t("nav_gallery")} title={t("gal_hero_title")} text={t("gal_hero_text")} icon="photo_camera" blend="mist" />

      <section className="sec-deco sec-dots bg-gradient-to-b from-mist via-[#E6ECF4] to-white pb-14 pt-6 md:pb-16 md:pt-8">
        <div className="container-x">
          {items.length === 0 ? <EmptyState icon="photo_library" title={t("gal_empty_t")} text={t("gal_empty_x")} /> : <GalleryGrid items={items} />}
        </div>
      </section>
    </>
  );
}