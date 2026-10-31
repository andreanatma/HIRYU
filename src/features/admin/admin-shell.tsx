"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  services: "Services", "product-types": "Product Types", products: "Products", portfolio: "Portfolio", gallery: "Gallery",
  blogs: "Blogs", "our-team": "Our Team", brands: "Brands", contact: "Contact Messages", users: "User Management",
  "activity-logs": "Activity Logs", settings: "General Settings", new: "New",
};

/** Breadcrumb dari URL. Di layar kecil hanya halaman aktif yang ditampilkan. */
export function AdminCrumb() {
  const path = usePathname();
  const segs = path.replace(/^\/dashboard-admin\/?/, "").split("/").filter(Boolean);
  let acc = "/dashboard-admin";
  const crumbs = segs.map((s, i) => {
    acc += `/${s}`;
    return { label: LABELS[s] ?? (/^\d+$/.test(s) ? "Edit" : s), href: i < segs.length - 1 ? acc : null };
  });
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-body-sm text-slate-text">
      <Link href="/dashboard-admin" aria-current={segs.length === 0 ? "page" : undefined} className={cn("items-center gap-1.5 rounded transition-colors hover:text-primary", segs.length === 0 ? "flex font-semibold text-navy" : "hidden sm:flex")}>
        <Icon name="home" className="text-[18px]" />Dashboard
      </Link>
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={`${c.label}-${i}`} className={cn("min-w-0 items-center gap-1", last ? "flex" : "hidden sm:flex")}>
            <Icon name="chevron_right" className={cn("text-[18px] text-outline", i === 0 && "hidden sm:inline-block")} />
            {c.href ? <Link href={c.href} className="truncate transition-colors hover:text-primary">{c.label}</Link> : <span aria-current="page" className="truncate font-semibold text-navy">{c.label}</span>}
          </span>
        );
      })}
    </nav>
  );
}

/** Kerangka admin: sidebar tetap di desktop, drawer geser di mobile, header lengket. */
export function AdminShell({ sidebar, topbar, children }: { sidebar: React.ReactNode; topbar: React.ReactNode; children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [path]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="min-h-screen bg-mist">
      <aside className="adm-sidebar fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col lg:flex">{sidebar}</aside>

      <div className={cn("fixed inset-0 z-50 transition-[visibility] duration-300 lg:hidden", open ? "visible" : "invisible")} aria-hidden={!open}>
        <div onClick={() => setOpen(false)} className={cn("absolute inset-0 bg-navy/60 backdrop-blur-sm transition-opacity duration-300", open ? "opacity-100" : "opacity-0")} />
        <aside id="admin-drawer" className={cn("adm-sidebar absolute inset-y-0 left-0 flex w-[84%] max-w-[300px] flex-col shadow-2xl transition-transform duration-300 ease-out", open ? "translate-x-0" : "-translate-x-full")}>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" tabIndex={open ? 0 : -1} className="adm-icon-btn absolute right-3 top-4 z-10 !text-white/80 hover:!bg-white/10 hover:!text-white"><Icon name="close" /></button>
          {sidebar}
        </aside>
      </div>

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="admin-drawer" className="adm-icon-btn -ml-1 lg:hidden"><Icon name="menu" /></button>
          {topbar}
        </header>
        <main className="adm-main mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}