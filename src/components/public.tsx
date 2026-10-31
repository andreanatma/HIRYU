import Link from "next/link";
import { Icon } from "./ui";
import { Reveal } from "./public/reveal";

// Gradasi "eased" (banyak titik henti) supaya peralihan warna halus, tanpa garis/undakan.
const NAVY = "7,29,51";
const stops = (alphas: [number, number][]) => alphas.map(([pos, a]) => `rgba(${NAVY},${a}) ${pos}%`).join(", ");

/** Overlay kiri → kanan: navy pekat di belakang teks, memudar mulus sampai foto terlihat jelas di kanan. */
const FADE_X = `linear-gradient(90deg, ${stops([[0, 1], [34, 0.96], [44, 0.78], [54, 0.5], [64, 0.26], [74, 0.1], [86, 0.02], [100, 0]])})`;
/** Gradient mask: tepi kiri foto menghilang halus sehingga tidak ada garis batas foto. */
const MASK_X = "linear-gradient(90deg, transparent 0%, #000 24%)";
/** Bayangan teks halus agar tetap terbaca bila bagian foto yang terang berada di belakang teks. */
const SHADOW = "[text-shadow:0_2px_14px_rgba(7,29,51,0.55)]";
const mask = (v: string): React.CSSProperties => ({ WebkitMaskImage: v, maskImage: v });
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/** Pola titik-titik dekoratif (sisi kiri hero). */
const DOTS = "bg-[radial-gradient(rgba(125,185,255,0.75)_1.6px,transparent_1.8px)] [background-size:15px_15px]";

/** Kurva tepi bawah (dipakai bersama oleh isi putih/mist, garis cahaya biru, dan aksen kuning). */
const CURVE = "M0,34 C380,112 980,120 1440,12";

/**
 * Judul hero: baris dipisah "\n". Kata TERAKHIR dari baris terakhir diberi warna kuning (aksen),
 * contoh "TEST\nOur Solution" → "TEST" / "Our" putih + "Solution" kuning.
 * Judul satu kata tetap putih seluruhnya.
 */
function HeroTitle({ title }: { title: string }) {
  const lines = title.split("\n");
  const totalWords = lines.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return (
    <>
      {lines.map((line, li) => {
        const isLast = li === lines.length - 1;
        const words = line.split(/(\s+)/); // simpan spasi agar susunan tetap utuh
        let lastWordIdx = -1;
        words.forEach((w, i) => { if (w.trim()) lastWordIdx = i; });
        return (
          <span key={li} className="block">
            {words.map((w, wi) =>
              isLast && totalWords > 1 && wi === lastWordIdx ? (
                <span key={wi} className="text-accent">{w}</span>
              ) : (
                <span key={wi}>{w}</span>
              ),
            )}
          </span>
        );
      })}
    </>
  );
}

/**
 * Hero halaman dalam (semua halaman selain homepage). Desain:
 *   - Latar navy → biru, foto (opsional, atur dari Dashboard > Settings) di sisi kanan dengan tepi kiri memudar.
 *   - Dekorasi: pola titik di kiri, garis diagonal transparan + aksen kuning di kanan.
 *   - Konten: badge (ikon + label uppercase), judul besar tebal (kata terakhir kuning), garis kuning, subjudul.
 *   - Tepi bawah berupa lengkung "swoosh" berwarna section berikutnya, dengan garis cahaya biru + aksen kuning.
 *
 * blend: warna section PERTAMA di bawah hero. "mist"/"white" → lengkung ke warna itu.
 * "none" → tanpa lengkung; dasar hero memudar ke navy (dipakai About Us, section berikutnya berwarna gelap).
 * Navbar kini solid, jadi hero dimulai tepat di bawah navbar (tanpa -mt-20).
 */
