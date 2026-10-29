"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./ui";

const SECTIONS: [string, string, string][] = [
  ["/service", "/dashboard-admin/services", "Services"],
  ["/products", "/dashboard-admin/products", "Products"],
  ["/portfolio", "/dashboard-admin/portfolio", "Portfolio"],
  ["/gallery", "/dashboard-admin/gallery", "Gallery"],
  ["/about-us", "/dashboard-admin/our-team", "Our Team"],
  ["/blogs", "/dashboard-admin/blogs", "Blogs"],
  ["/contact", "/dashboard-admin/contact", "Contact Messages"],
];

/**
 * Floating bar yang hanya tampil untuk admin yang sedang login.
 * Status login dicek ke /api/me (divalidasi di server) sehingga layout publik tidak perlu dinamis.
 */
export function AdminBar() {
  const path = usePathname();
  const [name, setName] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/me", { cache: "no-store", credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { name?: string } | null) => { if (alive) setName(d?.name ?? null); })
      .catch(() => undefined);
    return () => { alive = false; };
  }, []);

  if (!name) return null;

  const section = SECTIONS.find(([p]) => path === p || path.startsWith(p + "/"));

  if (hidden) {
    return (
      <Link href="/dashboard-admin" aria-label="Back to Dashboard" className="fixed bottom-4 right-4 z-[80] flex h-12 w-12 items-center justify-center rounded-full bg-accent text-navy shadow-lg hover:bg-accent-hover"><Icon name="dashboard" /></Link>
    );
  }
  return (
    <div role="region" aria-label="Admin bar" className="fixed bottom-4 left-1/2 z-[80] flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-navy py-2 pl-4 pr-2 text-white shadow-[0_10px_25px_-5px_rgba(15,23,42,0.4)]">
      <span className="hidden items-center gap-1.5 text-label-md text-slate-300 md:flex"><Icon name="shield_person" className="text-[18px]" />Admin mode · {name}</span>
      {section && <Link href={section[1]} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-label-md hover:bg-white/20"><Icon name="edit" className="text-[16px]" />Manage {section[2]}</Link>}
      <Link href="/dashboard-admin" className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-label-md font-semibold text-navy hover:bg-accent-hover"><Icon name="arrow_back" className="text-[16px]" />Back to Dashboard</Link>
      <button onClick={() => setHidden(true)} aria-label="Hide admin bar" className="rounded-full p-1.5 text-slate-300 hover:bg-white/10"><Icon name="close" className="text-[18px]" /></button>
    </div>
  );
}