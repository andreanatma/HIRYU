import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logoutAction } from "@/features/auth-actions";
import { IdleGuard, Toast } from "@/components/client";
import { BrandLogo } from "@/components/brand-logo";
import { Icon } from "@/components/ui";
import { AdminNav } from "@/features/admin/admin-nav";
// import { AdminCrumb, AdminShell } from "@/features/admin/auth-shell";
import { AdminCrumb, AdminShell } from "@/features/admin/admin-shell";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Hiryu Techno Admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const unread = await prisma.contactMessage.count({ where: { status: "UNREAD" } });
  const roleLabel = user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin";
  const initials = user.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join("") || "A";

  const sidebar = (
    <>
      <Link href="/dashboard-admin" className="flex h-[72px] shrink-0 items-center gap-3 px-5 pr-14 lg:pr-5">
        <BrandLogo />
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-title-md font-bold text-white">Hiryu Admin</span>
          <span className="block truncate text-[11px] text-white/50">Content management</span>
        </span>
      </Link>
      <div className="adm-scroll min-h-0 flex-1 overflow-y-auto">
        <AdminNav role={user.role} badges={{ "/dashboard-admin/contact": unread }} />
      </div>
      <div className="shrink-0 space-y-3 border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/[.06] p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-body-sm font-bold text-navy">{initials}</span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-body-sm font-semibold text-white">{user.name}</span>
            <span className="block truncate text-[11px] text-white/55">{roleLabel}</span>
          </span>
        </div>
        <a href="/" target="_blank" rel="noopener" className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-body-sm font-semibold text-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-navy">
          <Icon name="open_in_new" className="text-[18px]" />View website
        </a>
      </div>
    </>
  );

  const topbar = (
    <>
      <AdminCrumb />
      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <a href="/" target="_blank" rel="noopener" className="btn-accent !px-3 !py-2" title="Open the website in a new tab to review changes">
          <Icon name="open_in_new" className="text-[20px]" /><span className="hidden sm:inline">View Website</span>
        </a>
        <div className="hidden text-right md:block">
          <p className="text-title-md leading-tight text-navy">{user.name}</p>
          <p className="text-label-sm text-slate-text">{roleLabel}</p>
        </div>
        <form action={logoutAction}>
          <button className="btn-secondary !px-3 !py-2" aria-label="Sign out"><Icon name="logout" className="text-[20px]" /><span className="hidden sm:inline">Sign out</span></button>
        </form>
      </div>
    </>
  );

  return (
    <>
      <AdminShell sidebar={sidebar} topbar={topbar}>{children}</AdminShell>
      <Suspense fallback={null}><Toast /></Suspense>
      <IdleGuard />
    </>
  );
}
