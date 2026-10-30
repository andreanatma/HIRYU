"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-reveal ringan (IntersectionObserver).
 * - Konten tetap terlihat saat SSR / tanpa JS (disembunyikan baru setelah mount, hanya bila di bawah layar).
 * - Dilewati otomatis untuk pengguna "reduced motion".
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** ms, untuk efek berurutan (stagger) */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return; // sudah terlihat

    el.classList.add("reveal-hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.remove("reveal-hidden");
        el.classList.add("reveal-in");
        io.disconnect();
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}>
      {children}
    </div>
  );
}