"use client";

export default function PublicError({ reset }: { error: Error; reset: () => void }) {
  return <div role="alert" className="container-x py-24 text-center"><h1 className="text-headline-xl">Something went wrong</h1><p className="mt-3 text-body-lg text-on-surface-variant">The page failed to load. Please try again.</p><button onClick={reset} className="btn-primary mt-6">Try again</button></div>;
}
