import Link from "next/link";
import { Icon } from "./ui";
import { Reveal } from "./public/reveal";

// Gradasi "eased" (banyak titik henti, bukan 2-3 titik) supaya peralihan tidak terlihat berundak / bergaris.
const NAVY = "7,29,51";
const stops = (alphas: [number, number][]) => alphas.map(([pos, a]) => `rgba(${NAVY},${a}) ${pos}%`).join(", ");

/**
 * Overlay kiri → kanan dengan kontur MELENGKUNG (radial berbentuk elips yang berpusat di sisi kiri):
 * navy pekat di belakang teks, lalu memudar mulus mengikuti lengkung sampai foto terlihat jelas di kanan.
 */
const CURVED_FADE_X = `radial-gradient(ellipse 100% 140% at 0% 45%, ${stops([[0, 1], [38, 1], [44, 0.82], [50, 0.58], [57, 0.34], [64, 0.16], [72, 0.05], [82, 0], [100, 0]])})`;
/** Penggelap tipis di atas agar navbar transparan tetap terbaca. */
const FADE_TOP = `linear-gradient(180deg, ${stops([[0, 0.6], [35, 0.32], [70, 0.1], [100, 0]])})`;

/** Gradient mask: tepi kiri foto menghilang halus sehingga tidak ada garis batas foto. Bagian foto lainnya 100% jelas. */
const MASK_X = "linear-gradient(90deg, transparent 0%, #000 22%)";
/** Gradasi tipis di dasar hero: foto larut perlahan ke warna section berikutnya (di atas lengkungan). */
const bottomSoft = (rgb: string) => `linear-gradient(180deg, rgba(${rgb},0) 0%, rgba(${rgb},0.16) 40%, rgba(${rgb},0.42) 85%, rgba(${rgb},0.7) 100%)`;
/** Bayangan teks halus agar tetap terbaca bila bagian foto yang terang berada di belakang teks. */
const SHADOW = "[text-shadow:0_2px_14px_rgba(7,29,51,0.6)]";
const mask = (v: string): React.CSSProperties => ({ WebkitMaskImage: v, maskImage: v });

/**
 * Hero halaman dalam. Gaya "Curved Overlay with Gradient Masking" (foto di sisi kanan):
 *   1) Overlay kiri → kanan berkontur lengkung: navy pekat di kiri (tempat teks) lalu memudar ke foto di kanan.
 *   2) Gradient mask pada foto: tepi kiri foto menghilang halus; dasar hero diberi gradasi tipis ke warna section berikutnya.
 *   3) Tepi bawah hero melengkung (cembung) dan "dipotong" dengan warna section berikutnya.
 *
 * imageId (opsional, diatur dari Dashboard > Settings). Di layar kecil foto menjadi latar penuh dengan overlay
 * navy yang lebih pekat agar teks terbaca. Tanpa imageId, tampilan tetap navy gradient seperti semula.
 *
 * blend: warna section PERTAMA di bawah hero. "mist"/"white" → tepi bawah melengkung ke warna itu.
 * "none" → tepi bawah lurus dan memudar ke navy (dipakai About Us, section berikutnya berwarna gelap).
 * Hero memakai -mt-20 + padding atas ekstra supaya berada DI BAWAH navbar transparan (atribut data-nav-hero
 * memberi tahu SiteNav bahwa halaman ini punya hero gelap). Saat navbar solid, tampilannya tetap rapi.
 */
