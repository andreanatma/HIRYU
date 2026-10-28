import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SignupForm } from "@/features/admin/forms";

export const metadata: Metadata = { title: "Super Admin Setup", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const me = await getSession();
  if (me) redirect(me.role === "SUPER_ADMIN" ? "/dashboard-admin/users/new" : "/dashboard-admin");
  const count = await prisma.user.count();
  const enabled = count === 0 && !!process.env.BOOTSTRAP_TOKEN;
  return (
    <main className="flex min-h-screen items-center justify-center bg-mist p-6">
      <div className="card w-full max-w-lg p-8">
        <h1 className="text-headline-xl">First Super Admin setup</h1>
        {enabled ? (
          <>
            <p className="mb-6 mt-1 text-body-sm text-on-surface-variant">This page is active only while no user exists and requires the BOOTSTRAP_TOKEN from the server.</p>
            <SignupForm />
          </>
        ) : (
          <div className="mt-4 space-y-3 text-body-md text-on-surface-variant">
            <p>{count > 0 ? "Public registration is closed. A Super Admin can add administrators from User Management after signing in." : "BOOTSTRAP_TOKEN is not set on the server, so registration is disabled. Set it or run `npm run admin:create`."}</p>
            <Link href="/dashboard-admin/login" className="btn-primary">Go to sign in</Link>
          </div>
        )}
      </div>
    </main>
  );
}
