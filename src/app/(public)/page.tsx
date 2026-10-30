import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { t } from "@/lib/dictionary";
import { buildMetadata, jsonLd, SITE_URL } from "@/lib/seo";
import { formatDate, truncate } from "@/lib/utils";
import { Icon, MediaImg } from "@/components/ui";
import { SectionHead } from "@/components/public";
import { TeamSection } from "@/components/about-sections";
import { LogoStrip } from "@/components/client";
import { ContactSection } from "@/components/contact-section";
import { CLIENT_LOGOS } from "@/content/site-content";
import { HeroSlider } from "@/components/public/hero-slider";

export const generateMetadata = () => buildMetadata({ pageKey: "home", path: "/" });

export default async function Home() {
  const [s, services, products, portfolio, brands, gallery, team, blogs] = await Promise.all([
    getSettings(),
    prisma.service.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }], take: 3, include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } } }),
    prisma.product.findMany({ where: { isActive: true, isFeatured: true, productType: { is: { isActive: true } } }, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }], take: 2 }),
    prisma.portfolio.findMany({ where: { isActive: true, isFeatured: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }], take: 2, include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { name: "asc" }] }),
    prisma.gallery.findMany({ where: { isActive: true, imageId: { not: null } }, orderBy: [{ createdAt: "desc" }], take: 3, select: { id: true, imageId: true } }),
    prisma.teamMember.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { id: "asc" }], take: 3 }),
    prisma.blog.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 3 }),
  ]);

  // Ekstrak teks gambar dengan Type Assertion agar terhindar dari Error TypeScript
  const settingsData = s as Record<string, string>;
  const heroImagesStr = settingsData.hero_images;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "Organization", name: s.company_name, url: SITE_URL, email: s.email || undefined, address: s.address || undefined }) }} />

      {/* 1. Hero Baru dengan Slider */}
      <HeroSlider 
        companyName={s.company_name}
        title={s.hero_title}
        subtitle={s.hero_subtitle}
        exploreText={t("hero_explore")}
        aboutText={t("hero_about")}
        images={heroImagesStr ? heroImagesStr.split(',').map((img: string) => img.trim()).filter(Boolean) : undefined}
      />

      {/* 2. Trust indicators (Clients) */}
      {CLIENT_LOGOS.length > 0 && (
        <section className="border-b border-slate-200 bg-white py-10" aria-labelledby="clients-h">
          <div className="container-x">
            <h2 id="clients-h" className="sr-only">Trusted by Clients</h2>
            <p className="mb-6 text-center text-label-md uppercase tracking-widest text-slate-500">
              Trusted by leading laboratories and industries
            </p>
            <LogoStrip items={CLIENT_LOGOS.map((c, i) => ({ id: i, name: c.name, logoId: null, src: c.logo ?? null, url: c.url ?? null }))} />
          </div>
        </section>
      )}

      {/* 3. Services */}
      {services.length > 0 && (
        <section className="bg-mist py-20"><div className="container-x">
          <SectionHead eyebrow={t("svc_eyebrow")} title={t("svc_title")} href="/service" linkText={t("svc_all")} />
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((x) => (
              <Link key={x.id} href={`/service/${x.slug}`} className="card group flex flex-col overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="overflow-hidden"><MediaImg id={x.imageId ?? x.images[0]?.mediaId} alt={x.name} className="h-44 w-full transition-transform duration-500 group-hover:scale-110" icon="design_services" /></div>
                <div className="flex flex-1 flex-col p-6"><h3 className="text-headline-md text-navy group-hover:text-primary">{x.name}</h3><p className="mt-2 flex-1 text-body-sm text-on-surface-variant">{truncate(x.description, 140)}</p><span className="mt-4 inline-flex items-center gap-1 text-title-md text-primary">{t("learn_more")}<Icon name="arrow_forward" className="text-[16px]" /></span></div>
              </Link>
            ))}
          </div>
        </div></section>
      )}

      {/* 4. Featured products */}
      <section className="bg-white py-20"><div className="container-x">
        <SectionHead eyebrow={t("prod_eyebrow")} title={t("prod_featured")} href="/products" linkText={t("prod_all")} />
        {products.length === 0 ? <p className="text-body-md text-on-surface-variant">{t("prod_none")} <Link href="/products" className="text-primary underline">{t("prod_browse")}</Link>.</p> : (
          <div className="grid gap-8 lg:grid-cols-2">
            {products.map((p) => (
              <article key={p.id} className="card group flex flex-col gap-5 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:flex-row">
                <div className="shrink-0 overflow-hidden rounded sm:w-48">
                  <MediaImg id={p.imageId} alt={p.name} className="h-48 w-full transition-transform duration-500 group-hover:scale-110" icon="science" />
                </div>
                <div className="flex flex-1 flex-col"><h3 className="text-headline-md text-navy">{p.name}</h3>{(p.brand || p.model) && <p className="mt-1 text-label-md uppercase text-primary">{[p.brand, p.model].filter(Boolean).join(" · ")}</p>}<p className="mt-2 flex-1 text-body-sm text-on-surface-variant">{truncate(p.description, 150)}</p><Link href={`/products/${p.slug}`} className="btn-primary mt-4 w-fit">{t("view_product")}</Link></div>
              </article>
            ))}
          </div>
        )}
      </div></section>

      {/* 5. Featured portfolio */}
      {portfolio.length > 0 && (
        <section className="bg-mist py-20"><div className="container-x">
          <SectionHead eyebrow={t("pf_eyebrow")} title={t("pf_featured")} href="/portfolio" linkText={t("pf_all")} />
          <div className="grid gap-8 md:grid-cols-2">
            {portfolio.map((p) => (
              <Link key={p.id} href={`/portfolio/${p.slug}`} className="card group overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="overflow-hidden"><MediaImg id={p.imageId ?? p.images[0]?.mediaId} alt={p.name} className="h-60 w-full transition-transform duration-500 group-hover:scale-110" icon="folder_special" /></div>
                <div className="p-6"><h3 className="text-title-lg text-navy group-hover:text-primary">{p.name}</h3>{p.clientName && <p className="mt-1 text-body-sm text-on-surface-variant">{t("client_label")} {p.clientName}</p>}</div>
              </Link>
            ))}
          </div>
        </div></section>
      )}

      {/* 6. Brands */}
      {brands.length > 0 && (
        <section className="bg-navy py-16" aria-labelledby="brands-h"><div className="container-x">
          <div className="mb-12 text-center">
            <h2 id="brands-h" className="text-headline-xl text-white">{t("brands")}</h2>
            <div className="mx-auto mt-3 h-1 w-12 rounded bg-accent" />
          </div>
          <LogoStrip dark items={brands.map((b) => ({ id: b.id, name: b.name, logoId: b.logoId, url: b.websiteUrl }))} />
        </div></section>
      )}

      {/* 7. Gallery */}
      {gallery.length > 0 && (
        <section className="bg-mist py-20"><div className="container-x">
          <SectionHead eyebrow={t("gal_eyebrow")} title={t("gal_latest")} href="/gallery" linkText={t("gal_view")} />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {gallery.map((g, i) => <li key={g.id}><Link href="/gallery" className="group block overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><MediaImg id={g.imageId} alt={t("gal_alt", { n: i + 1 })} className="h-60 w-full transition-transform duration-500 group-hover:scale-110" /></Link></li>)}
          </ul>
        </div></section>
      )}

      {/* 8. Our team */}
      <TeamSection
        members={team.map((m) => ({ id: m.id, name: m.name, role: m.position, imageUrl: m.photoId ? `/media/${m.photoId}` : null }))}
        eyebrow={t("team_eyebrow")}
        title={t("team_title")}
      />

      {/* 9. Blogs */}
      {blogs.length > 0 && (
        <section className="bg-mist py-20"><div className="container-x">
          <SectionHead eyebrow={t("blog_eyebrow")} title={t("blog_latest")} href="/blogs" linkText={t("blog_all")} />
          <div className="flex flex-wrap justify-center gap-8 md:justify-start">
            {blogs.map((b) => (
              <article key={b.id} className="card group w-full overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]">
                <div className="overflow-hidden">
                  <MediaImg id={b.featuredImageId} alt={b.title} className="h-44 w-full transition-transform duration-500 group-hover:scale-110" icon="article" />
                </div>
                <div className="p-6"><p className="text-label-sm text-on-surface-variant">{formatDate(b.publishedAt)}</p><h3 className="mt-2 text-title-lg"><Link href={`/blogs/${b.slug}`} className="hover:text-primary">{b.title}</Link></h3><p className="mt-2 text-body-sm text-on-surface-variant">{truncate(b.excerpt ?? "", 120)}</p></div>
              </article>
            ))}
          </div>
        </div></section>
      )}

      {/* 10. Contact */}
      <section className="bg-white py-20" id="contact" aria-labelledby="contact-h"><div className="container-x">
        <SectionHead eyebrow={t("contact_eyebrow")} title={t("contact_title")} />
        <h2 id="contact-h" className="sr-only">{t("nav_contact")}</h2>
        <ContactSection />
      </div></section>
    </>
  );
}