export function PageHero({ eyebrow, title, text, icon = "verified", blend = "none", imageId = null }: { eyebrow: string; title: string; text: string; icon?: string; blend?: "none" | "mist" | "white"; imageId?: number | null }) {
  const curved = blend !== "none";
  const curveFill = blend === "white" ? "fill-white" : "fill-mist";
  const blendRgb = blend === "white" ? "255,255,255" : "242,245,249"; // white / mist (#F2F5F9)
  return (
    <section
      data-nav-hero
      className={`relative isolate -mt-20 overflow-hidden bg-gradient-to-br from-navy via-navy-2 to-navy text-white ${curved ? "pb-28 pt-[8.5rem] md:pb-36 lg:pt-[10rem]" : "pb-14 pt-[8.5rem] lg:pb-20 lg:pt-[10rem]"}`}
    >
      {/* Latar */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {imageId ? (
          <>
            {/* Foto di sisi kanan (desktop) / latar penuh (mobile), dengan gradient mask di tepi kiri */}
            <div className="absolute inset-y-0 right-0 w-full md:w-[60%]" style={mask(MASK_X)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/media/${imageId}`} alt="" decoding="async" fetchPriority="high" className="h-full w-full object-cover object-center" />
            </div>
            {/* Mobile: overlay navy rata agar teks terbaca */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/62 to-navy/25 md:hidden" />
            {/* Desktop: overlay kiri → kanan berkontur lengkung */}
            <div className="absolute inset-0 hidden md:block" style={{ backgroundImage: CURVED_FADE_X }} />
            <div className="absolute inset-x-0 top-0 h-36" style={{ backgroundImage: FADE_TOP }} />
            {/* Gradasi tipis di dasar hero (di bawah lengkungan) */}
            <div className="absolute inset-x-0 bottom-0 h-28 md:h-36" style={{ backgroundImage: bottomSoft(curved ? blendRgb : NAVY) }} />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(55%_60%_at_85%_10%,rgba(8,102,217,0.38),transparent_70%)]" />
            <div className="bg-grid-faint absolute inset-0 opacity-40" />
            <div className="float-slow absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
            <div className="float-slow absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-accent/15 blur-3xl [animation-delay:-3s]" />
          </>
        )}
      </div>

      {/* Tepi bawah melengkung: warna = section berikutnya */}
      {curved && (
        <svg aria-hidden="true" viewBox="0 0 1440 90" preserveAspectRatio="none" className={`pointer-events-none absolute inset-x-0 -bottom-px z-[1] block h-10 w-full md:h-[72px] ${curveFill}`}>
          <path d="M0,90 L0,0 Q720,180 1440,0 L1440,90 Z" />
        </svg>
      )}

      <div className="container-x relative">
        <span className="hero-in mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-label-md uppercase tracking-wider text-white backdrop-blur" style={{ "--d": "0ms" } as React.CSSProperties}>
          <Icon name={icon} className="text-[16px] text-accent" />{eyebrow}
        </span>
        <h1 className={`hero-in max-w-4xl whitespace-pre-line text-display-md-mobile tracking-tight text-white md:text-display-md ${imageId ? SHADOW : ""}`} style={{ "--d": "120ms" } as React.CSSProperties}>{title}</h1>
        <div className="hero-in mt-5 h-1 w-20 rounded bg-accent" style={{ "--d": "240ms" } as React.CSSProperties} />
        <p className={`hero-in mt-5 max-w-3xl whitespace-pre-line text-body-lg text-slate-200 ${imageId ? SHADOW : ""}`} style={{ "--d": "340ms" } as React.CSSProperties}>{text}</p>
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, href, linkText, center = false }: { eyebrow: string; title: string; href?: string; linkText?: string; center?: boolean }) {
  return (
    <div className={`mb-10 flex flex-wrap items-end gap-4 ${center ? "justify-center text-center" : "justify-between"}`}>
      <div><span className="text-label-md uppercase tracking-wider text-primary">{eyebrow}</span><h2 className="mt-2 text-headline-xl text-navy">{title}</h2><div className={`mt-3 h-1 w-14 rounded bg-accent ${center ? "mx-auto" : ""}`} /></div>
      {href && <Link href={href} className="inline-flex items-center gap-1 text-title-md text-primary transition-colors hover:text-brand-hover">{linkText}<Icon name="arrow_forward" className="arrow-shift text-[18px]" /></Link>}
    </div>
  );
}

/** CTA bawah halaman. tight: tanpa margin atas besar (dipakai bila section di atasnya sudah memberi ruang). */
export function CtaBand({ title, text, tight = false }: { title: string; text: string; tight?: boolean }) {
  return (
    <section className={`container-x ${tight ? "mt-2" : "mt-20"}`}>
      <Reveal>
        <div className="bg-animated relative overflow-hidden rounded-xl bg-gradient-to-br from-navy via-navy-2 to-primary/80 p-8 text-white shadow-[0_26px_50px_-24px_rgba(7,29,51,0.6)] lg:p-12">
          <div aria-hidden="true" className="bg-grid-faint pointer-events-none absolute inset-0 opacity-30" />
          <div aria-hidden="true" className="float-slow pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
          <div aria-hidden="true" className="float-slow pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-accent/20 blur-3xl [animation-delay:-3s]" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center lg:gap-8">
            <div className="max-w-2xl"><h2 className="text-headline-xl text-white md:text-display-md">{title}</h2><p className="mt-3 text-body-lg text-slate-300">{text}</p></div>
            <Link href="/contact" className="btn-accent group !px-8 !py-3.5 shadow-lg shadow-accent/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30">Contact Us<Icon name="arrow_forward" className="text-[20px] transition-transform duration-300 group-hover:translate-x-1" /></Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}