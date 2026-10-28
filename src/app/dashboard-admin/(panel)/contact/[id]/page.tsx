import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Icon, StatusBadge } from "@/components/ui";
import { ConfirmButton } from "@/components/client";
import { PageHeader } from "@/features/admin/module-pages";
import { deleteMessage, setMessageStatus } from "@/features/admin-actions";

export const metadata = { title: "Message details" };

export default async function MessageDetail({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  let m = await prisma.contactMessage.findUnique({ where: { id } });
  if (!m) notFound();
  if (m.status === "UNREAD") m = await prisma.contactMessage.update({ where: { id }, data: { status: "READ" } });
  void me;
  return (
    <div className="max-w-3xl">
      <PageHeader title="Message details" action={<Link href="/dashboard-admin/contact" className="btn-ghost"><Icon name="arrow_back" className="text-[18px]" />Back</Link>} />
      <article className="card p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div><dt className="text-label-md text-slate-text">Name</dt><dd className="text-title-md">{m.name}</dd></div>
          <div><dt className="text-label-md text-slate-text">Email</dt><dd><a className="text-primary hover:underline" href={`mailto:${m.email}`}>{m.email}</a></dd></div>
          <div><dt className="text-label-md text-[#526174]">Received</dt><dd>{formatDate(m.createdAt, true)}</dd></div>
          <div><dt className="text-label-md text-slate-text">Status</dt><dd><StatusBadge value={m.status} /></dd></div>
          <div><dt className="text-label-md text-slate-text">Company</dt><dd>{m.company ?? "—"}</dd></div>
          <div><dt className="text-label-md text-slate-text">Subject</dt><dd className="text-title-md">{m.subject ?? "—"}</dd></div>
          <div className="sm:col-span-2"><dt className="text-label-md text-slate-text">Email notification</dt><dd>{m.emailStatus === "SENT" ? "Sent to the company inbox" : m.emailStatus === "FAILED" ? "Sending failed (message is saved here)" : "Not configured (message is saved here)"}</dd></div>
        </dl>
        <h2 className="mb-2 mt-6 text-label-md text-slate-text">Message</h2>
        <p className="whitespace-pre-wrap rounded bg-[#F2F5F9] p-4 text-body-md">{m.message}</p>
        <p className="mt-4 text-body-sm text-on-surface-variant">The system does not send automatic replies. Use the email button below, then mark the message as “Replied” after you respond.</p>
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#E8F1FF] pt-5">
          <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject ?? "your message"}`)}`} className="btn-accent"><Icon name="reply" className="text-[20px]" />Reply by email</a>
          {m.status !== "REPLIED" && <form action={setMessageStatus.bind(null, m.id, "REPLIED")}><button className="btn-secondary">Mark as replied</button></form>}
          {m.status !== "UNREAD" && <form action={setMessageStatus.bind(null, m.id, "UNREAD")}><button className="btn-ghost">Mark as unread</button></form>}
          <div className="ml-auto"><ConfirmButton variant="button" action={deleteMessage.bind(null, m.id)} title={`Message from ${m.name}`} text="This message will be permanently deleted." /></div>
        </div>
      </article>
    </div>
  );
}
