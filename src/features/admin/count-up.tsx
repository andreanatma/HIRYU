"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Layout effect di browser agar angka tidak sempat berkedip sebelum animasi mulai; aman untuk SSR.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Angka yang menghitung naik dari 0. Server merender nilai akhir, jadi tetap benar tanpa JavaScript. */
export function CountUp({ value, duration = 900 }: { value: number; duration?: number }) {
  const [n, setN] = useState(value);
  const raf = useRef(0);

  useIsoLayoutEffect(() => {
    if (value === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }
    const start = performance.now();
    setN(0);
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return (
    <>
      <span aria-hidden="true">{n}</span>
      <span className="sr-only">{value}</span>
    </>
  );
}
