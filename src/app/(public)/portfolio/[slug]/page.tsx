import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { redirectIfRenamed } from "@/lib/redirects";
import { t } from "@/lib/dictionary";
import { formatDate } from "@/lib/utils";
import { Icon, MediaImg, SafeText } from "@/components/ui";
import { CtaBand } from "@/components/public";

type P = { params: Promise<{ slug: string }> };
const get = (slug: string) => prisma.portfolio.findFirst({ where: { slug, isActive: true }, include: { images: { orderBy: { displayOrder: "asc" } } } });

export async function generateMetadata({ params }: P) {
  const p = await get((await params).slug);
  if (!p) return {};
  return buildMetadata({ title: p.metaTitle || p.name, description: p.metaDescription || p.description.slice(0, 155), path: `/portfolio/${p.slug}`, image: p.imageId ? `/media/${p.imageId}` : null });
}

export default async function PortfolioDetail({ params }: P) {
  const slug = (await params).slug;
  const p = await get(slug);
  if (!p) { await redirectIfRenamed("portfolio", slug, "/portfolio"); notFound(); }
  const name = p.name;
  const ids = [...(p.imageId ? [p.imageId] : []), ...p.images.map((i) => i.mediaId).filter((id) => id !== p.imageId)];
  return (
    <>
      <div className="container-x pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-label-md text-on-surface-variant"><Link href="/portfolio" className="hover:text-primary">{t("nav_portfolio")}</Link><Icon name="chevron_right" className="text-[14px]" /><span className="text-on-surface">{name}</span></nav>
        <h1 className="text-display-md-mobile text-navy md:text-display-md">{name}</h1>
        <p className="mt-3 flex flex-wrap gap-x-6 text-body-md text-on-surface-variant">{p.clientName && <span><strong className="text-navy">{t("client_label")}</strong> {p.clientName}</span>}{p.projectDate && <span><strong className="text-navy">{t("date_label")}</strong> {formatDate(p.projectDate)}</span>}</p>
        {ids.length > 0 && <div className="mt-8 grid gap-4 md:grid-cols-2">{ids.map((id, i) => <MediaImg key={id} id={id} alt={`${name} ${i + 1}`} className={`w-full rounded-lg ${i === 0 && ids.length % 2 === 1 ? "h-80 md:col-span-2 md:h-[420px]" : "h-64"}`} />)}</div>}
        <div className="mt-10 max-w-3xl"><SafeText text={p.description} /></div>
      </div>
      <CtaBand title={t("pf_cta_t")} text={t("pf_detail_cta_x")} />
    </>
  );
}