import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { redirectIfRenamed } from "@/lib/redirects";
import { t } from "@/lib/dictionary";
import { truncate } from "@/lib/utils";
import { Icon, MediaImg, SafeText } from "@/components/ui";
import { CtaBand } from "@/components/public";
import { Reveal } from "@/components/public/reveal";
import { DetailBadge, DetailBreadcrumb, DetailCard, SectionHead } from "@/components/detail-parts";

type P = { params: Promise<{ slug: string }> };
const get = (slug: string) => prisma.service.findFirst({ where: { slug, isActive: true }, include: { images: { orderBy: { displayOrder: "asc" } } } });

export async function generateMetadata({ params }: P) {
  const s = await get((await params).slug);
  if (!s) return {};
  return buildMetadata({ title: s.metaTitle || s.name, description: s.metaDescription || s.description.slice(0, 155), path: `/service/${s.slug}`, image: s.imageId ? `/media/${s.imageId}` : null });
}

export default async function ServiceDetail({ params }: P) {
  const slug = (await params).slug;
  const s = await get(slug);
  if (!s) { await redirectIfRenamed("service", slug, "/service"); notFound(); }
  const name = s.name;
  const mainId = s.imageId ?? s.images[0]?.mediaId ?? null;
  const gallery = s.images.map((i) => i.mediaId).filter((id) => id !== mainId);

  // Layanan lain (tautan internal + halaman lebih padat)
  const others = await prisma.service.findMany({
    where: { isActive: true, NOT: { id: s.id } },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    take: 3,
    include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } },
  });

  const hasRelated = others.length > 0;

  return (
    <>
      <section className={hasRelated ? "sec-deco sec-grid sec-strong bg-gradient-to-b from-mist via-[#E3EFFF] to-[#D4E6FF] pb-14 pt-8 md:pb-16" : "sec-deco sec-grid sec-strong bg-gradient-to-b from-mist via-[#E3EFFF] to-white pb-14 pt-8 md:pb-16"}>
        <div className="container-x">
          <DetailBreadcrumb trail={[{ label: t("nav_services"), href: "/service" }]} current={name} />

          <Reveal>
            <DetailCard>
              <div className="grid gap-7 md:grid-cols-5 md:gap-8">
                <div className="md:col-span-2">
                  <div className="relative">
                    <div aria-hidden="true" className="absolute -inset-2 -z-10 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/25 to-transparent blur-xl" />
                    <div className="group overflow-hidden rounded-xl border border-line bg-gradient-to-br from-white to-mist shadow-sm">
                      <MediaImg id={mainId} alt={name} icon="design_services" className="aspect-square w-full transition-transform duration-700 ease-out group-hover:scale-105" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <DetailBadge icon="design_services">{t("nav_services")}</DetailBadge>
                  <h1 className="mt-3 text-headline-lg text-navy md:text-headline-xl">{name}</h1>
                  <div className="mt-3 h-1 w-14 rounded bg-accent" />

                  <div className="mt-6"><SafeText text={s.description} /></div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href="/contact" className="btn-accent group !px-6 shadow-lg shadow-accent/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30">
                      {t("nav_contact")}<Icon name="arrow_forward" className="text-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link href="/service" className="btn-secondary group !px-6 hover:-translate-y-0.5">
                      <Icon name="arrow_back" className="text-[18px] transition-transform duration-300 group-hover:-translate-x-1" />{t("svc_all")}
                    </Link>
                  </div>
                </div>
              </div>

              {gallery.length > 0 && (
                <section className="mt-9 border-t border-line pt-7" aria-label={t("svc_images")}>
                  <h2 className="text-title-lg text-navy">{t("nav_gallery")}</h2>
                  <div className="mt-2 h-1 w-12 rounded bg-accent" />
                  <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                    {gallery.map((id, i) => (
                      <div key={id} className="group relative overflow-hidden rounded-xl shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                        <MediaImg id={id} alt={`${name} ${i + 1}`} className="aspect-[4/3] w-full transition-transform duration-700 ease-out group-hover:scale-110" />
                        <div className="pointer-events-none absolute inset-0 bg-navy/0 transition-colors duration-300 group-hover:bg-navy/25" />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </DetailCard>
          </Reveal>
        </div>
      </section>

      {others.length > 0 && (
        <section className="sec-deco sec-warm bg-gradient-to-b from-[#D4E6FF] via-[#FFFBEA] to-white py-14 md:py-16">
          <div className="container-x">
            <Reveal><SectionHead eyebrow={t("svc_eyebrow")} title={t("svc_title")} linkHref="/service" linkLabel={t("svc_all")} /></Reveal>
            <div className="grid gap-5 md:grid-cols-3 md:gap-6">
              {others.map((x, i) => (
                <Reveal key={x.id} delay={i * 100} className="h-full">
                  <Link href={`/service/${x.slug}`} className="card card-lift shine group relative flex h-full flex-col overflow-hidden">
                    <div className="relative overflow-hidden">
                      <MediaImg id={x.imageId ?? x.images[0]?.mediaId} alt={x.name} className="h-40 w-full transition-transform duration-700 ease-out group-hover:scale-110" icon="design_services" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-title-lg text-navy transition-colors group-hover:text-primary">{x.name}</h3>
                      <p className="mt-2 flex-1 text-body-sm text-on-surface-variant">{truncate(x.description, 100)}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-title-md text-primary">{t("learn_more")}<Icon name="arrow_forward" className="arrow-shift text-[16px]" /></span>
                    </div>
                    <span className="accent-bar" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand title={t("svc_detail_cta_t")} text={t("svc_detail_cta_x")} tight />
    </>
  );
}