import Link from "next/link";
import { Icon } from "./ui";
import { cn } from "@/lib/utils";

/** Breadcrumb seragam untuk semua halaman detail: Home › Menu › (Kategori) › Judul */
export function DetailBreadcrumb({ trail, current }: { trail: { label: string; href: string }[]; current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="hero-in mb-5 flex flex-wrap items-center gap-2 text-label-md text-on-surface-variant" style={{ "--d": "0ms" } as React.CSSProperties}>
      <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-primary"><Icon name="home" className="text-[16px]" />Home</Link>
      {trail.map((x) => (
        <span key={x.href} className="inline-flex items-center gap-2">
          <Icon name="chevron_right" className="text-[14px]" />
          <Link href={x.href} className="transition-colors hover:text-primary">{x.label}</Link>
        </span>
      ))}
      <Icon name="chevron_right" className="text-[14px]" />
      <span className="line-clamp-1 text-on-surface">{current}</span>
    </nav>
  );
}

/** Kartu putih utama halaman detail (gaya sama dengan detail produk). */
export function DetailCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <article className={cn("rounded-xl border border-white/70 bg-white p-5 shadow-[0_26px_50px_-28px_rgba(7,29,51,0.45)] sm:p-7", className)}>
      {children}
    </article>
  );
}

/** Badge kategori kecil di atas judul. */
export function DetailBadge({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-label-md uppercase tracking-wider text-primary">
      <Icon name={icon} className="text-[14px]" />{children}
    </span>
  );
}

/** Kartu fakta mini (Brand, Client, Date, ...). */
export function FactGrid({ facts }: { facts: [icon: string, label: string, value: string | null | undefined][] }) {
  const rows = facts.filter(([, , v]) => v);
  if (rows.length === 0) return null;
  return (
    <dl className="mt-5 grid grid-cols-1 gap-3">
      {rows.map(([icon, k, v]) => (
        <div key={k} className="group flex items-start gap-3 rounded-lg border border-line bg-mist/60 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-md">
          <span className="quick-ico flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary"><Icon name={icon} className="text-[20px]" /></span>
          <div className="min-w-0">
            <dt className="text-label-sm uppercase text-slate-text">{k}</dt>
            <dd className="break-words text-title-md text-navy">{v}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

/** Judul seksi dengan garis aksen kuning (dipakai di "Related ...", galeri, dll). */
export function SectionHead({ eyebrow, title, linkHref, linkLabel }: { eyebrow?: string; title: string; linkHref?: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <span className="text-label-md uppercase tracking-wider text-primary">{eyebrow}</span>}
        <h2 className="mt-2 text-headline-xl text-navy">{title}</h2>
        <div className="mt-3 h-1 w-14 rounded bg-accent" />
      </div>
      {linkHref && linkLabel && (
        <Link href={linkHref} className="inline-flex items-center gap-1 text-title-md text-primary transition-colors hover:text-brand-hover">
          {linkLabel}<Icon name="arrow_forward" className="arrow-shift text-[18px]" />
        </Link>
      )}
    </div>
  );
}