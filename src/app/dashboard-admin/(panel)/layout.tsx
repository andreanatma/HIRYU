import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { logoutAction } from "@/features/auth-actions";
import { IdleGuard, Toast } from "@/components/client";
import { Icon } from "@/components/ui";
import { AdminNav } from "@/features/admin/admin-nav";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Hiryu Techno Admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="min-h-screen bg-mist">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col justify-between overflow-y-auto bg-navy text-inverse-on-surface lg:flex">
        <div>
          <Link href="/dashboard-admin" className="flex h-16 items-center gap-3 px-6">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-primary-container text-white"><Icon name="biotech" className="text-[20px]" /></span>
            <span><span className="block text-title-md font-bold leading-tight text-white">Hiryu Admin</span><span className="text-label-sm uppercase text-outline-variant">Content Management</span></span>
          </Link>
          <AdminNav role={user.role} />
        </div>
        <a href="/" target="_blank" rel="noopener" className="m-4 flex items-center gap-2 rounded bg-white/10 px-3 py-2.5 text-body-sm hover:bg-white/20"><Icon name="open_in_new" className="text-[18px]" />View website</a>
      </aside>
      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#DCE3EC] bg-white/90 px-4 backdrop-blur-xl lg:px-8">
          <details className="relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center rounded p-2 hover:bg-[#E8F1FF]" aria-label="Menu"><Icon name="menu" /></summary>
            <div className="absolute left-0 top-12 w-64 rounded-lg bg-navy p-2 shadow-xl"><AdminNav role={user.role} /></div>
          </details>
          <p className="hidden text-body-sm text-on-surface-variant lg:block">Administration panel</p>
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="/" target="_blank" rel="noopener" className="btn-accent !px-3 !py-2" title="Open the website in a new tab to review changes"><Icon name="open_in_new" className="text-[20px]" /><span className="hidden sm:inline">View Website</span></a>
            <div className="hidden text-right sm:block">
              <p className="text-title-md leading-tight">{user.name}</p>
              <p className="text-label-sm text-on-surface-variant">{user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}</p>
            </div>
            <form action={logoutAction}><button className="btn-secondary !px-3 !py-2" aria-label="Sign out"><Icon name="logout" className="text-[20px]" /><span className="hidden sm:inline">Sign out</span></button></form>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
      <Suspense fallback={null}><Toast /></Suspense>
      <IdleGuard />
    </div>
  );
}
