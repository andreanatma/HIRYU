import Link from "next/link";
import { Icon } from "./ui";

export function PageHero({ eyebrow, title, text, icon = "verified" }: { eyebrow: string; title: string; text: string; icon?: string }) {
  return (
    <section className="relative overflow-hidden bg-navy py-14 text-white lg:py-20">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
      <div className="container-x relative">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-label-md uppercase tracking-wider text-white"><Icon name={icon} className="text-[16px] text-accent" />{eyebrow}</span>
        <h1 className="max-w-4xl text-display-md-mobile tracking-tight text-white md:text-display-md">{title}</h1>
        <div className="mt-5 h-1 w-20 rounded bg-accent" />
        <p className="mt-5 max-w-3xl text-body-lg text-slate-300">{text}</p>
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, href, linkText, center = false }: { eyebrow: string; title: string; href?: string; linkText?: string; center?: boolean }) {
  return (
    <div className={`mb-10 flex flex-wrap items-end gap-4 ${center ? "justify-center text-center" : "justify-between"}`}>
      <div><span className="text-label-md uppercase tracking-wider text-primary">{eyebrow}</span><h2 className="mt-2 text-headline-xl text-navy">{title}</h2><div className={`mt-3 h-1 w-14 rounded bg-accent ${center ? "mx-auto" : ""}`} /></div>
      {href && <Link href={href} className="inline-flex items-center gap-1 text-title-md text-primary hover:text-brand-hover">{linkText}<Icon name="arrow_forward" className="text-[18px]" /></Link>}
    </div>
  );
}

export function CtaBand({ title, text }: { title: string; text: string }) {
  return (
    <section className="container-x mt-20">
      <div className="relative overflow-hidden rounded-xl bg-navy p-10 text-white lg:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl"><h2 className="text-headline-xl text-white md:text-display-md">{title}</h2><p className="mt-3 text-body-lg text-slate-300">{text}</p></div>
          <Link href="/contact" className="btn-accent !px-8 !py-3.5">Contact Us<Icon name="arrow_forward" className="text-[20px]" /></Link>
        </div>
      </div>
    </section>
  );
}
