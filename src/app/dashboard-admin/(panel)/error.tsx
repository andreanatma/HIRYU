"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="card mx-auto max-w-lg p-8 text-center">
      <h2 className="text-headline-md">Something went wrong</h2>
      <p className="mt-2 text-body-md text-on-surface-variant">The page failed to load. Check the database connection and try again.</p>
      <button onClick={reset} className="btn-primary mt-5">Try again</button>
    </div>
  );
}
