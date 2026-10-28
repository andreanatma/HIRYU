import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { redirectIfRenamed } from "@/lib/redirects";
import { Icon, MediaImg, SafeText } from "@/components/ui";
import { CtaBand } from "@/components/public";

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
  return (
    <>
      <div className="container-x pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-label-md text-on-surface-variant"><Link href="/service" className="hover:text-primary">Services</Link><Icon name="chevron_right" className="text-[14px]" /><span className="text-on-surface">{s.name}</span></nav>
        <div className="grid gap-10 lg:grid-cols-2">
          <MediaImg id={s.imageId ?? gallery[0]} alt={s.name} className="h-80 w-full rounded-lg lg:h-[420px]" icon="design_services" />
          <div><h1 className="text-display-md-mobile text-navy md:text-display-md">{s.name}</h1><div className="mt-5"><SafeText text={s.description} /></div><Link href="/contact" className="btn-accent mt-8">Contact Us<Icon name="arrow_forward" className="text-[18px]" /></Link></div>
        </div>
        {gallery.length > 0 && (
          <section className="mt-12" aria-label="Service images"><h2 className="mb-4 text-headline-lg text-navy">Gallery</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{gallery.map((id, i) => <MediaImg key={id} id={id} alt={`${s.name} image ${i + 1}`} className="h-48 w-full rounded-lg" />)}</div></section>
        )}
      </div>
      <CtaBand title="Discuss this service with our team" text="Tell us about your equipment and requirements." />
    </>
  );
}
