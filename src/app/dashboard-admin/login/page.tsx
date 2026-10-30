import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession, IDLE_MINUTES } from "@/lib/auth";
import { AuthShell } from "@/features/admin/auth-shell";
import { AuthAlert } from "@/features/admin/auth-ui";
import { LoginForm } from "@/features/admin/forms";

export const metadata: Metadata = { title: "Admin Sign In", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const NOTES: Record<string, { tone: "info" | "success"; text: string }> = {
  expired: { tone: "info", text: `Your session ended due to ${IDLE_MINUTES} minutes of inactivity, or you are not signed in. Please sign in again.` },
  logout: { tone: "success", text: "You have been signed out." },
  created: { tone: "success", text: "Super Admin created. Please sign in." },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  if (await getSession()) redirect("/dashboard-admin");
  const { reason } = await searchParams;
  const note = reason ? NOTES[reason] : undefined;
  return (
    <AuthShell
      eyebrow="Administration portal"
      heading="Manage your website with confidence"
      text="Update content, read contact messages, and manage users in one secure place."
      points={[
        { icon: "dashboard_customize", title: "Content management", text: "Products, portfolio, blogs, and more.", anim: "ico-tilt" },
        { icon: "history", title: "Full audit trail", text: "Every action is recorded for accountability.", anim: "ico-spin" },
        { icon: "verified_user", title: "Secure sessions", text: "Server-side validation on every request.", anim: "ico-pulse" },
      ]}
      footnote={`Sessions end automatically after ${IDLE_MINUTES} minutes of inactivity.`}
    >
      <div className="auth-rise" style={{ "--d": "120ms" } as React.CSSProperties}>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-label-sm uppercase tracking-widest text-primary">
          <span className="icon text-[14px]" aria-hidden="true">admin_panel_settings</span>
          Admin access
        </span>
        <h1 className="mt-4 text-headline-xl text-navy">Administrator sign in</h1>
        <p className="mb-6 mt-1 text-body-sm text-on-surface-variant">Use the account provided by a Super Admin.</p>
      </div>
      {note && (
        <div className="auth-rise mb-5" style={{ "--d": "260ms" } as React.CSSProperties}>
          <AuthAlert tone={note.tone}>{note.text}</AuthAlert>
        </div>
      )}
      <LoginForm />
    </AuthShell>
  );
}
