import Link from "next/link";
import { cookies } from "next/headers";
import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Icon, StatusBadge } from "@/components/ui";
import { ConfirmButton } from "@/components/client";
import { PageHeader } from "@/features/admin/module-pages";
import { deleteUser, resetUserPassword } from "@/features/admin-actions";

export const metadata = { title: "Users" };

export default async function Users() {
  const me = await requireSuperAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  const flash = (await cookies()).get("apex_flash_pw")?.value; // shown once; the cookie expires after 60 seconds
  const [flashEmail, flashPw] = flash ? flash.split("|") : [];
  return (
    <>
      <PageHeader title="User Management" desc="Manage administrator accounts and roles." action={<Link href="/dashboard-admin/users/new" className="btn-accent"><Icon name="person_add" className="text-[20px]" />Add administrator</Link>} />
      {flashPw && (
        <div role="status" className="mb-4 rounded border border-accent bg-[#FEF3C7] p-4 text-body-sm text-[#92400E]">
          Temporary password for <strong>{flashEmail}</strong>: <code className="rounded bg-white px-2 py-0.5 text-navy">{flashPw}</code>. Copy it now — it will not be shown again. All sessions of that user were terminated.
        </div>
      )}
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-body-sm">
          <thead className="border-b border-[#DCE3EC] bg-[#F2F5F9] text-label-md text-[#526174]"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Last login</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-[#E8F1FF]">{users.map((u) => (
            <tr key={u.id} className="adm-row">
              <td className="px-4 py-3"><p className="text-title-md">{u.name}{u.id === me.id && <span className="ml-2 text-body-sm font-normal text-outline">(You)</span>}</p><p className="text-on-surface-variant">{u.email}</p></td>
              <td className="px-4 py-3"><StatusBadge value={u.role} /></td>
              <td className="px-4 py-3">{u.isActive ? <span className="badge-success">Active</span> : <span className="badge-warn">Inactive</span>}</td>
              <td className="px-4 py-3 tabular-nums">{formatDate(u.lastLoginAt, true)}</td>
              <td className="px-4 py-3"><div className="flex justify-end gap-1">
                <Link href={`/dashboard-admin/users/${u.id}`} aria-label={`Edit ${u.name}`} className="adm-icon-btn"><Icon name="edit" className="text-[20px]" /></Link>
                <ConfirmButton label="Reset password" icon="lock_reset" action={resetUserPassword.bind(null, u.id)} title={`Reset password of ${u.name}`} text="A temporary random password will be generated and all sessions of this user will be terminated." />
                {u.id !== me.id && <ConfirmButton action={deleteUser.bind(null, u.id)} title={u.name} text="This account will be permanently deleted. Its activity history is kept without the user name." />}
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}
