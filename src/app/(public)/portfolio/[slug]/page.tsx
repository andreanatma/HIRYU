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
  const ids = [...(p.imageId ? [p.imageId] : []), ...p.images.map((i) => i.mediaId).filter((id) => id !== p.imageId)];

  return (
    <>
      <div className="container-x pb-4 pt-6 md:pt-8">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-label-md text-on-surface-variant md:mb-6">
          <Link href="/portfolio" className="transition-colors hover:text-primary">{t("nav_portfolio")}</Link>
          <Icon name="chevron_right" className="text-[14px]" />
          <span className="line-clamp-1 text-on-surface">{name}</span>
        </nav>

        <h1 className="text-display-md-mobile text-navy md:text-display-md">{name}</h1>
        <p className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-body-md text-on-surface-variant">
          {p.clientName && <span><strong className="text-navy">{t("client_label")}</strong> {p.clientName}</span>}
          {p.projectDate && <span><strong className="text-navy">{t("date_label")}</strong> {formatDate(p.projectDate)}</span>}
        </p>

        {ids.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-8 md:gap-5">
            {ids.map((id, i) => {
              const hero = i === 0 && ids.length % 2 === 1;
              return (
                <Reveal key={id} delay={(i % 2) * 100} className={hero ? "sm:col-span-2" : ""}>
                  <div className="group relative overflow-hidden rounded-xl bg-navy shadow-md transition-all duration-500 motion-safe:hover:-translate-y-1 hover:shadow-[0_28px_50px_-20px_rgba(8,102,217,0.55)]">
                    <MediaImg
                      id={id}
                      alt={`${name} ${i + 1}`}
                      className={`w-full transition-transform duration-700 ease-out group-hover:scale-105 ${hero ? "aspect-[4/3] sm:aspect-[21/9]" : "aspect-[4/3]"}`}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        <div className="mt-8 max-w-3xl md:mt-10"><SafeText text={p.description} /></div>

        <Link href="/portfolio" className="group mt-8 inline-flex items-center gap-1 text-body-md font-semibold text-primary">
          <Icon name="arrow_back" className="text-[18px] transition-transform duration-300 group-hover:-translate-x-1" />
          {t("nav_portfolio")}
        </Link>
      </div>
      <CtaBand title={t("pf_cta_t")} text={t("pf_detail_cta_x")} />
    </>
  );
}