import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { t } from "@/lib/dictionary";
import { Icon } from "@/components/ui";
import { SiteNav } from "@/components/site-nav";
import { AdminBar } from "@/components/admin-bar";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const COLS = [
  ["col_solutions", [["/service", "nav_services"], ["/products", "nav_products"], ["/portfolio", "nav_portfolio"]]],
  ["col_company", [["/about-us", "nav_about"], ["/gallery", "nav_gallery"], ["/blogs", "nav_blogs"]]],
  ["col_connect", [["/contact", "nav_contact"]]],
] as const;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [s, admin] = await Promise.all([getSettings(), getSession()]);
  const wa = s.whatsapp.replace(/\D/g, "");
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2">{t("skip")}</a>
      <SiteNav name={s.company_name} />
      {admin && <AdminBar name={admin.name} />}
      <main id="main" className="min-h-[60vh] pt-20">{children}</main>
      <footer className="mt-20 bg-navy pb-10 pt-16 text-slate-300">
        <div className="container-x">
          <div className="mb-12 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            <div className="flex flex-col gap-4 lg:col-span-2">
              <span className="flex items-center gap-3 text-title-lg font-bold text-white"><span className="flex h-9 w-9 items-center justify-center rounded bg-white text-primary"><Icon name="biotech" className="text-[22px]" /></span>{s.company_name}</span>
              <p className="max-w-sm text-body-md">{s.footer_description}</p>
              <ul className="space-y-1.5 text-body-sm">
                {s.address && <li className="flex gap-2"><Icon name="location_on" className="text-[18px] text-accent" />{s.address}</li>}
                {s.email && <li className="flex gap-2"><Icon name="mail" className="text-[18px] text-accent" /><a href={`mailto:${s.email}`} className="hover:text-white">{s.email}</a></li>}
                {wa && <li className="flex gap-2"><Icon name="chat" className="text-[18px] text-accent" /><a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">{t("whatsapp")} +{wa}</a></li>}
              </ul>
            </div>
            {COLS.map(([h, links]) => (
              <div key={h} className="flex flex-col gap-3">
                <h3 className="text-title-md text-white">{t(h)}</h3>
                {links.map(([href, l]) => <Link key={href} href={href} className="text-body-sm hover:text-white">{t(l)}</Link>)}
              </div>
            ))}
          </div>
          <p className="border-t border-white/10 pt-6 text-body-sm">© {new Date().getFullYear()} {s.company_name}. {t("rights")}</p>
        </div>
      </footer>
    </>
  );
}