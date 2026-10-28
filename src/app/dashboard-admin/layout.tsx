import type { Metadata } from "next";

// All admin routes (including login and signup) are noindex/nofollow. This is an indexing policy, NOT access control;
// access is enforced by server-side session checks.
export const metadata: Metadata = { robots: { index: false, follow: false, nocache: true } };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
