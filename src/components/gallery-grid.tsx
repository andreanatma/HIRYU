"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./ui";
import { Reveal } from "./public/reveal";
import { T, fmt } from "@/lib/dictionary";

type Item = { id: number; imageId: number };

/**
 * Galeri bergaya "bento" seperti section Gallery di homepage:
 * foto besar (2×2) berselang-seling dengan foto kecil, hover zoom + ikon zoom_in,
 * lalu lightbox (keyboard, swipe di HP, penghitung foto).
 */
export function GalleryGrid({ items }: { items: Item[] }) {
  const [i, setI] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const n = items.length;

  const go = (dir: 1 | -1) => { setReady(false); setI((v) => (v === null ? v : (v + dir + n) % n)); };
  const open = (idx: number) => { setReady(false); setI(idx); };

  useEffect(() => {
    if (i === null) return;
    closeRef.current?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setI(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i === null, n]);

  // Preload foto di sebelahnya agar next/prev terasa instan
  useEffect(() => {
    if (i === null || n < 2) return;
    for (const j of [(i + 1) % n, (i - 1 + n) % n]) {
      const img = new Image();
      img.src = `/media/${items[j].imageId}`;
    }
  }, [i, items, n]);

  const cur = i === null ? null : items[i];
  const alt = (k: number) => `Hiryu Techno ${T.photo} ${k}`;
  // Pola bento: setiap 9 foto, foto pertama dibuat besar (2×2). 4 + 8 = 12 sel = 3 baris penuh di 4 kolom.
  const big = (idx: number) => n >= 3 && idx % 9 === 0;

  return (
    <>
      <ul className="grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[11rem] md:grid-cols-4 md:gap-4 lg:auto-rows-[13rem]">
        {items.map((it, idx) => (
          <li key={it.id} className={big(idx) ? "col-span-2 row-span-2" : ""}>
            <Reveal delay={(idx % 4) * 80} className="h-full">
              <button
                type="button"
                onClick={() => open(idx)}
                aria-label={fmt(T.lb_open, { n: idx + 1, total: n })}
                className="group relative block h-full w-full overflow-hidden rounded-xl bg-mist shadow-sm transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 motion-safe:hover:-translate-y-1 hover:shadow-xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/media/${it.imageId}`}
                  alt={alt(idx + 1)}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-navy/0 transition-colors duration-300 group-hover:bg-navy/45 group-focus-visible:bg-navy/45">
                  <span className="flex h-12 w-12 scale-50 items-center justify-center rounded-full bg-accent text-navy opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                    <Icon name="zoom_in" className="text-[26px]" />
                  </span>
                </div>
              </button>
            </Reveal>
          </li>
        ))}
      </ul>

      {cur && i !== null && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-navy/95 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setI(null)}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current === null || n < 2) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={fmt(T.lb_dialog, { n: i + 1, total: n })}
            className="reveal-in relative flex max-h-[92vh] w-full max-w-5xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={cur.imageId}
              ref={(el) => { if (el?.complete) setReady(true); }}
              onLoad={() => setReady(true)}
              src={`/media/${cur.imageId}`}
              alt={alt(i + 1)}
              decoding="async"
              className={`max-h-[84vh] w-auto max-w-full rounded-xl object-contain shadow-2xl transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
            />

            <button
              ref={closeRef}
              type="button"
              onClick={() => setI(null)}
              aria-label={T.lb_close}
              className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg transition-all duration-300 hover:rotate-90 hover:bg-accent"
            >
              <Icon name="close" />
            </button>

            {n > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={T.lb_prev}
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg transition-all duration-300 hover:-translate-x-0.5 hover:bg-accent sm:h-12 sm:w-12"
                >
                  <Icon name="chevron_left" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={T.lb_next}
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg transition-all duration-300 hover:translate-x-0.5 hover:bg-accent sm:h-12 sm:w-12"
                >
                  <Icon name="chevron_right" />
                </button>
              </>
            )}

            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-navy/70 px-3 py-1 text-label-md font-semibold text-white backdrop-blur">
              {i + 1} / {n}
            </span>
          </div>
        </div>
      )}
    </>
  );
}