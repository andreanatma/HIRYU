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
  const toggle = (id: number) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <aside aria-label="Products" className="h-fit border border-line bg-white p-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <h2 className="border-b border-line pb-4 text-headline-md font-bold text-navy">
        <Link href="/products" className="hover:text-primary">Products</Link>
      </h2>
      <ul className="mt-2">
        {groups.map((g) => {
          const isOpen = open.has(g.id);
          const typeActive = g.slug === activeType;
          return (
            <li key={g.id} className="border-b border-line last:border-b-0">
              <div className="flex items-center justify-between gap-2 py-3">
                <Link
                  href={`/products?type=${g.slug}`}
                  aria-current={typeActive ? "page" : undefined}
                  className={cn("text-body-md hover:text-primary", typeActive ? "font-semibold text-primary" : "text-navy")}
                >
                  {g.name}
                </Link>
                <button
                  type="button"
                  onClick={() => toggle(g.id)}
                  aria-expanded={isOpen}
                  aria-label={`Expand or collapse ${g.name}`}
                  className="shrink-0 rounded p-1 text-on-surface-variant hover:bg-mist hover:text-primary"
                >
                  <Icon name={isOpen ? "remove" : "add"} className="text-[18px]" />
                </button>
              </div>
              {isOpen && (
                <ul className="acc-panel mb-3 ml-3 max-h-72 overflow-y-auto">
                  {g.products.length === 0 && <li className="py-2 text-body-sm text-outline">No products yet.</li>}
                  {g.products.map((p) => (
                    <li key={p.slug} className="border-b border-dashed border-line last:border-b-0">
                      <Link
                        href={`/products/${p.slug}`}
                        aria-current={p.slug === activeProduct ? "page" : undefined}
                        className={cn("block py-2 text-body-sm hover:text-primary", p.slug === activeProduct ? "font-semibold text-primary" : "text-on-surface-variant")}
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}