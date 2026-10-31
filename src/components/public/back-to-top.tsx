"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";

/**
 * Tombol panah ke atas (ikon saja), melayang di pojok kanan bawah.
 * - Muncul setelah halaman di-scroll ±300px.
 * - Bila admin sedang login, tombol digeser ke kiri supaya berdampingan dengan
 *   tombol bulat shortcut Dashboard (h-12 w-12, right-4) milik AdminBar.
 */
export function BackToTop({ beside = false }: { beside?: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={show ? 0 : -1}
      className={[
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] z-[80] flex h-12 w-12 items-center justify-center rounded-full",
        "border border-white/15 bg-navy text-white shadow-lg transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-navy active:scale-95",
        beside ? "right-[4.75rem]" : "right-4",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      ].join(" ")}
    >
      <Icon name="arrow_upward" className="text-[22px]" />
    </button>
  );
}