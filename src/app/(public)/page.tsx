import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { getHomeSlides } from "@/lib/hero";
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
import { Reveal } from "@/components/public/reveal";

export const generateMetadata = () => buildMetadata({ pageKey: "home", path: "/" });

export default async function Home() {
  const [s, services, products, portfolio, brands, gallery, team, blogs, slideIds] = await Promise.all([
    getSettings(),
    prisma.service.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }], take: 3, include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } } }),
    prisma.product.findMany({ where: { isActive: true, isFeatured: true, productType: { is: { isActive: true } } }, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }], take: 4 }),
    prisma.portfolio.findMany({ where: { isActive: true, isFeatured: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }], take: 3, include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { name: "asc" }] }),
    prisma.gallery.findMany({ where: { isActive: true, imageId: { not: null } }, orderBy: [{ createdAt: "desc" }], take: 5, select: { id: true, imageId: true } }),
    prisma.teamMember.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { id: "asc" }], take: 3 }),
    prisma.blog.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 3 }),
    getHomeSlides(),
  ]);

  return (
    <div className="home-soft">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "Organization", name: s.company_name, url: SITE_URL, email: s.email || undefined, address: s.address || undefined }) }} />

      {/* 1. HERO — bagian bawahnya memudar halus ke warna section berikutnya */}
      <HeroSlider
        companyName={s.company_name}
        title={s.hero_title}
        subtitle={s.hero_subtitle}
        exploreText={t("hero_explore")}
        aboutText={t("hero_about")}
        images={slideIds.length > 0 ? slideIds.map((id) => `/media/${id}`) : undefined}
      />

      {/* 2. Trust indicators (Clients) */}
      {CLIENT_LOGOS.length > 0 && (
        <section className="bg-mist pb-6 pt-2" aria-labelledby="clients-h">
          <div className="container-x">
            <h2 id="clients-h" className="sr-only">Trusted by Clients</h2>
            <p className="mb-5 text-center text-label-md uppercase tracking-widest text-slate-500">Trusted by leading laboratories and industries</p>
            <LogoStrip items={CLIENT_LOGOS.map((c, i) => ({ id: i, name: c.name, logoId: null, src: c.logo ?? null, url: c.url ?? null }))} />
          </div>
        </section>
      )}

      {/* 3. Services */}
      {services.length > 0 && (
        <section className="sec-deco sec-grid bg-gradient-to-b from-mist to-[#EEF4FC] pb-14 pt-6 md:pb-16 md:pt-8">
          <div className="container-x">
            <Reveal><SectionHead eyebrow={t("svc_eyebrow")} title={t("svc_title")} href="/service" linkText={t("svc_all")} /></Reveal>
            <div className="flow-cards [--cols:1] md:[--cols:3] [--gap:1.25rem] md:[--gap:1.5rem]">
              {services.map((x, i) => (
                <Reveal key={x.id} delay={i * 100} className="h-full">
                  <Link href={`/service/${x.slug}`} className="card card-lift shine group relative flex h-full flex-col overflow-hidden">
                    <div className="relative overflow-hidden">
                      <MediaImg id={x.imageId ?? x.images[0]?.mediaId} alt={x.name} className="h-44 w-full transition-transform duration-700 ease-out group-hover:scale-110" icon="design_services" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
                      <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-label-md font-extrabold text-navy shadow-md transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <h3 className="text-headline-md text-navy transition-colors group-hover:text-primary">{x.name}</h3>
                      <p className="mt-2 flex-1 text-body-sm text-on-surface-variant">{truncate(x.description, 130)}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-title-md text-primary">{t("learn_more")}<Icon name="arrow_forward" className="arrow-shift text-[16px]" /></span>
                    </div>
                    <span className="accent-bar" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Featured products — 4 kolom, padat */}
      <section className="sec-deco sec-dots bg-gradient-to-b from-[#EEF4FC] to-mist py-14 md:py-16">
        <div className="container-x">
          <Reveal><SectionHead eyebrow={t("prod_eyebrow")} title={t("prod_featured")} href="/products" linkText={t("prod_all")} /></Reveal>
          {products.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">{t("prod_none")} <Link href="/products" className="text-primary underline">{t("prod_browse")}</Link>.</p>
          ) : (
            <div className="flow-cards [--cols:1] sm:[--cols:2] lg:[--cols:4] [--gap:1rem] lg:[--gap:1.25rem]">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={i * 80} className="h-full">
                  <article className="card card-lift shine group relative flex h-full flex-col overflow-hidden">
                    <Link href={`/products/${p.slug}`} className="relative block overflow-hidden bg-mist" aria-label={p.name}>
                      <MediaImg id={p.imageId} alt={p.name} className="aspect-[4/3] w-full transition-transform duration-700 ease-out group-hover:scale-110" icon="science" />
                      {p.brand && <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-label-sm uppercase text-primary shadow-sm backdrop-blur">{p.brand}</span>}
                    </Link>
                    <div className="flex flex-1 flex-col p-4 md:p-5">
                      <h3 className="text-title-lg text-navy transition-colors group-hover:text-primary">{p.name}</h3>
                      {p.model && <p className="mt-0.5 text-label-md uppercase text-slate-text">{p.model}</p>}
                      <p className="mt-2 flex-1 text-body-sm text-on-surface-variant">{truncate(p.description, 90)}</p>
                      <Link href={`/products/${p.slug}`} className="btn-primary group/btn mt-4 w-full !py-2 text-body-sm">
                        {t("view_product")}<Icon name="arrow_forward" className="text-[16px] transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                    <span className="accent-bar" />
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Featured portfolio — kartu gambar penuh dengan caption overlay */}
      {portfolio.length > 0 && (
        <section className="sec-deco sec-grid bg-gradient-to-b from-mist to-[#EEF4FC] py-14 md:py-16">
          <div className="container-x">
            <Reveal><SectionHead eyebrow={t("pf_eyebrow")} title={t("pf_featured")} href="/portfolio" linkText={t("pf_all")} /></Reveal>
            <div className="flow-cards [--cols:1] md:[--cols:2] lg:[--cols:3] [--gap:1.25rem]">
              {portfolio.map((p, i) => (
                <Reveal key={p.id} delay={i * 100} className="h-full">
                  <Link href={`/portfolio/${p.slug}`} className="group relative block overflow-hidden rounded-xl bg-navy shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_50px_-20px_rgba(8,102,217,0.55)]">
                    <MediaImg id={p.imageId ?? p.images[0]?.mediaId} alt={p.name} className="aspect-[16/11] w-full transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-90" icon="folder_special" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      {p.clientName && <p className="text-label-sm uppercase tracking-wider text-accent">{t("client_label")} {p.clientName}</p>}
                      <h3 className="mt-1 text-title-lg text-white">{p.name}</h3>
                      <span className="mt-2 inline-flex translate-y-2 items-center gap-1 text-body-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        {t("learn_more")}<Icon name="arrow_forward" className="text-[16px]" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Brands */}
      {brands.length > 0 && (
        <section className="relative overflow-hidden bg-navy py-12" aria-labelledby="brands-h">
          <div className="container-x relative">
            <Reveal>
              <div className="mb-8 text-center">
                <h2 id="brands-h" className="text-headline-xl text-white">{t("brands")}</h2>
                <div className="mx-auto mt-3 h-1 w-12 rounded bg-accent" />
              </div>
            </Reveal>
            <LogoStrip dark items={brands.map((b) => ({ id: b.id, name: b.name, logoId: b.logoId, url: b.websiteUrl }))} />
          </div>
        </section>
      )}

      {/* 7. Gallery — bento grid (1 besar + 4 kecil) */}
      {gallery.length > 0 && (
        <section className="sec-deco sec-dots bg-gradient-to-b from-[#EEF4FC] to-mist py-14 md:py-16">
          <div className="container-x">
            <Reveal><SectionHead eyebrow={t("gal_eyebrow")} title={t("gal_latest")} href="/gallery" linkText={t("gal_view")} /></Reveal>
            <ul className="grid auto-rows-[9.5rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] md:grid-cols-4 md:gap-4">
              {gallery.map((g, i) => (
                <li key={g.id} className={i === 0 && gallery.length >= 3 ? "col-span-2 row-span-2" : ""}>
                  <Reveal delay={i * 80} className="h-full">
                    <Link href="/gallery" className="group relative block h-full overflow-hidden rounded-xl shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                      <MediaImg id={g.imageId} alt={t("gal_alt", { n: i + 1 })} className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-110" />
                      <div className="absolute inset-0 flex items-center justify-center bg-navy/0 transition-colors duration-300 group-hover:bg-navy/45">
                        <span className="flex h-12 w-12 scale-50 items-center justify-center rounded-full bg-accent text-navy opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                          <Icon name="zoom_in" className="text-[26px]" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 8. Our team */}
      <TeamSection
        members={team.map((m) => ({ id: m.id, name: m.name, role: m.position, imageUrl: m.photoId ? `/media/${m.photoId}` : null }))}
        eyebrow={t("team_eyebrow")}
        title={t("team_title")}
        gradient="from-mist to-[#EEF4FC]"
      />

      {/* 9. Blogs */}
      {blogs.length > 0 && (
        <section className="sec-deco sec-rings-full bg-[#EEF4FC] py-14 md:py-16">
          <div className="container-x">
            <Reveal><SectionHead eyebrow={t("blog_eyebrow")} title={t("blog_latest")} href="/blogs" linkText={t("blog_all")} /></Reveal>
            <div className="flex flex-wrap justify-center gap-5 md:gap-6">
              {blogs.map((b, i) => (
                <Reveal key={b.id} delay={i * 100} className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
                  <article className="card card-lift group relative h-full overflow-hidden">
                    <Link href={`/blogs/${b.slug}`} className="block" aria-label={b.title}>
                      <div className="relative overflow-hidden">
                        <MediaImg id={b.featuredImageId} alt={b.title} className="h-44 w-full transition-transform duration-700 ease-out group-hover:scale-110" icon="article" />
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-label-sm text-navy shadow-sm backdrop-blur">{formatDate(b.publishedAt)}</span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-title-lg text-navy transition-colors group-hover:text-primary">{b.title}</h3>
                        <p className="mt-2 text-body-sm text-on-surface-variant">{truncate(b.excerpt ?? "", 110)}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-title-md text-primary">{t("read")}<Icon name="arrow_forward" className="arrow-shift text-[16px]" /></span>
                      </div>
                    </Link>
                    <span className="accent-bar" />
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. Contact */}
      <section className="sec-deco sec-grid bg-gradient-to-b from-[#EEF4FC] to-white py-14 md:py-16" id="contact" aria-labelledby="contact-h">
        <div className="container-x">
          <Reveal><SectionHead eyebrow={t("contact_eyebrow")} title={t("contact_title")} /></Reveal>
          <h2 id="contact-h" className="sr-only">{t("nav_contact")}</h2>
          <Reveal><ContactSection /></Reveal>
        </div>
      </section>
    </div>
  );
}