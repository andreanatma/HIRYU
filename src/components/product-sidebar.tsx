"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./ui";
import { cn } from "@/lib/utils";

export type SidebarGroup = {
  id: number;
  slug: string;
  name: string;
  count: number;
  products: { slug: string; name: string }[];
};

export function ProductSidebar({ groups, activeType, activeProduct }: {
  groups: SidebarGroup[];
  activeType?: string | null;
  activeProduct?: string | null;
}) {
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(groups.filter((g) => g.slug === activeType || g.products.some((p) => p.slug === activeProduct)).map((g) => g.id)),
  );
  const [mobileOpen, setMobileOpen] = useState(false); // di layar kecil daftar kategori dilipat agar halaman tidak terlalu panjang
  const toggle = (id: number) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <aside aria-label="Products" className="h-fit overflow-hidden rounded-xl border border-line bg-white shadow-sm lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      {/* Header: tautan "Products" + tombol lipat (mobile) */}
      <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-navy to-navy-2 px-5 py-4 text-white">
        <Link href="/products" className="group/h inline-flex items-center gap-2 text-headline-md font-bold text-white">
          <Icon name="category" className="text-[22px] text-accent transition-transform duration-300 group-hover/h:rotate-12" />
          Products
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="product-groups"
          className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-label-md text-white transition-colors hover:bg-white/20 lg:hidden"
        >
          Categories<Icon name="expand_more" className={cn("text-[18px] transition-transform duration-300", mobileOpen && "rotate-180")} />
        </button>
      </div>

      <ul id="product-groups" className={cn("p-2", mobileOpen ? "block" : "hidden lg:block")}>
        {groups.map((g) => {
          const isOpen = open.has(g.id);
          const typeActive = g.slug === activeType;
          return (
            <li key={g.id} className="rounded-lg">
              <div className={cn("group/row flex items-center justify-between gap-1 rounded-lg border-l-4 transition-all duration-300", typeActive ? "border-accent bg-primary-light" : "border-transparent hover:bg-mist")}>
                <Link
                  href={`/products?type=${g.slug}`}
                  aria-current={typeActive ? "page" : undefined}
                  className={cn("flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-body-md transition-transform duration-300 group-hover/row:translate-x-0.5", typeActive ? "font-semibold text-primary" : "text-navy hover:text-primary")}
                >
                  <span className="truncate">{g.name}</span>
                  <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-label-sm text-on-surface-variant shadow-sm">{g.count}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => toggle(g.id)}
                  aria-expanded={isOpen}
                  aria-label={`Expand or collapse ${g.name}`}
                  className="mr-1 shrink-0 rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-white hover:text-primary"
                >
                  <Icon name="expand_more" className={cn("text-[20px] transition-transform duration-300", isOpen && "rotate-180")} />
                </button>
              </div>
              {isOpen && (
                <ul className="acc-panel mb-2 ml-5 mt-1 max-h-72 overflow-y-auto border-l border-dashed border-line pl-2">
                  {g.products.length === 0 && <li className="py-2 pl-2 text-body-sm text-outline">No products yet.</li>}
                  {g.products.map((p) => {
                    const on = p.slug === activeProduct;
                    return (
                      <li key={p.slug}>
                        <Link
                          href={`/products/${p.slug}`}
                          aria-current={on ? "page" : undefined}
                          className={cn("group/item flex items-center gap-2 rounded-md px-2 py-1.5 text-body-sm transition-all duration-200 hover:translate-x-1 hover:bg-mist hover:text-primary", on ? "font-semibold text-primary" : "text-on-surface-variant")}
                        >
                          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200 group-hover/item:scale-125 group-hover/item:bg-accent", on ? "bg-accent" : "bg-line")} />
                          <span className="truncate">{p.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}