export function PageHero({ eyebrow, title, text, icon = "verified", blend = "none", imageId = null }: { eyebrow: string; title: string; text: string; icon?: string; blend?: "none" | "mist" | "white"; imageId?: number | null }) {
  const curved = blend !== "none";
  const curveFill = blend === "white" ? "#FFFFFF" : "#F2F5F9"; // white / mist
  return (
    <section
      className={`relative isolate flex items-center overflow-hidden bg-gradient-to-br from-navy via-[#0A2A4E] to-[#0B3A78] text-white ${
        curved ? "min-h-[400px] pb-24 pt-14 md:min-h-[460px] md:pb-28 md:pt-16 lg:min-h-[500px] lg:pt-20" : "min-h-[360px] pb-14 pt-14 md:min-h-[400px] lg:pb-20 lg:pt-20"
      }`}
    >
      {/* ===== Latar ===== */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {imageId ? (
          <>
            {/* Foto di sisi kanan (desktop) / latar penuh (mobile) */}
            <div className="absolute inset-y-0 right-0 w-full md:w-[68%]" style={mask(MASK_X)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/media/${imageId}`} alt="" decoding="async" fetchPriority="high" className="h-full w-full object-cover object-center" />
            </div>
            {/* Mobile: overlay navy rata agar teks terbaca */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy/92 via-navy/66 to-navy/30 md:hidden" />
            {/* Desktop: overlay kiri → kanan */}
            <div className="absolute inset-0 hidden md:block" style={{ backgroundImage: FADE_X }} />
            {/* Rona biru di kiri atas */}
            <div className="absolute inset-0 hidden bg-[linear-gradient(115deg,rgba(8,102,217,0.38)_0%,transparent_42%)] md:block" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(55%_70%_at_85%_15%,rgba(8,102,217,0.42),transparent_70%)]" />
            <div className="bg-grid-faint absolute inset-0 opacity-30" />
            <div className="float-slow absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
          </>
        )}

        {/* Garis diagonal biru terang di kiri atas */}
        <div className="absolute left-0 top-0 h-[62%] w-[26%] bg-gradient-to-br from-primary/55 via-primary/15 to-transparent [clip-path:polygon(0_0,62%_0,0_62%)]" />
        {/* Pola titik */}
        <div className={`absolute left-4 top-8 hidden h-28 w-28 opacity-80 sm:block ${DOTS}`} />
        <div className={`absolute bottom-24 left-4 hidden h-24 w-24 opacity-70 md:block ${DOTS}`} />

        {/* Pita diagonal transparan di kanan + aksen kuning */}
        <div className="absolute inset-y-0 right-0 hidden w-[30%] bg-gradient-to-bl from-white/25 via-white/10 to-transparent [clip-path:polygon(46%_0,100%_0,100%_100%,72%_100%)] md:block" />
        <div className="absolute inset-y-0 right-0 hidden w-[22%] bg-gradient-to-bl from-primary/40 via-primary/10 to-transparent [clip-path:polygon(58%_0,100%_0,100%_100%,86%_100%)] md:block" />
        <div className="absolute right-0 top-[46%] hidden h-40 w-36 bg-gradient-to-b from-accent to-accent-hover opacity-90 [clip-path:polygon(28%_100%,100%_6%,100%_58%,60%_100%)] lg:block" />

        {/* Tanpa lengkung: dasar hero memudar ke navy */}
        {!curved && <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-navy/80" />}
      </div>

      {/* ===== Lengkung tepi bawah ("swoosh") ===== */}
      {curved && (
        <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 -bottom-px z-[1] block h-14 w-full overflow-visible md:h-[96px]">
          <defs>
            <linearGradient id="ph-blue" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1440" y2="0">
              <stop offset="0" stopColor="#2F8CFF" stopOpacity="0" />
              <stop offset="0.35" stopColor="#2F8CFF" stopOpacity="0.9" />
              <stop offset="0.75" stopColor="#6DB3FF" stopOpacity="0.9" />
              <stop offset="1" stopColor="#6DB3FF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ph-yellow" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1440" y2="0">
              <stop offset="0" stopColor="#FFD43B" />
              <stop offset="0.07" stopColor="#FFD43B" />
              <stop offset="0.2" stopColor="#FFD43B" stopOpacity="0" />
            </linearGradient>
            <filter id="ph-glow" x="-5%" y="-80%" width="110%" height="260%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          {/* Cahaya biru (blur) + garis tajam + aksen kuning di kiri */}
          <path d={CURVE} fill="none" stroke="url(#ph-blue)" strokeWidth="9" filter="url(#ph-glow)" vectorEffect="non-scaling-stroke" />
          <path d={CURVE} fill="none" stroke="url(#ph-blue)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          <path d={CURVE} fill="none" stroke="url(#ph-yellow)" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {/* Isi: warna section berikutnya */}
          <path d={`${CURVE} L1440,120 L0,120 Z`} fill={curveFill} />
        </svg>
      )}

      {/* ===== Konten ===== */}
      <div className="container-x relative z-[2] w-full">
        <div className="max-w-3xl">
          <span className="hero-in mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-gradient-to-r from-white/15 to-white/5 px-4 py-2 text-label-md font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] backdrop-blur" style={delay(0)}>
            <Icon name={icon} className="text-[20px] text-accent" />
            {eyebrow}
          </span>

          <h1 className={`hero-in text-[clamp(2.25rem,1.5rem+3.4vw,3.9rem)] font-extrabold leading-[1.05] tracking-tight text-white ${SHADOW}`} style={delay(120)}>
            <HeroTitle title={title} />
          </h1>

          <div className="hero-in mt-5 h-1 w-20 rounded bg-accent" style={delay(240)} />

          <p className={`hero-in mt-5 max-w-xl whitespace-pre-line text-body-lg leading-relaxed text-white/90 ${SHADOW}`} style={delay(340)}>{text}</p>
        </div>
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