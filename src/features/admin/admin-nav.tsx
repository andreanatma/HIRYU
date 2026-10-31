"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui";

type Item = readonly [href: string, label: string, icon: string, superOnly?: boolean];
const GROUPS: { title: string; items: Item[] }[] = [
  { title: "Overview", items: [["/dashboard-admin", "Dashboard", "dashboard"]] },
  { title: "Content management", items: [
    ["/dashboard-admin/services", "Services", "design_services"],
    ["/dashboard-admin/product-types", "Product Types", "category"],
    ["/dashboard-admin/products", "Products", "inventory_2"],
    ["/dashboard-admin/portfolio", "Portfolio", "folder_special"],
    ["/dashboard-admin/gallery", "Gallery", "photo_library"],
    ["/dashboard-admin/blogs", "Blogs", "article"],
    ["/dashboard-admin/our-team", "Our Team", "groups"],
    ["/dashboard-admin/brands", "Brands", "verified"],
  ] },
  { title: "Communication", items: [["/dashboard-admin/contact", "Contact Messages", "mail"]] },
  { title: "Administration", items: [
    ["/dashboard-admin/users", "User Management", "manage_accounts", true],
    ["/dashboard-admin/activity-logs", "Activity Logs", "history"],
    ["/dashboard-admin/settings", "General Settings", "settings"],
  ] },
];

/** `badges` memetakan href menu ke angka kecil (mis. pesan belum dibaca). */
export function AdminNav({ role, badges = {} }: { role: "SUPER_ADMIN" | "ADMIN"; badges?: Record<string, number> }) {
  const path = usePathname();
  return (
    <nav aria-label="Admin navigation" className="flex flex-col gap-0.5 px-3 pb-4">
      {GROUPS.map((g) => {
        const items = g.items.filter((i) => !i[3] || role === "SUPER_ADMIN");
        if (items.length === 0) return null;
        return (
          <div key={g.title} className="flex flex-col gap-0.5">
            <p className="px-3 pb-1 pt-5 text-[11px] font-semibold tracking-wide text-white/40">{g.title}</p>
            {items.map(([href, label, icon]) => {
              const active = href === "/dashboard-admin" ? path === href : path === href || path.startsWith(`${href}/`);
              const badge = badges[href] ?? 0;
              return (
                <Link key={href} href={href} aria-current={active ? "page" : undefined} className="adm-nav-link">
                  <span className="adm-nav-ico"><Icon name={icon} className="text-[19px]" /></span>
                  <span className="truncate">{label}</span>
                  {badge > 0 && (
                    <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-navy" aria-label={`${badge} unread`}>
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
