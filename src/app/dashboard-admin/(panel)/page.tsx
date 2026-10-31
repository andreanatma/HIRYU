import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatDate, truncate } from "@/lib/utils";
import { Icon, StatusBadge } from "@/components/ui";
import { CountUp } from "@/features/admin/count-up";

export const metadata = { title: "Overview" };

const QUICK = [
  ["services", "Service", "design_services"], ["product-types", "Product type", "category"], ["products", "Product", "inventory_2"],
  ["portfolio", "Portfolio project", "folder_special"], ["blogs", "Blog article", "article"],
] as const;

const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join("") || "?";
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default async function Overview() {
  const user = await requireUser();
  const since = new Date(Date.now() - 13 * 86_400_000);
  since.setHours(0, 0, 0, 0);
  const [services, productTypes, products, portfolio, gallery, team, blogs, brands, messages, admins, unread, recentMsgs, recentLogs, msgDates] = await Promise.all([
    prisma.service.count(), prisma.productType.count(), prisma.product.count(), prisma.portfolio.count(), prisma.gallery.count(),
    prisma.teamMember.count(), prisma.blog.count(), prisma.brand.count(), prisma.contactMessage.count(), prisma.user.count(),
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { user: { select: { name: true } } } }),
    prisma.contactMessage.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
  ]);

  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(since); d.setDate(d.getDate() + i); return d; });
  const key = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  const counts = days.map((d) => msgDates.filter((m) => key(m.createdAt) === key(d)).length);
  const max = Math.max(1, ...counts);
  const total = counts.reduce((a, b) => a + b, 0);
  const todayCount = counts[counts.length - 1] ?? 0;
  const dayLabel = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Jakarta" });
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
  const firstName = user.name.split(/\s+/)[0] || user.name;

  const stats = [
    ["Services", services, "design_services", "/dashboard-admin/services"],
    ["Product types", productTypes, "category", "/dashboard-admin/product-types"],
    ["Products", products, "inventory_2", "/dashboard-admin/products"],
    ["Portfolio", portfolio, "folder_special", "/dashboard-admin/portfolio"],
    ["Gallery images", gallery, "photo_library", "/dashboard-admin/gallery"],
    ["Blog posts", blogs, "article", "/dashboard-admin/blogs"],
    ["Brands", brands, "verified", "/dashboard-admin/brands"],
    ["Team members", team, "groups", "/dashboard-admin/our-team"],
    ["Messages", messages, "mail", "/dashboard-admin/contact"],
    ["Administrators", admins, "shield_person", "/dashboard-admin/users"],
  ] as const;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="adm-hero adm-in rounded-xl p-6 text-white sm:p-8" aria-labelledby="welcome-t">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-body-sm text-white/65">{today}</p>
            <h1 id="welcome-t" className="mt-1 text-headline-lg sm:text-headline-xl lg:text-[36px] lg:leading-[44px]">Welcome back, {firstName}</h1>
            <p className="mt-2 text-body-md text-white/75">
              {unread > 0 ? `${unread} unread message${unread === 1 ? "" : "s"} waiting in your inbox.` : "No unread messages. Pick up where you left off."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {unread > 0 && <Link href="/dashboard-admin/contact?status=UNREAD" className="btn-accent"><Icon name="mark_email_unread" className="text-[20px]" />Read messages</Link>}
            <Link href="/dashboard-admin/products/new" className="btn-outline-light"><Icon name="add" className="text-[20px]" />Add product</Link>
            <a href="/" target="_blank" rel="noopener" className="btn-outline-light"><Icon name="open_in_new" className="text-[20px]" />View website</a>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
        {stats.map(([label, value, icon, href], i) => (
          <Link key={href} href={href} className="adm-stat adm-in card group p-4 sm:p-5" style={delay(120 + i * 45)}>
            <div className="flex items-start justify-between gap-2">
              <span className="text-body-sm font-medium text-slate-text">{label}</span>
              <span className="adm-stat-ico flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-primary"><Icon name={icon} className="text-[20px]" /></span>
            </div>
            <p className="mt-3 text-[30px] font-bold leading-none tracking-tight text-navy tabular-nums"><CountUp value={value} /></p>
            {href.endsWith("/contact") && unread > 0 ? (
              <p className="mt-2 inline-flex items-center gap-1.5 text-body-sm font-semibold text-error">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error/60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-error" /></span>
                {unread} unread
              </p>
            ) : (
              <p className="mt-2 inline-flex items-center gap-1 text-body-sm font-medium text-primary">Manage<Icon name="arrow_forward" className="arrow-shift text-[16px]" /></p>
            )}
            <span className="accent-bar" />
          </Link>
        ))}
      </div>

      {/* Grafik + aksi cepat */}
      <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
        <section className="card adm-in p-5 sm:p-6 xl:col-span-2" style={delay(450)} aria-labelledby="chart-t">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="chart-t" className="text-title-lg text-navy">Messages in the last 14 days</h2>
              <p className="text-body-sm text-slate-text">{total} received, {todayCount} today</p>
            </div>
            <Link href="/dashboard-admin/contact" className="btn-secondary !px-3 !py-1.5 !text-body-sm">Open inbox</Link>
          </div>
          <div className="relative mt-8">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3].map((n) => <span key={n} className="border-t border-dashed border-line" />)}
            </div>
            <div className="relative flex h-48 items-end gap-1.5 sm:gap-2.5" role="list" aria-label={`Messages per day, total ${total}`}>
              {counts.map((c, i) => {
                const isToday = i === counts.length - 1;
                const h = c ? Math.max(8, (c / max) * 86) : 3;
                return (
                  <div key={i} role="listitem" aria-label={`${dayLabel(days[i])}: ${c} message${c === 1 ? "" : "s"}`} className="group relative flex h-full flex-1 flex-col items-center justify-end gap-1">
                    <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-navy px-2 py-1 text-label-md text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">{dayLabel(days[i])}</span>
                    <span className="text-label-sm tabular-nums text-slate-text">{c || ""}</span>
                    <div className="adm-bar w-full rounded-t-md" style={{ height: `${h}%`, ...delay(500 + i * 45), background: !c ? "#DCE3EC" : isToday ? "linear-gradient(180deg,#FFE27A,#FFD43B)" : "linear-gradient(180deg,#3B8BF0,#0866D9)" }} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex justify-between text-label-sm text-slate-text"><span>{formatDate(days[0])}</span><span className="font-semibold text-navy">Today</span></div>
        </section>

        <section className="card adm-in p-5 sm:p-6" style={delay(520)} aria-labelledby="sc-t">
          <h2 id="sc-t" className="text-title-lg text-navy">Create new content</h2>
          <p className="text-body-sm text-slate-text">Start a new entry for the website.</p>
          <div className="mt-4 flex flex-col gap-2">
            {QUICK.map(([k, l, i]) => (
              <Link key={k} href={`/dashboard-admin/${k}/new`} className="group flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-body-sm font-medium text-navy transition-all duration-300 hover:translate-x-1 hover:border-primary/40 hover:bg-brand-light">
                <span className="quick-ico flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-light text-primary"><Icon name={i} className="text-[18px]" /></span>
                {l}
                <Icon name="add" className="ml-auto text-outline transition-all duration-300 group-hover:rotate-90 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Pesan terbaru + aktivitas */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <section className="card adm-in p-5 sm:p-6" style={delay(580)} aria-labelledby="rm-t">
          <div className="mb-3 flex items-center justify-between"><h2 id="rm-t" className="text-title-lg text-navy">Latest messages</h2><Link href="/dashboard-admin/contact" className="text-title-md text-primary hover:underline">View all</Link></div>
          {recentMsgs.length === 0 ? <p className="py-8 text-center text-body-sm text-slate-text">No messages yet.</p> : (
            <ul className="-mx-2 space-y-1">
              {recentMsgs.map((m) => (
                <li key={m.id}>
                  <Link href={`/dashboard-admin/contact/${m.id}`} className="adm-item flex items-center gap-3 p-2">
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-title-md font-bold text-primary">
                      {initialsOf(m.name)}
                      {m.status === "UNREAD" && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-accent" aria-hidden="true" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-title-md text-navy ${m.status === "UNREAD" ? "" : "font-medium"}`}>{m.name}</p>
                      <p className="truncate text-body-sm text-slate-text">{truncate(m.message, 90)}</p>
                    </div>
                    <div className="shrink-0 text-right"><StatusBadge value={m.status} /><p className="mt-1 text-label-sm text-outline">{formatDate(m.createdAt, true)}</p></div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card adm-in p-5 sm:p-6" style={delay(640)} aria-labelledby="al-t">
          <div className="mb-4 flex items-center justify-between"><h2 id="al-t" className="text-title-lg text-navy">Administrator activity</h2><Link href="/dashboard-admin/activity-logs" className="text-title-md text-primary hover:underline">All logs</Link></div>
          {recentLogs.length === 0 ? <p className="py-8 text-center text-body-sm text-slate-text">No activity yet.</p> : (
            <ol className="ml-1.5 border-l-2 border-line">
              {recentLogs.map((l) => (
                <li key={l.id} className="group relative pb-5 pl-6 last:pb-0">
                  <span aria-hidden="true" className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-primary ring-4 ring-brand-light transition-all duration-300 group-hover:scale-125 group-hover:bg-accent group-hover:ring-accent/30" />
                  <p className="text-body-sm text-slate-text"><span className="text-title-md text-navy">{l.user?.name ?? "System"}</span> · {l.summary}</p>
                  <p className="text-label-sm text-outline">{formatDate(l.createdAt, true)}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
