import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { cn, formatDate, pageParam, str } from "@/lib/utils";
import { adminLimit } from "@/lib/page-limits";
import { BoolBadge, EmptyState, Icon, MediaImg, Pagination, StatusBadge } from "@/components/ui";
import { BulkGalleryUpload, ConfirmButton } from "@/components/client";
import { deleteEntity } from "../crud-actions";
import { getModule, publicUrlFor, type ColumnDef, type ModuleKey } from "../modules";
import { EntityForm, type EntityValues } from "./entity-form";

// Prisma delegates are reached dynamically ONLY through the allow-listed module definitions (getModule).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const del = (model: string): any => (prisma as any)[model];

export function PageHeader({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="adm-in mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-headline-lg text-navy sm:text-headline-xl">{title}</h1>
        <span aria-hidden="true" className="mt-2 block h-1 w-12 rounded-full bg-accent" />
        {desc && <p className="mt-3 text-body-md text-slate-text">{desc}</p>}
      </div>
      {action && <div className="shrink-0 [&>*]:w-full sm:[&>*]:w-auto">{action}</div>}
    </div>
  );
}

export async function ModuleList({ moduleKey, searchParams }: { moduleKey: ModuleKey; searchParams: Record<string, string | string[] | undefined> }) {
  await requireUser();
  const m = getModule(moduleKey)!;
  const q = str(searchParams.q).trim().slice(0, 100);
  const status = str(searchParams.status);
  const hasActive = m.fields.some((f) => f.name === "isActive");
  const where = {
    ...(q ? { OR: m.searchFields.map((f) => ({ [f]: { contains: q } })) } : {}),
    ...(hasActive && status === "active" ? { isActive: true } : hasActive && status === "inactive" ? { isActive: false } : {}),
    ...(m.key === "blogs" && (status === "DRAFT" || status === "PUBLISHED") ? { status } : {}),
  };
  // Batas baris per halaman diatur per menu di src/lib/page-limits.ts; pengguna bisa memilih lewat ?per=
  const { per, def, options } = adminLimit(m.key, str(searchParams.per));
  const total: number = await del(m.model).count({ where });
  const pages = Math.max(1, Math.ceil(total / per));
  const page = Math.min(pageParam(searchParams.page), pages); // ?page=999 otomatis diarahkan ke halaman terakhir
  const rows = await del(m.model).findMany({ where, orderBy: m.orderBy, skip: (page - 1) * per, take: per });
  // Kolom bertipe "relation": ambil label (mis. nama Product Type) untuk semua baris sekaligus, tanpa query per baris.
  const labels: Record<string, Map<number, string>> = {};
  await Promise.all(m.columns.filter((c) => c.kind === "relation" && c.relation).map(async (c) => {
    const rel = c.relation!;
    const ids = [...new Set(rows.map((r: Record<string, unknown>) => r[c.key]).filter((v: unknown): v is number => typeof v === "number"))] as number[];
    const found: Record<string, unknown>[] = ids.length ? await del(rel.model).findMany({ where: { id: { in: ids } } }) : [];
    labels[c.key] = new Map(found.map((o) => [o.id as number, String(o[rel.labelField])] as [number, string]));
  }));
  const params: Record<string, string> = {};
  if (q) params.q = q;
  if (status) params.status = status;
  if (per !== def) params.per = String(per);
  const from = total === 0 ? 0 : (page - 1) * per + 1;
  const to = Math.min(page * per, total);
  const perHref = (n: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (status) sp.set("status", status);
    if (n !== def) sp.set("per", String(n));
    const qs = sp.toString();
    return `/dashboard-admin/${m.key}${qs ? `?${qs}` : ""}`;
  };
  const hasFilter = m.key === "blogs" || hasActive;
  const hasQuery = Boolean(q || status);
  const infoCols = m.columns.filter((c) => c.kind !== "image" && c.key !== m.nameField);
  const imageCol = m.columns.find((c) => c.kind === "image");

  const cell = (c: ColumnDef, r: Record<string, unknown>) =>
    c.kind === "image" ? (
      <span className="block h-10 w-14 overflow-hidden rounded-md"><MediaImg id={r[c.key] as number | null} alt="" className="h-full w-full transition-transform duration-500 group-hover/row:scale-110" /></span>
    ) : c.kind === "relation" ? (
      labels[c.key]?.get(r[c.key] as number)
        ? <span className="inline-flex max-w-[180px] items-center truncate rounded-md bg-brand-light px-2 py-1 text-label-md font-semibold text-primary" title={labels[c.key].get(r[c.key] as number)}>{labels[c.key].get(r[c.key] as number)}</span>
        : <span className="text-outline">—</span>
    ) : c.kind === "order" ? (
      <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md bg-mist px-2 text-label-md font-bold tabular-nums text-navy ring-1 ring-line" title="Display order">{String(r[c.key] ?? 0)}</span>
    ) : c.kind === "date" ? formatDate(r[c.key] as Date | null) :
      c.kind === "status" ? <StatusBadge value={String(r[c.key])} /> :
      c.kind === "bool" ? <BoolBadge value={Boolean(r[c.key])} on={c.key === "isActive" ? "Active" : "Yes"} off={c.key === "isActive" ? "Inactive" : "No"} /> :
      <span className={c.key === m.nameField ? "text-title-md text-navy" : "text-slate-text"}>{String(r[c.key] ?? "-")}</span>;

  const actions = (r: Record<string, unknown>) => (
    <div className="flex justify-end gap-0.5">
      {publicUrlFor(m.key, r) ? (
        <a href={publicUrlFor(m.key, r)!} target="_blank" rel="noopener" aria-label={`View ${String(r[m.nameField])} on the website`} title="View on website" className="adm-icon-btn"><Icon name="open_in_new" className="text-[20px]" /></a>
      ) : (
        <span title="Not visible on the website (draft or inactive)." className="inline-flex h-9 w-9 items-center justify-center text-outline-variant"><Icon name="visibility_off" className="text-[20px]" /></span>
      )}
      <Link href={`/dashboard-admin/${m.key}/${r.id}`} aria-label={`Edit ${String(r[m.nameField])}`} title="Edit" className="adm-icon-btn"><Icon name="edit" className="text-[20px]" /></Link>
      <ConfirmButton action={deleteEntity.bind(null, m.key, r.id as number)} title={String(r[m.nameField])} text={`Delete this ${m.singular}? This cannot be undone.`} />
    </div>
  );

  return (
    <>
      <PageHeader title={m.label} desc={`${total} record${total === 1 ? "" : "s"}.`} action={<Link href={`/dashboard-admin/${m.key}/new`} className="btn-accent"><Icon name="add" className="text-[20px]" />Add {m.singular}</Link>} />
      {m.key === "gallery" && <BulkGalleryUpload />}
      <form className="card adm-in mb-4 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4" style={{ "--d": "60ms" } as React.CSSProperties} role="search">
        <div className="relative min-w-0 flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3 top-2.5 text-outline" />
          <input name="q" defaultValue={q} className="input !pl-10" placeholder={`Search ${m.label.toLowerCase()}…`} aria-label="Search" />
        </div>
        {hasFilter && (
          <select name="status" defaultValue={status} className="input sm:!w-44" aria-label="Filter by status">
            <option value="">All statuses</option>
            {m.key === "blogs" ? <><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option></> : <><option value="active">Active</option><option value="inactive">Inactive</option></>}
          </select>
        )}
        <div className="flex gap-2">
          <button className="btn-primary flex-1 sm:flex-none"><Icon name="search" className="text-[20px]" />Search</button>
          {hasQuery && <Link href={`/dashboard-admin/${m.key}`} className="btn-ghost">Reset</Link>}
        </div>
      </form>

      <div className="card adm-in overflow-hidden" style={{ "--d": "120ms" } as React.CSSProperties}>
        {rows.length === 0 ? (
          <EmptyState icon="folder_open" title={hasQuery ? "No results" : `No ${m.label.toLowerCase()} yet`} text={hasQuery ? "Try different filters." : `Add your first ${m.singular}.`} />
        ) : (
          <>
            {/* Desktop / tablet: tabel */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-body-sm">
                <thead className="border-b border-line bg-mist text-label-md text-slate-text">
                  <tr>{m.columns.map((c) => <th key={c.key} scope="col" className="px-4 py-3 font-semibold">{c.label}</th>)}<th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {rows.map((r: Record<string, unknown>) => (
                    <tr key={String(r.id)} className="adm-row group/row">
                      {m.columns.map((c) => <td key={c.key} className="px-4 py-3 align-middle">{cell(c, r)}</td>)}
                      <td className="px-4 py-3">{actions(r)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: kartu */}
            <ul className="divide-y divide-surface-container md:hidden">
              {rows.map((r: Record<string, unknown>) => (
                <li key={String(r.id)} className="p-4">
                  <div className="flex gap-3">
                    {imageCol && <span className="block h-16 w-20 shrink-0 overflow-hidden rounded-lg"><MediaImg id={r[imageCol.key] as number | null} alt="" className="h-full w-full" /></span>}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-title-md text-navy">{String(r[m.nameField] ?? "-")}</p>
                      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-body-sm">
                        {infoCols.map((c) => (
                          <div key={c.key} className="min-w-0"><dt className="text-label-sm text-outline">{c.label}</dt><dd className="mt-0.5 truncate">{cell(c, r)}</dd></div>
                        ))}
                      </dl>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-surface-container pt-2">{actions(r)}</div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {total > 0 && (
        <div className="adm-in mt-3 flex flex-col items-center gap-1 lg:mt-4 lg:flex-row lg:justify-between lg:gap-4" style={{ "--d": "160ms" } as React.CSSProperties}>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-body-sm text-slate-text">
            <span>Showing <b className="font-semibold text-navy">{from}–{to}</b> of <b className="font-semibold text-navy">{total}</b></span>
            {total > options[0] && (
              <span className="inline-flex items-center gap-1.5" role="group" aria-label="Rows per page">
                <span>Rows:</span>
                {options.map((n) => (
                  <Link key={n} href={perHref(n)} aria-current={n === per ? "true" : undefined} className={cn("inline-flex h-7 min-w-[2rem] items-center justify-center rounded-md px-2 text-label-md font-semibold tabular-nums transition-all duration-200", n === per ? "bg-navy text-white" : "border border-line bg-white text-navy hover:-translate-y-0.5 hover:border-primary/40 hover:bg-brand-light")}>{n}</Link>
                ))}
              </span>
            )}
          </div>
          <Pagination className="!pt-2 lg:!pt-0" page={page} pages={pages} basePath={`/dashboard-admin/${m.key}`} params={Object.keys(params).length ? params : undefined} />
        </div>
      )}
    </>
  );
}

export async function ModuleForm({ moduleKey, id }: { moduleKey: ModuleKey; id: number | null }) {
  await requireUser();
  const m = getModule(moduleKey)!;
  let values: EntityValues = {};
  let viewUrl: string | null = null;
  const fileNames: Record<string, string> = {};
  const relationOptions: Record<string, { value: string; label: string }[]> = {};

  for (const f of m.fields) {
    if (f.type === "relation" && f.relation) {
      const opts = await del(f.relation.model).findMany({ orderBy: [{ displayOrder: "asc" }, { id: "asc" }] });
      relationOptions[f.name] = opts.map((o: Record<string, unknown>) => ({ value: String(o.id), label: `${String(o[f.relation!.labelField])}${o.isActive === false ? " (inactive)" : ""}` }));
    }
  }

  if (id !== null) {
    const row = await del(m.model).findUnique({ where: { id } });
    if (!row) notFound();
    viewUrl = publicUrlFor(m.key, row);
    for (const f of m.fields) {
      const v = row[f.name];
      if (f.type === "images") continue;
      values[f.name] = f.type === "date" ? (v ? new Date(v).toISOString().slice(0, 10) : "") : f.type === "boolean" ? Boolean(v) : v ?? "";
    }
    if (m.multiImage) {
      const kids = await del(m.multiImage.model).findMany({ where: { [m.multiImage.fk]: id }, orderBy: { displayOrder: "asc" } });
      values[m.multiImage.field] = kids.map((k: Record<string, number>) => k[m.multiImage!.media]);
    }
    const ids = m.mediaFields.map((k) => row[k]).filter(Boolean) as number[];
    if (ids.length) {
      const files = await prisma.mediaFile.findMany({ where: { id: { in: ids } } });
      for (const k of m.mediaFields) { const f = files.find((x) => x.id === row[k]); if (f) fileNames[k] = f.originalName; }
    }
  } else {
    for (const f of m.fields) if (f.def !== undefined) values[f.name] = f.def;
  }
  return (
    <div className="max-w-4xl">
      <PageHeader title={id ? `Edit ${m.singular}` : `Add ${m.singular}`} action={<div className="flex gap-2">{id !== null && (viewUrl ? <a href={viewUrl} target="_blank" rel="noopener" className="btn-secondary"><Icon name="open_in_new" className="text-[18px]" />View on website</a> : m.key === "blogs" ? <a href={`/blogs/${values.slug}`} target="_blank" rel="noopener" className="btn-secondary"><Icon name="visibility" className="text-[18px]" />Preview draft</a> : null)}<Link href={`/dashboard-admin/${m.key}`} className="btn-ghost"><Icon name="arrow_back" className="text-[18px]" />Back</Link></div>} />
      <EntityForm moduleKey={m.key} id={id} fields={m.fields} values={values} fileNames={fileNames} relationOptions={relationOptions} />
    </div>
  );
}