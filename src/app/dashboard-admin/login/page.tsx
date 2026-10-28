import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { Icon } from "@/components/ui";
import { LoginForm } from "@/features/admin/forms";

export const metadata: Metadata = { title: "Admin Sign In", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const NOTES: Record<string, string> = { expired: "Your session ended due to 60 minutes of inactivity, or you are not signed in. Please sign in again.", logout: "You have been signed out.", created: "Super Admin created. Please sign in." };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  if (await getSession()) redirect("/dashboard-admin");
  const { reason } = await searchParams;
  const note = reason ? NOTES[reason] : undefined;
  return (
    <main className="flex min-h-screen items-center justify-center bg-mist p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-xl border border-[#DCE3EC] bg-white shadow-[0_20px_25px_-5px_rgba(15,23,42,0.1)] lg:grid-cols-5">
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-[#0B132B] via-navy to-[#1E293B] p-8 text-white lg:col-span-2 lg:flex">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container"><Icon name="shield_person" /></span><span className="text-title-lg font-bold">PT Hiryu Techno Indonesia</span></div>
          <div><h2 className="text-headline-lg">Administration portal</h2><p className="mt-2 text-body-sm text-slate-300">Manage website content, contact messages, and users. Every action is recorded in the audit trail.</p></div>
          <p className="text-label-md text-slate-400">Sessions end automatically after 60 minutes of inactivity.</p>
        </div>
        <div className="p-8 lg:col-span-3 lg:p-10">
          <h1 className="text-headline-xl">Administrator sign in</h1>
          <p className="mb-6 mt-1 text-body-sm text-on-surface-variant">Use the account provided by a Super Admin.</p>
          {note && <div role="status" className="mb-4 rounded border border-primary-fixed-dim bg-primary-fixed px-4 py-3 text-body-sm text-brand-hover">{note}</div>}
          <LoginForm />
          <Link href="/" className="mt-6 inline-flex items-center gap-1 text-body-sm text-on-surface-variant hover:text-navy"><Icon name="arrow_back" className="text-[16px]" />Back to website</Link>
        </div>
      </div>
    </main>
  );
}
