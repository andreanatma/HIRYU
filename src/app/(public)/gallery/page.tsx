import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { t } from "@/lib/dictionary";
import { pageParam } from "@/lib/utils";
import { PUBLIC_PER_PAGE } from "@/lib/page-limits";
import { GalleryGrid } from "@/components/gallery-grid";
import { EmptyState, Pagination } from "@/components/ui";
import { PageHero } from "@/components/public";

type SP = Promise<Record<string, string | string[] | undefined>>;
const PER = PUBLIC_PER_PAGE.gallery;

export async function generateMetadata({ searchParams }: { searchParams: SP }) {
  const page = pageParam((await searchParams).page);
  return buildMetadata({ pageKey: "gallery", title: t("nav_gallery"), description: t("gal_meta_desc"), path: page > 1 ? `/gallery?page=${page}` : "/gallery" });
}

export default async function Gallery({ searchParams }: { searchParams: SP }) {
  const total = await prisma.gallery.count({ where: { isActive: true, imageId: { not: null } } });
  const pages = Math.max(1, Math.ceil(total / PER));
  const page = Math.min(pageParam((await searchParams).page), pages);
  const rows = await prisma.gallery.findMany({
    where: { isActive: true, imageId: { not: null } },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    skip: (page - 1) * PER,
    take: PER,
    select: { id: true, imageId: true },
  });
  const items = rows.flatMap((r) => (r.imageId ? [{ id: r.id, imageId: r.imageId }] : []));

  return (
    <>
      {/* Hero memudar ke mist, lalu section dimulai dari mist → putih (sama dengan section Gallery di homepage) */}
      <PageHero eyebrow={t("nav_gallery")} title={t("gal_hero_title")} text={t("gal_hero_text")} icon="photo_camera" blend="mist" />

      <section className="sec-deco sec-dots bg-gradient-to-b from-mist via-[#E6ECF4] to-white pb-14 pt-6 md:pb-16 md:pt-8">
        <div className="container-x">
          {items.length === 0 ? (
            <EmptyState icon="photo_library" title={t("gal_empty_t")} text={t("gal_empty_x")} />
          ) : (
            <>
              <GalleryGrid items={items} />
              <Pagination page={page} pages={pages} basePath="/gallery" prev={t("pg_prev")} next={t("pg_next")} />
            </>
          )}
        </div>
      </section>
    </>
  );
}