"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";

type HeroSliderProps = {
  companyName: string;
  title: string;
  subtitle: string;
  exploreText: string;
  aboutText: string;
  images?: string[]; // daftar gambar dari Settings (hero_images)
};

const SLIDE_MS = 6000;

// Nama file harus SAMA PERSIS dengan di /public/hero (Linux case-sensitive: hero-1.JPG ≠ hero-1.jpg).
const DEFAULT_IMAGES = 
["/hero/hero-1.JPG", 
  "/hero/hero-2.JPG", 
  "/hero/hero-3.JPG"];

export function HeroSlider({ companyName, title, subtitle, exploreText, aboutText, images }: HeroSliderProps) {
  const slides = images && images.length > 0 ? images : DEFAULT_IMAGES;
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0); // dinaikkan agar timer & progress bar sinkron setelah pause / klik manual
  const touch = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback(
    (i: number) => {
      setIndex(((i % count) + count) % count);
      setCycle((c) => c + 1);
    },
    [count],
  );

  // Auto-slide (berhenti saat hover/fokus/geser, dan untuk pengguna reduced-motion)
  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearTimeout(id);
  }, [index, paused, cycle, count]);

  const pause = () => setPaused(true);
  const resume = () => {
    setPaused(false);
    setCycle((c) => c + 1);
  };

  return (
    <section
      data-nav-hero
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative isolate -mt-20 flex min-h-[640px] w-full items-center overflow-hidden bg-navy text-white md:min-h-[700px] lg:min-h-[780px]"
      // Jeda saat hover HANYA untuk mouse. Di layar sentuh, "mouseenter" ikut terpicu saat ditap dan tidak pernah
      // "leave" sehingga slider berhenti selamanya setelah pengunjung menyentuh hero.
      onPointerEnter={(e) => e.pointerType === "mouse" && pause()}
      onPointerLeave={(e) => e.pointerType === "mouse" && resume()}
      // Fokus keyboard saja yang menjeda (tap pada tombol indikator di Android memberi fokus yang "menempel").
      onFocus={(e) => e.target.matches(":focus-visible") && pause()}
      onBlur={resume}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchCancel={() => {
        touch.current = null;
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        if (!start) return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        // Geser horizontal saja; gestur scroll vertikal yang sedikit miring tidak boleh mengganti slide.
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      {/* ===== Latar gambar (crossfade + zoom pelan) ===== */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {slides.map((img, i) => (
          <div
            key={`${img}-${i}`}
            className={`absolute inset-0 overflow-hidden transition-opacity duration-[1200ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt=""
              decoding="async"
              loading={i === 0 ? "eager" : "lazy"}
              {...(i === 0 ? { fetchPriority: "high" as const } : {})}
              className="ken-burns h-full w-full object-cover object-center"
            />
          </div>
        ))}

        {/* Overlay terarah: teks kiri tetap terbaca */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/20 md:via-navy/70" />
        {/* Glow biru + pola grid halus */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_85%_20%,rgba(8,102,217,0.35),transparent_70%)]" />
        <div className="bg-grid-faint absolute inset-0 opacity-40" />
        {/* Blob melayang */}
        <div className="float-slow absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="float-slow absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-accent/15 blur-3xl [animation-delay:-3s]" />

        {/* Peleburan hero → section berikutnya (warna akhir = bg-mist, sama dengan section di bawahnya) */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent via-mist/40 to-mist md:h-60" />
      </div>

      {/* ===== Konten ===== */}
      <div className="container-x relative z-10 w-full pb-32 pt-[8.5rem] md:pb-40 md:pt-[10rem]">
        <div className="flex max-w-3xl flex-col gap-6">
          <span
            className="hero-in inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-label-sm font-bold uppercase tracking-widest text-white/90 backdrop-blur md:text-label-md"
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {companyName}
          </span>

          <h1
            className="hero-in whitespace-pre-line break-words text-display-lg-mobile font-extrabold tracking-tight text-white md:text-display-md lg:text-display-lg"
            style={{ "--d": "120ms" } as React.CSSProperties}
          >
            {title}
          </h1>

          <div className="hero-in flex items-start gap-4" style={{ "--d": "260ms" } as React.CSSProperties}>
            <div className="mt-3 h-1 w-12 shrink-0 rounded bg-accent md:w-16" />
            <p className="max-w-xl whitespace-pre-line text-body-lg leading-relaxed text-white/90">{subtitle}</p>
          </div>

          <div className="hero-in mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4" style={{ "--d": "400ms" } as React.CSSProperties}>
            <Link
              href="/products"
              className="btn-accent group w-full !px-7 !py-3.5 !font-bold shadow-lg sm:w-auto shadow-accent/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30"
            >
              {exploreText}
              <Icon name="arrow_forward" className="text-[18px] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about-us"
              className="btn-outline-light w-full !border-white/30 !px-7 !py-3.5 !font-bold backdrop-blur hover:!-translate-y-0.5 hover:!border-white hover:!bg-white/15 sm:w-auto"
            >
              {aboutText}
            </Link>
          </div>

          {/* Indikator berprogres */}
          {count > 1 && (
            <div className="hero-in mt-2 flex items-center gap-2.5" style={{ "--d": "520ms" } as React.CSSProperties}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className="group relative h-6 w-10 sm:w-12"
                >
                  <span className="absolute inset-x-0 top-1/2 block h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/25 transition-all group-hover:h-2 group-hover:bg-white/40">
                    {i === index && (
                      <span
                        key={`${index}-${cycle}`}
                        className="progress-fill block h-full origin-left rounded-full bg-accent"
                        style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}