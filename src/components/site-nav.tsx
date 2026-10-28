"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./ui";
import { cn } from "@/lib/utils";

const LINKS = [["/service", "Services"], ["/products", "Products"], ["/portfolio", "Portfolio"], ["/about-us", "About Us"], ["/gallery", "Gallery"], ["/blogs", "Blogs"]] as const;

export function SiteNav({ name }: { name: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const active = (h: string) => path === h || path.startsWith(h + "/");
  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-primary to-brand-hover text-white shadow-md">
      <div className="container-x flex h-20 items-center justify-between">
        <Link href="/" aria-label={`${name} home`} className="flex items-center gap-3 text-title-lg font-bold tracking-tight text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-white text-primary"><Icon name="biotech" className="text-[22px]" /></span>
          <span className="max-w-[210px] leading-tight sm:max-w-none">{name}</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {LINKS.map(([h, l]) => (
            <Link key={h} href={h} aria-current={active(h) ? "page" : undefined} className={cn("border-b-2 py-1 text-body-md transition-colors", active(h) ? "border-accent font-semibold text-white" : "border-transparent text-white/85 hover:text-white")}>{l}</Link>
          ))}
          <Link href="/contact" aria-current={active("/contact") ? "page" : undefined} className="btn-accent !px-5 !py-2.5">Contact Us</Link>
        </nav>
        <button className="rounded p-2 hover:bg-white/10 lg:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="container-x flex flex-col gap-1 border-t border-white/20 pb-4 pt-2 lg:hidden">
          {LINKS.map(([h, l]) => <Link key={h} href={h} className={cn("rounded px-3 py-2.5", active(h) ? "bg-white/15 font-semibold" : "hover:bg-white/10")}>{l}</Link>)}
          <Link href="/contact" className="btn-accent mt-2">Contact Us</Link>
        </nav>
      )}
    </header>
  );
}
