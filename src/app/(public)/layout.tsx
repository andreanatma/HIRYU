import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { safeMapsUrl } from "@/lib/maps";
import { Icon } from "@/components/ui";
import { SiteNav } from "@/components/site-nav";
import { AdminBar } from "@/components/admin-bar";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const COLS: [string, [string, string][]][] = [
  ["Solutions", [["/service", "Services"], ["/products", "Products"], ["/portfolio", "Portfolio"]]],
  ["Company", [["/about-us", "About Us"], ["/gallery", "Gallery"], ["/blogs", "Blogs"]]],
  ["Connect", [["/contact", "Contact Us"]]],
];

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [s, admin] = await Promise.all([getSettings(), getSession()]);
  const wa = s.whatsapp?.replace(/\D/g, "") ?? "";
  const map = safeMapsUrl(s.maps_embed_url);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <SiteNav name={s.company_name} />
      {admin && <AdminBar name={admin.name} />}

      <main id="main" className="min-h-[60vh] pt-20">
        {children}
      </main>

      <footer className="mt-12 bg-navy pb-8 pt-10 md:mt-20 md:pb-10 md:pt-16 text-slate-300">
        <div className="container-x">
          <div className="mb-8 grid gap-8 md:mb-12 md:gap-10 lg:grid-cols-12">
            
            {/* 1. Brand & Information */}
            <div className={`flex flex-col gap-3 md:gap-4 ${map ? "lg:col-span-4" : "lg:col-span-6"}`}>
              <span className="flex items-center gap-3 text-title-lg font-bold text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-white text-primary">
                  <Icon name="biotech" className="text-[22px]" />
                </span>
                {s.company_name}
              </span>

              {s.footer_description && (
                <p className="max-w-sm text-body-sm md:text-body-md text-slate-300/90">
                  {s.footer_description}
                </p>
              )}

              <ul className="space-y-2 text-body-sm">
                {s.address && (
                  <li className="flex items-start gap-2.5">
                    <Icon name="location_on" className="mt-0.5 text-[18px] text-accent shrink-0" />
                    <span>{s.address}</span>
                  </li>
                )}
                {s.email && (
                  <li className="flex items-center gap-2.5">
                    <Icon name="mail" className="text-[18px] text-accent shrink-0" />
                    <a href={`mailto:${s.email}`} className="transition-colors hover:text-white">
                      {s.email}
                    </a>
                  </li>
                )}
                {wa && (
                  <li className="flex items-center gap-2.5">
                    <Icon name="chat" className="text-[18px] text-accent shrink-0" />
                    <a
                      href={`https://wa.me/${wa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-white"
                    >
                      WhatsApp +{wa}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* 2. Google Maps Embed (Ukuran proporsional di HP) */}
            {map && (
              <div className="flex flex-col lg:col-span-3">
                <div className="h-40 md:h-full w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-inner">
                  <iframe
                    title="Company location on Google Maps"
                    src={map}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                  />
                </div>
              </div>
            )}

            {/* 3. Link Navigation Columns (Layout Grid 2/3 Kolom di HP) */}
            <div className={`grid grid-cols-2 gap-6 sm:grid-cols-3 ${map ? "lg:col-span-5" : "lg:col-span-6"} lg:grid-cols-3`}>
              {COLS.map(([h, links]) => (
                <div key={h} className="flex flex-col gap-2">
                  <h3 className="text-label-md font-semibold text-white uppercase tracking-wider">{h}</h3>
                  <ul className="space-y-1.5">
                    {links.map(([href, l]) => (
                      <li key={href}>
                        <Link href={href} className="text-body-sm text-slate-300 transition-colors hover:text-white">
                          {l}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>

          {/* Copyright */}
          <p className="border-t border-white/10 pt-6 text-center text-body-sm text-slate-400">
            © {new Date().getFullYear()} {s.company_name}. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}