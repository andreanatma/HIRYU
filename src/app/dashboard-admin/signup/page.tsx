import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Icon } from "@/components/ui";
import { AuthShell } from "@/features/admin/auth-shell";
import { SignupForm } from "@/features/admin/forms";

export const metadata: Metadata = { title: "Super Admin Setup", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const me = await getSession();
  if (me) redirect(me.role === "SUPER_ADMIN" ? "/dashboard-admin/users/new" : "/dashboard-admin");
  const count = await prisma.user.count();
  const enabled = count === 0 && !!process.env.BOOTSTRAP_TOKEN;
  return (
    <AuthShell
      eyebrow="First-time setup"
      heading="Create the first Super Admin"
      text="One-time setup for a brand-new installation. Once an account exists, this page closes automatically."
      points={[
        { icon: "badge", title: "1. Your details", text: "Name, email, and a strong password.", anim: "ico-tilt" },
        { icon: "rocket_launch", title: "2. Start managing", text: "Sign in and add other administrators.", anim: "ico-fly" },
      ]}
    >
      {enabled ? (
        <>
          <div className="auth-rise" style={{ "--d": "120ms" } as React.CSSProperties}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-label-sm uppercase tracking-widest text-primary">
              <span className="icon text-[14px]" aria-hidden="true">shield_person</span>
              Super Admin setup
            </span>
            <h1 className="mt-4 text-headline-xl text-navy">First Super Admin setup</h1>
            <p className="mb-6 mt-1 text-body-sm text-on-surface-variant">This page is active only while no user exists and requires the BOOTSTRAP_TOKEN from the server.</p>
          </div>
          <SignupForm />
        </>
      ) : (
        <div className="auth-rise py-4" style={{ "--d": "200ms" } as React.CSSProperties}>
          <span className="ico-trigger inline-flex">
            <span className="ico-box flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
              <Icon name="lock" fill className="ico-anim ico-tilt text-[32px]" />
            </span>
          </span>
          <h1 className="mt-5 text-headline-xl text-navy">Registration is closed</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            {count > 0
              ? "Public registration is closed. A Super Admin can add administrators from User Management after signing in."
              : "BOOTSTRAP_TOKEN is not set on the server, so registration is disabled. Set it or run `npm run admin:create`."}
          </p>
          <Link href="/dashboard-admin/login" className="auth-btn shine group mt-6 !w-auto !px-7">
            Go to sign in
            <Icon name="arrow_forward" className="text-[20px] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
