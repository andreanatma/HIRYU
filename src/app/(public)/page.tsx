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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "Organization", name: s.company_name, url: SITE_URL, email: s.email || undefined, address: s.address || undefined }) }} />

      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-primary/30 blur-[110px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.06]" />
        <div className="container-x relative grid items-center gap-10 py-20 lg:grid-cols-12 lg:py-28">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-label-md uppercase tracking-wider"><span className="h-2 w-2 rounded-full bg-accent" />{s.company_name}</span>
            <h1 className="text-display-lg-mobile leading-tight tracking-tight text-white md:text-display-lg">{s.hero_title}</h1>
            <div className="h-1 w-24 rounded bg-accent" />
            <p className="max-w-2xl text-body-lg text-slate-300">{s.hero_subtitle}</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/products" className="btn-accent !px-7 !py-3.5">{t("hero_explore")}<Icon name="arrow_forward" className="text-[18px]" /></Link>
              <Link href="/about-us" className="btn-outline-light !px-7 !py-3.5">{t("hero_about")}</Link>
            </div>
          </div>
          <div className="hidden lg:col-span-4 lg:block" aria-hidden="true"><div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-white/5"><Icon name="biotech" className="text-[110px] text-white/30" /></div></div>
        </div>
      </section>

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

      {/* 3. Services (Rata Kiri, Hover Animasi Penuh) */}
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

      {/* 4. Featured products (Dikembalikan Rata Kiri, Hover Animasi Penuh) */}
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

      {/* 5. Featured portfolio (Rata Kiri, Hover Animasi Penuh) */}
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

      {/* 6. Brands (Rata Tengah, Tambahan Aksen Garis Kuning) */}
      {brands.length > 0 && (
        <section className="bg-navy py-16" aria-labelledby="brands-h"><div className="container-x">
          <div className="mb-12 text-center">
            <h2 id="brands-h" className="text-headline-xl text-white">{t("brands")}</h2>
            <div className="mx-auto mt-3 h-1 w-12 rounded bg-accent" />
          </div>
          <LogoStrip dark items={brands.map((b) => ({ id: b.id, name: b.name, logoId: b.logoId, url: b.websiteUrl }))} />
        </div></section>
      )}

      {/* 7. Gallery (Rata Kiri, Hover Animasi Penuh) */}
      {gallery.length > 0 && (
        <section className="bg-mist py-20"><div className="container-x">
          <SectionHead eyebrow={t("gal_eyebrow")} title={t("gal_latest")} href="/gallery" linkText={t("gal_view")} />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {gallery.map((g, i) => <li key={g.id}><Link href="/gallery" className="group block overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><MediaImg id={g.imageId} alt={t("gal_alt", { n: i + 1 })} className="h-60 w-full transition-transform duration-500 group-hover:scale-110" /></Link></li>)}
          </ul>
        </div></section>
      )}

      {/* 8. Our team (Rata Tengah Bawaan Komponen) */}
      <TeamSection
        members={team.map((m) => ({ id: m.id, name: m.name, role: m.position, imageUrl: m.photoId ? `/media/${m.photoId}` : null }))}
        eyebrow={t("team_eyebrow")}
        title={t("team_title")}
      />

      {/* 9. Blogs (Rata Kiri, Link Semua Artikel di Kanan Atas) */}
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

      {/* 10. Contact (Rata Kiri) */}
      <section className="bg-white py-20" id="contact" aria-labelledby="contact-h"><div className="container-x">
        <SectionHead eyebrow={t("contact_eyebrow")} title={t("contact_title")} />
        <h2 id="contact-h" className="sr-only">{t("nav_contact")}</h2>
        <ContactSection />
      </div></section>
    </>
  );
}