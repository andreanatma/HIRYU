"use client";

import { DICT } from "@/lib/dictionary";

export default function PublicError({ reset }: { error: Error; reset: () => void }) {
  const t = DICT[document.documentElement.lang === "id" ? "id" : "en"];
  return <div role="alert" className="container-x py-24 text-center"><h1 className="text-headline-xl">{t.err_title}</h1><p className="mt-3 text-body-lg text-on-surface-variant">{t.err_text}</p><button onClick={reset} className="btn-primary mt-6">{t.err_retry}</button></div>;
}