import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, pageParam, str, truncate } from "@/lib/utils";
import { EmptyState, Icon, Pagination, StatusBadge } from "@/components/ui";
import { PageHeader } from "@/features/admin/module-pages";

export const metadata = { title: "Contact Messages" };
const PER = 15;

export default async function ContactList({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireUser();
  const sp = await searchParams;
  const q = str(sp.q).trim().slice(0, 100);
  const status = ["UNREAD", "READ", "REPLIED"].includes(str(sp.status)) ? str(sp.status) : "";
  const from = str(sp.from), to = str(sp.to);
  const page = pageParam(sp.page);
  const dFrom = from && !isNaN(+new Date(from)) ? new Date(from) : null;
  const dTo = to && !isNaN(+new Date(to)) ? new Date(new Date(to).getTime() + 86_399_000) : null;
  const where = {
    ...(q ? { OR: [{ name: { contains: q } }, { company: { contains: q } }, { subject: { contains: q } }, { email: { contains: q } }] } : {}),
    ...(status ? { status: status as "UNREAD" | "READ" | "REPLIED" } : {}),
    ...(dFrom || dTo ? { createdAt: { ...(dFrom ? { gte: dFrom } : {}), ...(dTo ? { lte: dTo } : {}) } } : {}),
  };
  const [total, rows] = await Promise.all([
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER, take: PER }),
  ]);
  const params: Record<string, string> = {};
  if (q) params.q = q; if (status) params.status = status; if (from) params.from = from; if (to) params.to = to;
  return (
    <>
      <PageHeader title="Contact Messages" desc={`${total} message(s) match the filters.`} />
      <form className="card mb-4 grid gap-3 p-4 md:grid-cols-[1fr_160px_150px_150px_auto]" role="search">
        <input name="q" defaultValue={q} className="input" placeholder="Search name, company, subject or email…" aria-label="Search" />
        <select name="status" defaultValue={status} className="input" aria-label="Status"><option value="">All statuses</option><option value="UNREAD">Unread</option><option value="READ">Read</option><option value="REPLIED">Replied</option></select>
        <input type="date" name="from" defaultValue={from} className="input" aria-label="From date" />
        <input type="date" name="to" defaultValue={to} className="input" aria-label="To date" />
        <div className="flex gap-2"><button className="btn-primary">Apply</button>{Object.keys(params).length > 0 && <Link href="/dashboard-admin/contact" className="btn-ghost">Reset</Link>}</div>
      </form>
      <div className="card overflow-hidden">
        {rows.length === 0 ? <EmptyState icon="mail" title="No messages" text="Messages from the contact form will appear here." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="border-b border-[#DCE3EC] bg-[#F2F5F9] text-label-md text-[#526174]"><tr><th className="px-4 py-3">Sender</th><th className="px-4 py-3">Subject / message</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Received</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-[#E8F1FF]">
                {rows.map((m) => (
                  <tr key={m.id} className="hover:bg-[#F2F5F9]">
                    <td className="px-4 py-3"><p className={m.status === "UNREAD" ? "text-title-md" : ""}>{m.name}</p><p className="text-on-surface-variant">{m.email}{m.company ? ` · ${m.company}` : ""}</p></td>
                    <td className="max-w-xs px-4 py-3 text-on-surface-variant"><p className="text-navy">{m.subject ?? "—"}</p>{truncate(m.message, 80)}</td>
                    <td className="px-4 py-3"><StatusBadge value={m.status} /></td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">{formatDate(m.createdAt, true)}</td>
                    <td className="px-4 py-3 text-right"><Link href={`/dashboard-admin/contact/${m.id}`} className="btn-secondary !px-3 !py-1.5"><Icon name="visibility" className="text-[18px]" />Open</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination page={page} pages={Math.max(1, Math.ceil(total / PER))} basePath="/dashboard-admin/contact" params={params} />
    </>
  );
}
