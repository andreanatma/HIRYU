"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Icon } from "./ui";
import { cn } from "@/lib/utils";
import { DICT } from "@/lib/dictionary";
import type { Lang } from "@/lib/lang";
import { setLang } from "@/features/lang-actions";

// 082-2211-0-1122 -> format internasional
const WA_NUMBER = "6282221101122";

const LINKS = [
  ["/service", "nav_services"], ["/products", "nav_products"], ["/portfolio", "nav_portfolio"],
  ["/about-us", "nav_about"], ["/gallery", "nav_gallery"], ["/blogs", "nav_blogs"],
] as const;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={cn("h-[18px] w-[18px] shrink-0", className)}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function LangSwitch({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const change = (l: Lang) => {
    if (l === lang) return;
    start(async () => { await setLang(l); router.refresh(); });
  };
  const btn = (l: Lang, label: string, aria: string) => (
    <button type="button" onClick={() => change(l)} aria-pressed={lang === l} aria-label={aria} disabled={pending}
      className={cn("px-1.5 py-1 text-label-md transition-colors", lang === l ? "font-bold text-accent" : "text-white/80 hover:text-white")}>{label}</button>
  );
  return (
    <div role="group" aria-label={DICT[lang].lang_label} className="flex items-center">
      {btn("id", "ID", "Bahasa Indonesia")}
      <span aria-hidden="true" className="text-white/40">|</span>
      {btn("en", "EN", "English")}
    </div>
  );
}

export function SiteNav({ name, lang }: { name: string; lang: Lang }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const t = DICT[lang];
  useEffect(() => setOpen(false), [path]);
  const active = (h: string) => path === h || path.startsWith(h + "/");
  const waProps = { href: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t.wa_text)}`, target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-primary to-brand-hover text-white shadow-md">
      <div className="container-x flex h-20 items-center justify-between">
        <Link href="/" aria-label={`${name} home`} className="flex items-center gap-3 text-title-lg font-bold tracking-tight text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-white text-primary"><Icon name="biotech" className="text-[22px]" /></span>
          <span className="max-w-[210px] leading-tight sm:max-w-none">{name}</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {LINKS.map(([h, k]) => (
            <Link key={h} href={h} aria-current={active(h) ? "page" : undefined} className={cn("border-b-2 py-1 text-body-md transition-colors", active(h) ? "border-accent font-semibold text-white" : "border-transparent text-white/85 hover:text-white")}>{t[k]}</Link>
          ))}
          <LangSwitch lang={lang} />
          <a {...waProps} className="btn-accent !px-5 !py-2.5"><WhatsAppIcon />{t.nav_contact}</a>
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <LangSwitch lang={lang} />
          <button className="rounded p-2 hover:bg-white/10" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? t.menu_close : t.menu_open} onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="container-x flex flex-col gap-1 border-t border-white/20 pb-4 pt-2 lg:hidden">
          {LINKS.map(([h, k]) => <Link key={h} href={h} className={cn("rounded px-3 py-2.5", active(h) ? "bg-white/15 font-semibold" : "hover:bg-white/10")}>{t[k]}</Link>)}
          <a {...waProps} className="btn-accent mt-2"><WhatsAppIcon />{t.nav_contact}</a>
        </nav>
      )}
    </header>
  );
}