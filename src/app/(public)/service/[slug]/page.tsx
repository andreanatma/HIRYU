import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { redirectIfRenamed } from "@/lib/redirects";
import { getT } from "@/lib/i18n";
import { loc } from "@/lib/lang";
import { Icon, MediaImg, SafeText } from "@/components/ui";
import { CtaBand } from "@/components/public";

type P = { params: Promise<{ slug: string }> };
const get = (slug: string) => prisma.service.findFirst({ where: { slug, isActive: true }, include: { images: { orderBy: { displayOrder: "asc" } } } });

export async function generateMetadata({ params }: P) {
  const [s, { lang }] = await Promise.all([get((await params).slug), getT()]);
  if (!s) return {};
  return buildMetadata({ title: loc(s, "metaTitle", lang) || loc(s, "name", lang), description: loc(s, "metaDescription", lang) || loc(s, "description", lang).slice(0, 155), path: `/service/${s.slug}`, image: s.imageId ? `/media/${s.imageId}` : null });
}

export default async function ServiceDetail({ params }: P) {
  const slug = (await params).slug;
  const [s, { lang, t }] = await Promise.all([get(slug), getT()]);
  if (!s) { await redirectIfRenamed("service", slug, "/service"); notFound(); }
  const gallery = s.images.map((i) => i.mediaId);
  const name = loc(s, "name", lang);
  return (
    <>
      <div className="container-x pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-label-md text-on-surface-variant"><Link href="/service" className="hover:text-primary">{t("nav_services")}</Link><Icon name="chevron_right" className="text-[14px]" /><span className="text-on-surface">{name}</span></nav>
        <div className="grid gap-10 lg:grid-cols-2">
          <MediaImg id={s.imageId ?? gallery[0]} alt={name} className="h-80 w-full rounded-lg lg:h-[420px]" icon="design_services" />
          <div><h1 className="text-display-md-mobile text-navy md:text-display-md">{name}</h1><div className="mt-5"><SafeText text={loc(s, "description", lang)} /></div><Link href="/contact" className="btn-accent mt-8">{t("nav_contact")}<Icon name="arrow_forward" className="text-[18px]" /></Link></div>
        </div>
        {gallery.length > 0 && (
          <section className="mt-12" aria-label={t("svc_images")}><h2 className="mb-4 text-headline-lg text-navy">{t("nav_gallery")}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{gallery.map((id, i) => <MediaImg key={id} id={id} alt={`${name} ${i + 1}`} className="h-48 w-full rounded-lg" />)}</div></section>
        )}
      </div>
      <CtaBand title={t("svc_detail_cta_t")} text={t("svc_detail_cta_x")} />
    </>
  );
}