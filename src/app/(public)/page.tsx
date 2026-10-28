import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { buildMetadata, jsonLd, SITE_URL } from "@/lib/seo";
import { formatDate, truncate } from "@/lib/utils";
import { Icon, MediaImg } from "@/components/ui";
import { SectionHead } from "@/components/public";
import { LogoStrip } from "@/components/client";
import { ContactSection } from "@/components/contact-section";

export const generateMetadata = () => buildMetadata({ pageKey: "home", path: "/" });

export default async function Home() {
  const [s, about, services, products, portfolio, brands, clients, gallery, team, blogs] = await Promise.all([
    getSettings(),
    prisma.aboutSection.findFirst({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { id: "asc" }] }),
    prisma.service.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }], take: 3, include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } } }),
    // Featured + active (and its type active); max 2. No fallback to unrelated products.
    prisma.product.findMany({ where: { isActive: true, isFeatured: true, productType: { is: { isActive: true } } }, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }], take: 2 }),
    prisma.portfolio.findMany({ where: { isActive: true, isFeatured: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }], take: 2, include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { name: "asc" }] }),
    prisma.client.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { name: "asc" }] }),
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
              <Link href="/products" className="btn-accent !px-7 !py-3.5">Explore Products<Icon name="arrow_forward" className="text-[18px]" /></Link>
              <Link href="/about-us" className="btn-outline-light !px-7 !py-3.5">About Us</Link>
            </div>
          </div>
          <div className="hidden lg:col-span-4 lg:block" aria-hidden="true"><div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-white/5"><Icon name="biotech" className="text-[110px] text-white/30" /></div></div>
        </div>
      </section>

      {/* 2. About Us (source: company profile PDF, managed in dashboard) */}
      <section className="bg-white py-20" aria-labelledby="home-about">
        <div className="container-x">
          <SectionHead eyebrow="About us" title="Who We Are" />
          <h2 id="home-about" className="sr-only">About Us</h2>
          {about ? (
            <div className={`grid items-center gap-10 ${about.imageId ? "lg:grid-cols-2" : ""}`}>
              <div><h3 className="text-headline-lg text-navy">{about.heading}</h3><p className="mt-4 whitespace-pre-line text-body-lg text-on-surface-variant">{truncate(about.body.replace(/\n{2,}/g, "\n"), 620)}</p><Link href="/about-us" className="btn-primary mt-6">Learn More<Icon name="arrow_forward" className="text-[18px]" /></Link></div>
              {about.imageId && <MediaImg id={about.imageId} alt={about.heading} className="h-72 w-full rounded-lg lg:h-80" />}
            </div>
          ) : <p className="text-body-md text-on-surface-variant">About Us content is being prepared.</p>}
        </div>
      </section>

      {/* 3. Services */}
      {services.length > 0 && (
        <section className="bg-mist py-20"><div className="container-x">
          <SectionHead eyebrow="Our services" title="What We Do" href="/service" linkText="All services" />
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((x) => (
              <Link key={x.id} href={`/service/${x.slug}`} className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
                <div className="overflow-hidden"><MediaImg id={x.imageId ?? x.images[0]?.mediaId} alt={x.name} className="h-44 w-full transition-transform duration-500 group-hover:scale-105" icon="design_services" /></div>
                <div className="flex flex-1 flex-col p-6"><h3 className="text-headline-md text-navy group-hover:text-primary">{x.name}</h3><p className="mt-2 flex-1 text-body-sm text-on-surface-variant">{truncate(x.description, 140)}</p><span className="mt-4 inline-flex items-center gap-1 text-title-md text-primary">Learn more<Icon name="arrow_forward" className="text-[16px]" /></span></div>
              </Link>
            ))}
          </div>
        </div></section>
      )}

      {/* 4. Featured products */}
      <section className="bg-white py-20"><div className="container-x">
        <SectionHead eyebrow="Products" title="Featured Products" href="/products" linkText="View All Products" />
        {products.length === 0 ? <p className="text-body-md text-on-surface-variant">No featured products yet. <Link href="/products" className="text-primary underline">Browse the catalog</Link>.</p> : (
          <div className="grid gap-8 lg:grid-cols-2">
            {products.map((p) => (
              <article key={p.id} className="card flex flex-col gap-5 p-6 sm:flex-row">
                <MediaImg id={p.imageId} alt={p.name} className="h-48 w-full shrink-0 rounded sm:w-48" icon="science" />
                <div className="flex flex-1 flex-col"><h3 className="text-headline-md text-navy">{p.name}</h3>{(p.brand || p.model) && <p className="mt-1 text-label-md uppercase text-primary">{[p.brand, p.model].filter(Boolean).join(" · ")}</p>}<p className="mt-2 flex-1 text-body-sm text-on-surface-variant">{truncate(p.description, 150)}</p><Link href={`/products/${p.slug}`} className="btn-primary mt-4 w-fit">View Product</Link></div>
              </article>
            ))}
          </div>
        )}
      </div></section>

      {/* 5. Featured portfolio */}
      {portfolio.length > 0 && (
        <section className="bg-mist py-20"><div className="container-x">
          <SectionHead eyebrow="Portfolio" title="Featured Projects" href="/portfolio" linkText="View All Portfolio" />
          <div className="grid gap-8 md:grid-cols-2">
            {portfolio.map((p) => (
              <Link key={p.id} href={`/portfolio/${p.slug}`} className="card group overflow-hidden transition-shadow hover:shadow-lg">
                <div className="overflow-hidden"><MediaImg id={p.imageId ?? p.images[0]?.mediaId} alt={p.name} className="h-60 w-full transition-transform duration-500 group-hover:scale-105" icon="folder_special" /></div>
                <div className="p-6"><h3 className="text-title-lg text-navy group-hover:text-primary">{p.name}</h3>{p.clientName && <p className="mt-1 text-body-sm text-on-surface-variant">Client: {p.clientName}</p>}</div>
              </Link>
            ))}
          </div>
        </div></section>
      )}

      {/* 6. Brands */}
      {brands.length > 0 && (
        <section className="bg-navy py-16" aria-labelledby="brands-h"><div className="container-x">
          <h2 id="brands-h" className="mb-8 text-center text-headline-lg text-white">Brands</h2>
          <LogoStrip dark items={brands.map((b) => ({ id: b.id, name: b.name, logoId: b.logoId, url: b.websiteUrl }))} />
        </div></section>
      )}

      {/* 7. Clients */}
      {clients.length > 0 && (
        <section className="bg-white py-16" aria-labelledby="clients-h"><div className="container-x">
          <h2 id="clients-h" className="mb-8 text-center text-headline-lg text-navy">Clients</h2>
          <LogoStrip items={clients.map((b) => ({ id: b.id, name: b.name, logoId: b.logoId, url: b.websiteUrl }))} />
        </div></section>
      )}

      {/* 8. Gallery: newest three images */}
      {gallery.length > 0 && (
        <section className="bg-mist py-20"><div className="container-x">
          <SectionHead eyebrow="Gallery" title="Latest Photos" href="/gallery" linkText="View Gallery" />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {gallery.map((g, i) => <li key={g.id}><Link href="/gallery" className="group block overflow-hidden rounded-lg"><MediaImg id={g.imageId} alt={`Gallery photo ${i + 1}`} className="h-60 w-full transition-transform duration-500 group-hover:scale-105" /></Link></li>)}
          </ul>
        </div></section>
      )}

      {/* 9. Our team: first three by displayOrder */}
      {team.length > 0 && (
        <section className="bg-white py-20"><div className="container-x">
          <SectionHead eyebrow="People" title="Our Team" href="/about-us" linkText="About Us" />
          <div className="grid gap-6 sm:grid-cols-3">
            {team.map((t) => <div key={t.id} className="card overflow-hidden"><MediaImg id={t.photoId} alt={`Photo of ${t.name}`} className="aspect-[4/3] w-full" icon="person" /><div className="p-5"><h3 className="text-title-lg text-navy">{t.name}</h3><p className="text-body-sm text-primary">{t.position}</p></div></div>)}
          </div>
        </div></section>
      )}

      {/* Blogs (latest published) */}
      {blogs.length > 0 && (
        <section className="bg-mist py-20"><div className="container-x">
          <SectionHead eyebrow="Knowledge center" title="Latest Articles" href="/blogs" linkText="All articles" />
          <div className="grid gap-8 md:grid-cols-3">
            {blogs.map((b) => (
              <article key={b.id} className="card overflow-hidden transition-shadow hover:shadow-md">
                <MediaImg id={b.featuredImageId} alt={b.title} className="h-44 w-full" icon="article" />
                <div className="p-6"><p className="text-label-sm text-on-surface-variant">{formatDate(b.publishedAt)}</p><h3 className="mt-2 text-title-lg"><Link href={`/blogs/${b.slug}`} className="hover:text-primary">{b.title}</Link></h3><p className="mt-2 text-body-sm text-on-surface-variant">{truncate(b.excerpt ?? "", 120)}</p></div>
              </article>
            ))}
          </div>
        </div></section>
      )}

      {/* 10. Contact Us */}
      <section className="bg-white py-20" id="contact" aria-labelledby="contact-h"><div className="container-x">
        <SectionHead eyebrow="Contact us" title="Get in Touch" />
        <h2 id="contact-h" className="sr-only">Contact Us</h2>
        <ContactSection />
        
      </div></section>
    </>
  );
}
