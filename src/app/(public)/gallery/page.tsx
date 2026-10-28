import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getT } from "@/lib/i18n";
import { Lightbox } from "@/components/client";
import { EmptyState } from "@/components/ui";
import { PageHero } from "@/components/public";

export async function generateMetadata() {
  const { t } = await getT();
  return buildMetadata({ pageKey: "gallery", title: t("nav_gallery"), description: t("gal_meta_desc"), path: "/gallery" });
}

export default async function Gallery() {
  const { lang, t } = await getT();
  const rows = await prisma.gallery.findMany({ where: { isActive: true, imageId: { not: null } }, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }], select: { id: true, imageId: true } });
  const items = rows.flatMap((r) => (r.imageId ? [{ id: r.id, imageId: r.imageId }] : []));
  return (
    <>
      <PageHero eyebrow={t("nav_gallery")} title={t("gal_hero_title")} text={t("gal_hero_text")} icon="photo_camera" />
      <section className="container-x py-14">{items.length === 0 ? <EmptyState icon="photo_library" title={t("gal_empty_t")} text={t("gal_empty_x")} /> : <Lightbox items={items} lang={lang} />}</section>
    </>
  );
}