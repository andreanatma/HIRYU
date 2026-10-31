"use client";

import { Icon } from "@/components/ui";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="card adm-in mx-auto max-w-lg p-8 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error-container text-error"><Icon name="error" fill className="text-[30px]" /></span>
      <h2 className="mt-4 text-headline-md text-navy">Something went wrong</h2>
      <p className="mt-2 text-body-md text-slate-text">The page failed to load. Check the database connection and try again.</p>
      <button onClick={reset} className="btn-primary mt-6"><Icon name="refresh" className="text-[20px]" />Try again</button>
    </div>
  );
}
