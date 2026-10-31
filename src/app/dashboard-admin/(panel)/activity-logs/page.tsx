import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, pageParam, str } from "@/lib/utils";
import { EmptyState, Icon, Pagination } from "@/components/ui";
import { PageHeader } from "@/features/admin/module-pages";

export const metadata = { title: "Activity Logs" };
const PER = 25;
const ACTIONS = ["LOGIN", "LOGIN_FAILED", "LOGOUT", "CREATE", "UPDATE", "DELETE", "UPLOAD", "ROLE_CHANGE", "PASSWORD", "SETTINGS"];

export default async function Logs({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireUser();
  const sp = await searchParams;
  const action = ACTIONS.includes(str(sp.action)) ? str(sp.action) : "";
  const page = pageParam(sp.page);
  const where = action ? { action } : {};
  const [total, rows] = await Promise.all([
    prisma.activityLog.count({ where }),
    prisma.activityLog.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER, take: PER, include: { user: { select: { name: true, email: true } } } }),
  ]);
  return (
    <>
      <PageHeader title="Activity Logs" desc="Read-only records created by the server. They cannot be edited or deleted from the application." />
      <form className="card adm-in mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-end" role="search">
        <div className="sm:w-64">
          <label htmlFor="f-action" className="mb-1.5 block text-body-sm font-semibold text-navy">Action</label>
          <select id="f-action" name="action" defaultValue={action} className="input"><option value="">All actions</option>{ACTIONS.map((a) => <option key={a}>{a}</option>)}</select>
        </div>
        <div className="flex gap-2"><button className="btn-primary flex-1 sm:flex-none"><Icon name="filter_alt" className="text-[20px]" />Filter</button>{action && <Link href="/dashboard-admin/activity-logs" className="btn-ghost">Reset</Link>}</div>
      </form>
      <div className="card overflow-hidden">
        {rows.length === 0 ? <EmptyState icon="history" title="No activity yet" /> : (
          <div className="overflow-x-auto"><table className="w-full text-left text-body-sm">
            <thead className="border-b border-[#DCE3EC] bg-[#F2F5F9] text-label-md text-[#526174]"><tr><th className="px-4 py-3">Time</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Module</th><th className="px-4 py-3">Summary</th><th className="px-4 py-3">IP</th></tr></thead>
            <tbody className="divide-y divide-[#E8F1FF]">{rows.map((l) => (
              <tr key={l.id} className="adm-row"><td className="whitespace-nowrap px-4 py-3 tabular-nums">{formatDate(l.createdAt, true)}</td><td className="px-4 py-3">{l.user?.name ?? "-"}</td><td className="px-4 py-3"><span className="badge-neutral">{l.action}</span></td><td className="px-4 py-3">{l.entity}{l.entityId ? ` #${l.entityId}` : ""}</td><td className="px-4 py-3 text-on-surface-variant">{l.summary}</td><td className="px-4 py-3 tabular-nums text-outline">{l.ipAddress}</td></tr>
            ))}</tbody></table></div>
        )}
      </div>
      <Pagination page={page} pages={Math.max(1, Math.ceil(total / PER))} basePath="/dashboard-admin/activity-logs" params={action ? { action } : undefined} />
    </>
  );
}