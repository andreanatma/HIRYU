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
  const gallery = s.images.map((i) => i.mediaId);
  const name = s.name;

  // Layanan lain (tautan internal + membuat halaman lebih padat)
  const others = await prisma.service.findMany({
    where: { isActive: true, NOT: { id: s.id } },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    take: 3,
    include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } },
  });

  return (
    <>
      {/* ===== Detail utama ===== */}
      <section className="sec-deco sec-grid bg-gradient-to-b from-mist via-[#EAF3FF] to-white pb-14 pt-8 md:pb-16">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="hero-in mb-6 flex items-center gap-2 text-label-md text-on-surface-variant" style={{ "--d": "0ms" } as React.CSSProperties}>
            <Link href="/service" className="transition-colors hover:text-primary">{t("nav_services")}</Link>
            <Icon name="chevron_right" className="text-[14px]" />
            <span className="text-on-surface">{name}</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Gambar utama dengan bingkai dekoratif */}
            <Reveal>
              <div className="group relative">
                <div aria-hidden="true" className="absolute -inset-3 -z-10 rounded-2xl bg-gradient-to-br from-primary/25 via-accent/30 to-transparent blur-xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-80" />
                <div className="overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_26px_50px_-24px_rgba(7,29,51,0.5)]">
                  <MediaImg id={s.imageId ?? gallery[0]} alt={name} className="h-72 w-full transition-transform duration-700 ease-out group-hover:scale-105 sm:h-80 lg:h-[420px]" icon="design_services" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3.5 py-1.5 text-label-md uppercase tracking-wider text-primary">
                  <Icon name="design_services" className="text-[16px]" />{t("nav_services")}
                </span>
                <h1 className="mt-4 text-display-md-mobile text-navy md:text-display-md">{name}</h1>
                <div className="mt-4 h-1 w-16 rounded bg-accent" />
                <div className="mt-5"><SafeText text={s.description} /></div>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/contact" className="btn-accent group !px-7 !py-3 shadow-lg shadow-accent/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30">
                    {t("nav_contact")}<Icon name="arrow_forward" className="text-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link href="/service" className="btn-secondary group !px-6 !py-3 hover:-translate-y-0.5">
                    <Icon name="arrow_back" className="text-[18px] transition-transform duration-300 group-hover:-translate-x-1" />{t("svc_all")}
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Galeri tambahan */}
          {gallery.length > 0 && (
            <section className="mt-12 md:mt-14" aria-label={t("svc_images")}>
              <Reveal><h2 className="mb-5 text-headline-lg text-navy">{t("nav_gallery")}<span className="mt-2 block h-1 w-12 rounded bg-accent" /></h2></Reveal>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                {gallery.map((id, i) => (
                  <Reveal key={id} delay={(i % 3) * 80} className="h-full">
                    <div className="group relative overflow-hidden rounded-xl shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                      <MediaImg id={id} alt={`${name} ${i + 1}`} className="aspect-[4/3] w-full transition-transform duration-700 ease-out group-hover:scale-110" />
                      <div className="absolute inset-0 bg-navy/0 transition-colors duration-300 group-hover:bg-navy/25" />
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      {/* ===== Layanan lainnya ===== */}
      {others.length > 0 && (
        <section className="sec-deco sec-warm bg-gradient-to-b from-white via-[#FFFBEA] to-white py-14 md:py-16">
          <div className="container-x">
            <Reveal>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div><span className="text-label-md uppercase tracking-wider text-primary">{t("svc_eyebrow")}</span><h2 className="mt-2 text-headline-xl text-navy">{t("svc_title")}</h2><div className="mt-3 h-1 w-14 rounded bg-accent" /></div>
                <Link href="/service" className="inline-flex items-center gap-1 text-title-md text-primary transition-colors hover:text-brand-hover">{t("svc_all")}<Icon name="arrow_forward" className="arrow-shift text-[18px]" /></Link>
              </div>
            </Reveal>
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