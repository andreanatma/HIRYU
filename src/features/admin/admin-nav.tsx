"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils";

type Item = readonly [href: string, label: string, icon: string, superOnly?: boolean];
const GROUPS: { title: string; items: Item[] }[] = [
  { title: "Overview", items: [["/dashboard-admin", "Dashboard", "dashboard"]] },
  { title: "Content Management", items: [
    ["/dashboard-admin/services", "Services", "design_services"],
    ["/dashboard-admin/product-types", "Product Types", "category"],
    ["/dashboard-admin/products", "Products", "inventory_2"],
    ["/dashboard-admin/portfolio", "Portfolio", "folder_special"],
    ["/dashboard-admin/gallery", "Gallery", "photo_library"],
    ["/dashboard-admin/blogs", "Blogs", "article"],
    ["/dashboard-admin/about-us", "About Us", "info"],
    ["/dashboard-admin/our-team", "Our Team", "groups"],
    ["/dashboard-admin/brands", "Brands", "verified"],
    ["/dashboard-admin/clients", "Clients", "business_center"],
  ] },
  { title: "Communication", items: [["/dashboard-admin/contact", "Contact Messages", "mail"]] },
  { title: "Administration", items: [
    ["/dashboard-admin/users", "User Management", "manage_accounts", true],
    ["/dashboard-admin/activity-logs", "Activity Logs", "history"],
    ["/dashboard-admin/media", "Media Management", "perm_media"],
    ["/dashboard-admin/seo", "SEO Settings", "troubleshoot"],
    ["/dashboard-admin/settings", "General Settings", "settings"],
  ] },
];

export function AdminNav({ role }: { role: "SUPER_ADMIN" | "ADMIN" }) {
  const path = usePathname();
  return (
    <nav aria-label="Admin navigation" className="flex flex-col gap-1 px-3 pb-4">
      {GROUPS.map((g) => (
        <div key={g.title} className="flex flex-col gap-1">
          <p className="px-3 pb-1 pt-4 text-label-sm uppercase tracking-wider text-slate-400">{g.title}</p>
          {g.items.filter((i) => !i[3] || role === "SUPER_ADMIN").map(([href, label, icon]) => {
            const active = href === "/dashboard-admin" ? path === href : path.startsWith(href);
            return (
              <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-3 rounded px-3 py-2 text-body-sm transition-colors", active ? "bg-primary text-white" : "text-inverse-on-surface hover:bg-white/10")}>
                <Icon name={icon} className="text-[20px]" />{label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
