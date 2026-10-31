import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { redirectIfRenamed } from "@/lib/redirects";
import { t } from "@/lib/dictionary";
import { formatDate } from "@/lib/utils";
import { Icon, MediaImg, SafeText } from "@/components/ui";
import { CtaBand } from "@/components/public";
import { Reveal } from "@/components/public/reveal";
import { DetailBadge, DetailBreadcrumb, DetailCard, FactGrid, SectionHead } from "@/components/detail-parts";

type P = { params: Promise<{ slug: string }> };
const get = (slug: string) =>
  prisma.portfolio.findFirst({ where: { slug, isActive: true }, include: { images: { orderBy: { displayOrder: "asc" } } } });

export async function generateMetadata({ params }: P) {
  const p = await get((await params).slug);
  if (!p) return {};
  return buildMetadata({
    title: p.metaTitle || p.name,
    description: p.metaDescription || p.description.slice(0, 155),
    path: `/portfolio/${p.slug}`,
    image: p.imageId ? `/media/${p.imageId}` : null,
  });
}

export default async function PortfolioDetail({ params }: P) {
  const slug = (await params).slug;
  const p = await get(slug);
  if (!p) {
    await redirectIfRenamed("portfolio", slug, "/portfolio");
    notFound();
  }
  const name = p.name;
  const mainId = p.imageId ?? p.images[0]?.mediaId ?? null;
  const gallery = p.images.map((i) => i.mediaId).filter((id) => id !== mainId);

  // Proyek lain (tautan internal + halaman lebih padat)
  const related = await prisma.portfolio.findMany({
    where: { isActive: true, NOT: { id: p.id } },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    take: 3,
    include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } },
  });

  const hasRelated = related.length > 0;

  return (
    <>
      <section className={hasRelated ? "sec-deco sec-grid bg-gradient-to-b from-mist to-[#EEF4FC] pb-14 pt-8 md:pb-16" : "sec-deco sec-grid bg-gradient-to-b from-mist to-white pb-14 pt-8 md:pb-16"}>
        <div className="container-x">
          <DetailBreadcrumb trail={[{ label: t("nav_portfolio"), href: "/portfolio" }]} current={name} />

          <Reveal>
            <DetailCard>
              <div className="grid gap-7 md:grid-cols-5 md:gap-8">
                <div className="md:col-span-2">
                  <div className="relative">
                    <div aria-hidden="true" className="absolute -inset-2 -z-10 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/25 to-transparent blur-xl" />
                    <div className="group overflow-hidden rounded-xl border border-line bg-gradient-to-br from-white to-mist shadow-sm">
                      <MediaImg id={mainId} alt={name} icon="folder_special" className="aspect-square w-full transition-transform duration-700 ease-out group-hover:scale-105" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <DetailBadge icon="folder_special">{t("nav_portfolio")}</DetailBadge>
                  <h1 className="mt-3 text-headline-lg text-navy md:text-headline-xl">{name}</h1>
                  <div className="mt-3 h-1 w-14 rounded bg-accent" />

                  <FactGrid
                    facts={[
                      ["business", t("client_label").replace(":", ""), p.clientName],
                      ["event", t("date_label").replace(":", ""), p.projectDate ? formatDate(p.projectDate) : null],
                    ]}
                  />

                  <div className="mt-6"><SafeText text={p.description} /></div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href="/contact" className="btn-accent group !px-6 shadow-lg shadow-accent/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30">
                      {t("nav_contact")}<Icon name="arrow_forward" className="text-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link href="/portfolio" className="btn-secondary group !px-6 hover:-translate-y-0.5">
                      <Icon name="arrow_back" className="text-[18px] transition-transform duration-300 group-hover:-translate-x-1" />{t("nav_portfolio")}
                    </Link>
                  </div>
                </div>
              </div>

              {gallery.length > 0 && (
                <section className="mt-9 border-t border-line pt-7" aria-label={t("nav_gallery")}>
                  <h2 className="text-title-lg text-navy">{t("nav_gallery")}</h2>
                  <div className="mt-2 h-1 w-12 rounded bg-accent" />
                  <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                    {gallery.map((id, i) => (
                      <div key={id} className="group relative overflow-hidden rounded-xl shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                        <MediaImg id={id} alt={`${name} ${i + 2}`} className="aspect-[4/3] w-full transition-transform duration-700 ease-out group-hover:scale-110" />
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

      {related.length > 0 && (
        <section className="sec-deco sec-dots bg-gradient-to-b from-[#EEF4FC] to-white py-14 md:py-16">
          <div className="container-x">
            <Reveal><SectionHead eyebrow={t("pf_eyebrow")} title="Other Projects" linkHref="/portfolio" linkLabel={t("pf_all")} /></Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {related.map((x, i) => (
                <Reveal key={x.id} delay={(i % 3) * 100} className="h-full">
                  <Link
                    href={`/portfolio/${x.slug}`}
                    className="group relative block h-full overflow-hidden rounded-xl bg-navy shadow-md transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 motion-safe:hover:-translate-y-2 hover:shadow-[0_28px_50px_-20px_rgba(8,102,217,0.55)]"
                  >
                    <MediaImg id={x.imageId ?? x.images[0]?.mediaId} alt={x.name} icon="folder_special" className="aspect-[4/3] w-full transition-transform duration-700 ease-out sm:aspect-[16/11] group-hover:scale-110 group-hover:opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                      {x.clientName && <p className="line-clamp-1 text-label-sm uppercase tracking-wider text-accent">{t("client_label")} {x.clientName}</p>}
                      <h3 className="mt-1 line-clamp-2 text-title-lg text-white">{x.name}</h3>
                      <span className="mt-2 inline-flex items-center gap-1 text-body-sm font-semibold text-white">
                        {t("learn_more")}<Icon name="arrow_forward" className="text-[16px] transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand title={t("pf_cta_t")} text={t("pf_detail_cta_x")} tight />
    </>
  );
}