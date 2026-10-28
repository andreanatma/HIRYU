import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatDate, pageParam, str } from "@/lib/utils";
import { BoolBadge, EmptyState, Icon, MediaImg, Pagination, StatusBadge } from "@/components/ui";
import { BulkGalleryUpload, ConfirmButton } from "@/components/client";
import { deleteEntity } from "../crud-actions";
import { getModule, publicUrlFor, type ModuleKey } from "../modules";
import { EntityForm, type EntityValues } from "./entity-form";

const PER_PAGE = 10;
// Prisma delegates are reached dynamically ONLY through the allow-listed module definitions (getModule).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const del = (model: string): any => (prisma as any)[model];

export function PageHeader({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-headline-xl text-navy">{title}</h1>
        {desc && <p className="mt-1 text-body-md text-on-surface-variant">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export async function ModuleList({ moduleKey, searchParams }: { moduleKey: ModuleKey; searchParams: Record<string, string | string[] | undefined> }) {
  await requireUser();
  const m = getModule(moduleKey)!;
  const q = str(searchParams.q).trim().slice(0, 100);
  const status = str(searchParams.status);
  const page = pageParam(searchParams.page);
  const hasActive = m.fields.some((f) => f.name === "isActive");
  const where = {
    ...(q ? { OR: m.searchFields.map((f) => ({ [f]: { contains: q } })) } : {}),
    ...(hasActive && status === "active" ? { isActive: true } : hasActive && status === "inactive" ? { isActive: false } : {}),
    ...(m.key === "blogs" && (status === "DRAFT" || status === "PUBLISHED") ? { status } : {}),
  };
  const [total, rows] = await Promise.all([
    del(m.model).count({ where }),
    del(m.model).findMany({ where, orderBy: m.orderBy, skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const params: Record<string, string> = {};
  if (q) params.q = q;
  if (status) params.status = status;
  const hasFilter = m.key === "blogs" || hasActive;
  return (
    <>
      <PageHeader title={m.label} desc={`${total} record${total === 1 ? "" : "s"}.`} action={<Link href={`/dashboard-admin/${m.key}/new`} className="btn-accent"><Icon name="add" className="text-[20px]" />Add {m.singular}</Link>} />
      {m.key === "gallery" && <BulkGalleryUpload />}
      <form className="mb-4 flex flex-wrap gap-3" role="search">
        <div className="relative min-w-[220px] max-w-md flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3 top-2.5 text-outline" />
          <input name="q" defaultValue={q} className="input !pl-10" placeholder={`Search ${m.label.toLowerCase()}…`} aria-label="Search" />
        </div>
        {hasFilter && (
          <select name="status" defaultValue={status} className="input !w-44" aria-label="Filter by status">
            <option value="">All statuses</option>
            {m.key === "blogs" ? <><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option></> : <><option value="active">Active</option><option value="inactive">Inactive</option></>}
          </select>
        )}
        <button className="btn-secondary">Search</button>
        {(q || status) && <Link href={`/dashboard-admin/${m.key}`} className="btn-ghost">Reset</Link>}
      </form>
      <div className="card overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState icon="folder_open" title={q || status ? "No results" : `No ${m.label.toLowerCase()} yet`} text={q || status ? "Try different filters." : `Add your first ${m.singular}.`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="border-b border-line bg-mist text-label-md text-slate-text">
                <tr>{m.columns.map((c) => <th key={c.key} scope="col" className="px-4 py-3">{c.label}</th>)}<th scope="col" className="px-4 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {rows.map((r: Record<string, unknown>) => (
                  <tr key={String(r.id)} className="hover:bg-mist">
                    {m.columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 align-middle">
                        {c.kind === "image" ? <MediaImg id={r[c.key] as number | null} alt="" className="h-10 w-14 rounded" /> :
                         c.kind === "date" ? formatDate(r[c.key] as Date | null) :
                         c.kind === "status" ? <StatusBadge value={String(r[c.key])} /> :
                         c.kind === "bool" ? <BoolBadge value={Boolean(r[c.key])} on={c.key === "isActive" ? "Active" : "Yes"} off={c.key === "isActive" ? "Inactive" : "No"} /> :
                         <span className={c.key === m.nameField ? "text-title-md" : "text-on-surface-variant"}>{String(r[c.key] ?? "-")}</span>}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {publicUrlFor(m.key, r) ? (
                          <a href={publicUrlFor(m.key, r)!} target="_blank" rel="noopener" aria-label={`View ${String(r[m.nameField])} on the website`} title="View on website" className="rounded p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-primary"><Icon name="open_in_new" className="text-[20px]" /></a>
                        ) : (
                          <span title="Not visible on the website (draft or inactive)." className="rounded p-1.5 text-outline-variant"><Icon name="visibility_off" className="text-[20px]" /></span>
                        )}
                        <Link href={`/dashboard-admin/${m.key}/${r.id}`} aria-label={`Edit ${String(r[m.nameField])}`} className="rounded p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-primary"><Icon name="edit" className="text-[20px]" /></Link>
                        <ConfirmButton action={deleteEntity.bind(null, m.key, r.id as number)} title={String(r[m.nameField])} text={`Delete this ${m.singular}? This cannot be undone.`} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination page={page} pages={pages} basePath={`/dashboard-admin/${m.key}`} params={Object.keys(params).length ? params : undefined} />
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
    <div className="max-w-3xl">
      <PageHeader title={id ? `Edit ${m.singular}` : `Add ${m.singular}`} action={<div className="flex gap-2">{id !== null && (viewUrl ? <a href={viewUrl} target="_blank" rel="noopener" className="btn-secondary"><Icon name="open_in_new" className="text-[18px]" />View on website</a> : m.key === "blogs" ? <a href={`/blogs/${values.slug}`} target="_blank" rel="noopener" className="btn-secondary"><Icon name="visibility" className="text-[18px]" />Preview draft</a> : null)}<Link href={`/dashboard-admin/${m.key}`} className="btn-ghost"><Icon name="arrow_back" className="text-[18px]" />Back</Link></div>} />
      <EntityForm moduleKey={m.key} id={id} fields={m.fields} values={values} fileNames={fileNames} relationOptions={relationOptions} />
    </div>
  );
}
