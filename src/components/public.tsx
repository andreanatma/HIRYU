import Link from "next/link";
import { Icon } from "./ui";
import { Reveal } from "./public/reveal";

/**
 * Hero halaman dalam. Gaya sama dengan hero homepage (navy + glow + grid + animasi masuk).
 * blend: warna section PERTAMA di bawah hero. "mist"/"white" → bagian bawah hero memudar ke warna itu
 * (menyatu, tanpa garis tegas). "none" → tepi bawah lurus seperti semula.
 * Hero memakai -mt-20 + padding atas ekstra supaya berada DI BAWAH navbar transparan (atribut data-nav-hero
 * memberi tahu SiteNav bahwa halaman ini punya hero gelap). Saat navbar solid, tampilannya tetap rapi.
 */
export function PageHero({ eyebrow, title, text, icon = "verified", blend = "none" }: { eyebrow: string; title: string; text: string; icon?: string; blend?: "none" | "mist" | "white" }) {
  const fade = blend === "mist" ? "via-mist/40 to-mist" : blend === "white" ? "via-white/40 to-white" : "";
  return (
    <section
      data-nav-hero
      className={`relative isolate -mt-20 overflow-hidden bg-gradient-to-br from-navy via-navy-2 to-navy text-white ${blend === "none" ? "pb-14 pt-[8.5rem] lg:pb-20 lg:pt-[10rem]" : "pb-24 pt-[8.5rem] md:pb-32 lg:pt-[10rem]"}`}
    >
      {/* Dekorasi latar */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(55%_60%_at_85%_10%,rgba(8,102,217,0.38),transparent_70%)]" />
        <div className="bg-grid-faint absolute inset-0 opacity-40" />
        <div className="float-slow absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="float-slow absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-accent/15 blur-3xl [animation-delay:-3s]" />
        {blend !== "none" && <div className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent md:h-32 ${fade}`} />}
      </div>

      <div className="container-x relative">
        <span className="hero-in mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-label-md uppercase tracking-wider text-white backdrop-blur" style={{ "--d": "0ms" } as React.CSSProperties}>
          <Icon name={icon} className="text-[16px] text-accent" />{eyebrow}
        </span>
        <h1 className="hero-in max-w-4xl text-display-md-mobile tracking-tight text-white md:text-display-md" style={{ "--d": "120ms" } as React.CSSProperties}>{title}</h1>
        <div className="hero-in mt-5 h-1 w-20 rounded bg-accent" style={{ "--d": "240ms" } as React.CSSProperties} />
        <p className="hero-in mt-5 max-w-3xl text-body-lg text-slate-300" style={{ "--d": "340ms" } as React.CSSProperties}>{text}</p>
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