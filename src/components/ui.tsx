import Link from "next/link";
import { cn } from "@/lib/utils";

export function Icon({ name, className, fill }: { name: string; className?: string; fill?: boolean }) {
  return (
    <span aria-hidden="true" className={cn("icon", className)} style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}>
      {name}
    </span>
  );
}

export function MediaImg({ id, alt, className, icon = "image" }: { id?: number | null; alt: string; className?: string; icon?: string }) {
  if (!id) {
    return (
      <div className={cn("flex items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-high text-primary/40", className)} role="img" aria-label={alt}>
        <Icon name={icon} className="text-[40px]" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/media/${id}`} alt={alt} loading="lazy" className={cn("object-cover", className)} />;
}

export function EmptyState({ icon = "inbox", title, text, action }: { icon?: string; title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
      <span className="mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-primary"><Icon name={icon} className="text-[34px]" /></span>
      <h3 className="text-title-lg">{title}</h3>
      {text && <p className="max-w-md text-body-md text-on-surface-variant">{text}</p>}
      {action}
    </div>
  );
}

export function Pagination({ page, pages, basePath, params, prev = "Previous", next = "Next", className }: { page: number; pages: number; basePath: string; params?: Record<string, string>; prev?: string; next?: string; className?: string }) {
  if (pages <= 1) return null;
  const cur = Math.min(Math.max(1, page), pages);
  const href = (p: number) => {
    const q = new URLSearchParams({ ...(params ?? {}), page: String(p) });
    return `${basePath}?${q.toString()}`;
  };
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - cur) <= 1);
  const edge = "btn-secondary !gap-1 !px-2.5 !py-1.5 sm:!px-3";
  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1.5 pt-6", className)}>
      {/* Previous / Next selalu tampil (nonaktif di ujung) supaya posisi tombol tidak bergeser. Di HP hanya ikon. */}
      {cur > 1 ? (
        <Link className={edge} href={href(cur - 1)} rel="prev" aria-label={prev}><Icon name="chevron_left" className="text-[18px]" /><span className="hidden sm:inline">{prev}</span></Link>
      ) : (
        <span className={cn(edge, "pointer-events-none opacity-40")} aria-disabled="true"><Icon name="chevron_left" className="text-[18px]" /><span className="hidden sm:inline">{prev}</span></span>
      )}

      {/* HP: ringkas "2 / 8". Tablet ke atas: deretan nomor halaman. */}
      <span className="min-w-[4.5rem] px-1 text-center text-body-sm font-semibold tabular-nums text-navy sm:hidden" aria-current="page">{cur} / {pages}</span>
      <div className="hidden items-center gap-1.5 sm:flex">
        {nums.map((n, i) => (
          <span key={n} className="flex items-center gap-1.5">
            {i > 0 && n - nums[i - 1] > 1 && <span className="text-outline">…</span>}
            <Link href={href(n)} aria-label={`Page ${n}`} aria-current={n === cur ? "page" : undefined} className={cn("flex h-9 w-9 items-center justify-center rounded text-title-md", n === cur ? "bg-primary-container text-white" : "border border-[#DCE3EC] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-brand-light")}>{n}</Link>
          </span>
        ))}
      </div>

      {cur < pages ? (
        <Link className={edge} href={href(cur + 1)} rel="next" aria-label={next}><span className="hidden sm:inline">{next}</span><Icon name="chevron_right" className="text-[18px]" /></Link>
      ) : (
        <span className={cn(edge, "pointer-events-none opacity-40")} aria-disabled="true"><span className="hidden sm:inline">{next}</span><Icon name="chevron_right" className="text-[18px]" /></span>
      )}
    </nav>
  );
}

export function StatusBadge({ value }: { value: string }) {
  const map: Record<string, [string, string]> = {
    PUBLISHED: ["badge-success", "Published"], DRAFT: ["badge-warn", "Draft"],
    UNREAD: ["badge-warn", "Unread"], READ: ["badge-info", "Read"], REPLIED: ["badge-success", "Replied"],
    SUPER_ADMIN: ["badge-info", "Super Admin"], ADMIN: ["badge-neutral", "Admin"],
  };
  const [c, l] = map[value] ?? ["badge-neutral", value];
  return <span className={c}>{l}</span>;
}

/** Safe text renderer: paragraphs, "## " subheadings and "- " bullet lists, without raw HTML (XSS-safe). */
export function SafeText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-5 text-body-lg text-on-surface-variant">
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) return <h2 key={i} className="pt-4 text-headline-lg text-on-surface">{b.slice(3)}</h2>;
        const lines = b.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) return <ul key={i} className="list-disc space-y-2 pl-6">{lines.map((l, j) => <li key={j}>{l.trim().slice(2)}</li>)}</ul>;
        return <p key={i} className="whitespace-pre-line">{b}</p>;
      })}
    </div>
  );
}

export function BoolBadge({ value, on = "Yes", off = "No" }: { value: boolean; on?: string; off?: string }) {
  return value ? <span className="badge-success">{on}</span> : <span className="badge-neutral">{off}</span>;
}