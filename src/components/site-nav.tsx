"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./ui";
import { cn } from "@/lib/utils";

// 082-2211-0-1122 -> format internasional
const WA_NUMBER = "6282221101122";
const WA_TEXT = "Hello, I would like to inquire about your services.";

const LINKS = [
  ["/", "Home"],
  ["/service", "Services"],
  ["/products", "Products"],
  ["/portfolio", "Portfolio"],
  ["/about-us", "About Us"],
  ["/gallery", "Gallery"],
  ["/blogs", "Blogs"],
] as const;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={cn("h-[18px] w-[18px] shrink-0", className)}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export type NavType = { slug: string; name: string };

export function SiteNav({ name, productTypes = [] }: { name: string; productTypes?: NavType[] }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [mProd, setMProd] = useState(false);
  useEffect(() => {
    setOpen(false);
    setMProd(false);
  }, [path]);

  // Home ("/") hanya aktif jika path persis "/", agar tidak ikut aktif di semua halaman.
  const active = (h: string) => (h === "/" ? path === "/" : path === h || path.startsWith(h + "/"));
  const waProps = { href: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}`, target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-primary to-brand-hover text-white shadow-md">
      <div className="container-x flex h-20 items-center justify-between">
        <Link href="/" aria-label={`${name} home`} className="flex items-center gap-3 text-title-lg font-bold tracking-tight text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-white text-primary"><Icon name="biotech" className="text-[22px]" /></span>
          <span className="max-w-[210px] leading-tight sm:max-w-none">{name}</span>
        </Link>

        <nav aria-label="Main" className="hidden h-full items-center gap-7 lg:flex">
          {LINKS.map(([h, label]) => {
            const linkCls = cn(
              "border-b-2 py-1 text-body-md transition-colors",
              active(h) ? "border-accent font-semibold text-white" : "border-transparent text-white/85 hover:text-white",
            );
            if (h !== "/products") {
              return <Link key={h} href={h} aria-current={active(h) ? "page" : undefined} className={linkCls}>{label}</Link>;
            }
            return (
              <div key={h} className="group relative flex h-full items-center">
                <Link href={h} aria-current={active(h) ? "page" : undefined} aria-haspopup="true" className={cn(linkCls, "inline-flex items-center gap-0.5")}>
                  {label}<Icon name="expand_more" className="text-[18px] transition-transform group-hover:rotate-180" />
                </Link>
                {productTypes.length > 0 && (
                  <div className="invisible absolute left-0 top-full w-72 translate-y-1 border border-line bg-white text-ink opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <ul className="max-h-[70vh] overflow-y-auto py-2">
                      <li><Link href="/products" className="block truncate px-5 py-2.5 text-body-md font-semibold text-navy hover:bg-mist hover:text-primary">All Products</Link></li>
                      {productTypes.map((x) => (
                        <li key={x.slug}>
                          <Link href={`/products?type=${x.slug}`} title={x.name} className="block truncate px-5 py-2.5 text-body-md text-on-surface-variant hover:bg-mist hover:text-primary">{x.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
          <a {...waProps} className="btn-accent !px-5 !py-2.5"><WhatsAppIcon />Contact Us</a>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <button className="rounded p-2 hover:bg-white/10" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="container-x flex max-h-[calc(100vh-5rem)] flex-col gap-1 overflow-y-auto border-t border-white/20 pb-4 pt-2 lg:hidden">
          {LINKS.map(([h, label]) => {
            if (h !== "/products") {
              return (
                <Link key={h} href={h} aria-current={active(h) ? "page" : undefined} className={cn("rounded px-3 py-2.5", active(h) ? "bg-white/15 font-semibold" : "hover:bg-white/10")}>
                  {label}
                </Link>
              );
            }
            return (
              <div key={h}>
                <div className={cn("flex items-center justify-between rounded", active(h) ? "bg-white/15 font-semibold" : "hover:bg-white/10")}>
                  <Link href={h} aria-current={active(h) ? "page" : undefined} className="flex-1 px-3 py-2.5">{label}</Link>
                  {productTypes.length > 0 && (
                    <button type="button" onClick={() => setMProd(!mProd)} aria-expanded={mProd} aria-label="Expand product types" className="p-2.5">
                      <Icon name={mProd ? "remove" : "add"} />
                    </button>
                  )}
                </div>
                {mProd && (
                  <ul className="ml-3 border-l border-white/20 pl-2">
                    {productTypes.map((x) => (
                      <li key={x.slug}>
                        <Link href={`/products?type=${x.slug}`} className="block rounded px-3 py-2 text-body-sm text-white/85 hover:bg-white/10 hover:text-white">{x.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
          <a {...waProps} className="btn-accent mt-2"><WhatsAppIcon />Contact Us</a>
        </nav>
      )}
    </header>
  );
}