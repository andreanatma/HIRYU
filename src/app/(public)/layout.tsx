import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { safeMapsUrl } from "@/lib/maps";
import { Icon } from "@/components/ui";
import { BrandLogo } from "@/components/brand-logo";
import { SiteNav } from "@/components/site-nav";
import { AdminBar } from "@/components/admin-bar";
import { Reveal } from "@/components/public/reveal";
import { BackToTop } from "@/components/public/back-to-top";
import { ContactPopup } from "@/components/public/contact-popup";
import { getSession } from "@/lib/auth";
import { getNavTypes } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type FooterGroup = [title: string, links: [href: string, label: string][]];

const SOLUTIONS: FooterGroup = ["Solutions", [["/service", "Services"], ["/products", "Products"], ["/portfolio", "Portfolio"]]];
const COMPANY: FooterGroup = ["Company", [["/about-us", "About Us"], ["/gallery", "Gallery"], ["/blogs", "Blogs"]]];
const CONNECT: FooterGroup = ["Connect", [["/contact", "Contact Us"]]];

/** Baris info kontak di footer: ikon berputar + berubah kuning saat hover, teks menyala. */
function InfoRow({ icon, href, external, children }: { icon: string; href?: string; external?: boolean; children: React.ReactNode }) {
  const inner = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-accent ring-1 ring-white/10 transition-all duration-300 group-hover/row:-rotate-6 group-hover/row:scale-110 group-hover/row:bg-accent group-hover/row:text-navy group-hover/row:ring-accent">
        <Icon name={icon} className="text-[18px]" />
      </span>
      <span className="min-w-0 pt-1 [overflow-wrap:anywhere] transition-colors duration-200 group-hover/row:text-white">{children}</span>
    </>
  );
  const cls = "group/row flex items-start gap-3 rounded-lg transition-transform duration-300 hover:translate-x-0.5";
  return href ? (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={cls}>{inner}</a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/** Satu blok tautan footer (judul + garis kuning + daftar link). */
function LinkGroup({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="group/col flex flex-col gap-2.5">
      <div>
        <h3 className="text-label-md font-semibold uppercase tracking-wider text-white">{title}</h3>
        <span className="mt-1.5 block h-0.5 w-6 rounded bg-accent transition-all duration-500 group-hover/col:w-12" />
      </div>
      <ul className="space-y-0.5">
        {links.map(([href, l]) => {
          const ext = href.startsWith("http");
          const cls = "group/link inline-flex items-center py-1.5 text-body-sm text-slate-300 transition-all duration-300 hover:translate-x-1 hover:text-white sm:py-1";
          const dash = <span aria-hidden="true" className="h-px w-0 bg-accent transition-all duration-300 group-hover/link:mr-2 group-hover/link:w-3" />;
          return (
            <li key={href}>
              {ext ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{dash}{l}<Icon name="north_east" className="ml-1 text-[14px] opacity-0 transition-opacity duration-300 group-hover/link:opacity-100" /></a>
              ) : (
                <Link href={href} className={cls}>{dash}{l}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [s, admin, navTypes] = await Promise.all([getSettings(), getSession(), getNavTypes().catch(() => [])]);
  const wa = s.whatsapp?.replace(/\D/g, "") ?? "";
  const map = safeMapsUrl(s.maps_embed_url);

  // "Connect" ikut menampilkan WhatsApp bila nomornya diisi di Settings.
  const connect: FooterGroup = [CONNECT[0], wa ? [...CONNECT[1], ["https://wa.me/" + wa, "WhatsApp"]] : CONNECT[1]];

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <SiteNav name={s.company_name} productTypes={navTypes} />
      {admin && <AdminBar name={admin.name} />}

      <main id="main" className="home-soft min-h-[60vh] pt-20">
        {children}
      </main>

      {/* Tombol panah ke atas: pojok kanan bawah, di samping shortcut Dashboard (bila admin login) */}
      <BackToTop beside={!!admin} />

      {/* Popup Contact us kecil (kanan bawah, di atas slot tombol Back to top / shortcut Dashboard) */}
      <ContactPopup companyName={s.company_name} whatsapp={wa} />

      <footer className="relative isolate mt-12 overflow-hidden bg-navy pb-6 pt-10 text-slate-300 md:mt-20 md:pb-8 md:pt-16">
        {/* Dekorasi: garis kuning di tepi atas, glow, dan grid halus */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-grid-faint absolute inset-0 opacity-20" />
          <div className="float-slow absolute -left-24 top-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="float-slow absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl [animation-delay:-3s]" />
        </div>

        <div className="container-x">
          {/* Mobile: 1 kolom · Tablet (md): brand + peta berdampingan, link di bawahnya · Desktop (lg): 12 kolom */}
          <div className="mb-8 grid gap-8 md:mb-12 md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-12 lg:gap-10">
            {/* 1. Brand & informasi */}
            <Reveal className={`flex flex-col gap-3 md:gap-4 ${map ? "md:col-span-1 lg:col-span-4" : "md:col-span-2 lg:col-span-6"}`}>
              <Link href="/" aria-label={`${s.company_name} — Home`} className="group/brand inline-flex w-fit max-w-full items-center gap-3 text-title-lg font-bold text-white transition-colors duration-300 hover:text-accent">
                <BrandLogo className="transition-transform duration-300 group-hover/brand:-rotate-3 group-hover/brand:scale-105" />
                <span className="min-w-0">{s.company_name}</span>
              </Link>

              {s.footer_description && (
                <p className="max-w-sm text-body-sm text-slate-300/90 md:text-body-md">{s.footer_description}</p>
              )}

              <div className="space-y-3 text-body-sm">
                {s.address && <InfoRow icon="location_on"><span className="whitespace-pre-line">{s.address}</span></InfoRow>}
                {s.email && <InfoRow icon="mail" href={`mailto:${s.email}`}>{s.email}</InfoRow>}
                {wa && <InfoRow icon="chat" href={`https://wa.me/${wa}`} external>WhatsApp +{wa}</InfoRow>}
              </div>
            </Reveal>

            {/* 2. Google Maps: PERSEGI PANJANG (lebar > tinggi), abu-abu halus, berwarna penuh + border kuning saat hover */}
            {map && (
              <Reveal delay={80} className="flex md:col-span-1 lg:col-span-5">
                <div className="group h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-inner transition-all duration-300 hover:border-accent/50 hover:shadow-[0_20px_40px_-20px_rgba(255,212,59,0.35)] sm:h-52 md:h-auto md:min-h-[12rem]">
                  <iframe
                    title="Company location on Google Maps"
                    src={map}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0 grayscale-[40%] transition duration-500 group-hover:grayscale-0"
                  />
                </div>
              </Reveal>
            )}

            {/* 3. Kolom navigasi: kolom 1 = Solutions + Connect (bertumpuk), kolom 2 = Company */}
            <div className={`grid grid-cols-2 gap-x-6 gap-y-7 md:col-span-2 ${map ? "lg:col-span-3" : "lg:col-span-6"}`}>
              <div className="flex flex-col gap-7">
                <Reveal>
                  <LinkGroup title={SOLUTIONS[0]} links={SOLUTIONS[1]} />
                </Reveal>
                <Reveal delay={80}>
                  <LinkGroup title={connect[0]} links={connect[1]} />
                </Reveal>
              </div>
              <Reveal delay={40}>
                <LinkGroup title={COMPANY[0]} links={COMPANY[1]} />
              </Reveal>
            </div>
          </div>

          {/* Bar bawah: hak cipta di tengah (tombol ke atas dipindah ke pojok kanan bawah layar) */}
          <div className="border-t border-white/10 pt-5 text-center text-body-sm text-slate-400">
            <p>© {new Date().getFullYear()} {s.company_name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}