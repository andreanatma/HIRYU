"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./ui";

interface AdminBarProps {
  name?: string | null;
}

interface SectionMapping {
  path: string;
  target: string;
  label: string;
}

const SECTIONS: readonly SectionMapping[] = [
  { path: "/service", target: "/dashboard-admin/services", label: "Services" },
  { path: "/products", target: "/dashboard-admin/products", label: "Products" },
  { path: "/portfolio", target: "/dashboard-admin/portfolio", label: "Portfolio" },
  { path: "/gallery", target: "/dashboard-admin/gallery", label: "Gallery" },
  { path: "/about-us", target: "/dashboard-admin/our-team", label: "Our Team" },
  { path: "/blogs", target: "/dashboard-admin/blogs", label: "Blogs" },
  { path: "/contact", target: "/dashboard-admin/contact", label: "Contact Messages" },
];

/**
 * Floating bar yang hanya tampil untuk admin yang sedang login.
 * Mendukung prop `name` langsung dari Server Component (misal layout.tsx)
 * dan memiliki fallback fetch ke `/api/me` jika prop tidak dipassing.
 */
export function AdminBar({ name: initialName }: AdminBarProps = {}) {
  const path = usePathname();
  const [name, setName] = useState<string | null>(initialName ?? null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (initialName) {
      setName(initialName);
      return;
    }

    let alive = true;
    fetch("/api/me", { cache: "no-store", credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { name?: string } | null) => {
        if (alive) setName(d?.name ?? null);
      })
      .catch(() => undefined);

    return () => {
      alive = false;
    };
  }, [initialName]);

  if (!name) return null;

  const section = SECTIONS.find(
    (s) => path === s.path || path.startsWith(`${s.path}/`)
  );

  if (hidden) {
    return (
      <Link
        href="/dashboard-admin"
        aria-label="Back to Dashboard"
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[80] flex h-12 w-12 items-center justify-center rounded-full bg-accent text-navy shadow-lg transition-colors hover:bg-accent-hover"
      >
        <Icon name="dashboard" />
      </Link>
    );
  }

  return (
    <div
      role="region"
      aria-label="Admin bar"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[80] flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-navy py-1.5 pl-2 pr-1.5 text-white sm:gap-2 sm:py-2 sm:pl-4 sm:pr-2 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.4)]"
    >
      <span className="hidden items-center gap-1.5 text-label-md text-slate-300 md:flex">
        <Icon name="shield_person" className="text-[18px]" />
        Admin mode · {name}
      </span>

      {section && (
        <Link
          href={section.target}
          aria-label={`Manage ${section.label}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-2 text-label-md transition-colors hover:bg-white/20 sm:px-3"
        >
          <Icon name="edit" className="text-[16px]" />
          {/* HP: hanya ikon agar bar tidak melebihi lebar layar */}
          <span className="hidden sm:inline">Manage {section.label}</span>
        </Link>
      )}

      <Link
        href="/dashboard-admin"
        className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-label-md font-semibold text-navy transition-colors hover:bg-accent-hover sm:px-4"
      >
        <Icon name="arrow_back" className="text-[16px]" />
        <span className="sm:hidden">Dashboard</span>
        <span className="hidden sm:inline">Back to Dashboard</span>
      </Link>

      <button
        type="button"
        onClick={() => setHidden(true)}
        aria-label="Hide admin bar"
        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/10 sm:h-8 sm:w-8"
      >
        <Icon name="close" className="text-[18px]" />
      </button>
    </div>
  );
}