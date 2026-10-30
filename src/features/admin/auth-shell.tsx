import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Icon } from "@/components/ui";

export type AuthPoint = { icon: string; title: string; text: string; anim?: "ico-tilt" | "ico-fly" | "ico-spin" | "ico-pulse" };

type Props = {
  eyebrow: string;
  heading: string;
  text: string;
  points: AuthPoint[];
  footnote?: string;
  children: React.ReactNode;
};

/**
 * Kerangka bersama halaman login & signup admin.
 * Visual mengikuti hero homepage: latar foto + ken-burns, overlay navy, grid halus, blob melayang, aksen kuning.
 * Server component (tanpa state) — animasi murni CSS dan otomatis mati pada prefers-reduced-motion.
 */
export function AuthShell({ eyebrow, heading, text, points, footnote, children }: Props) {
  const year = new Date().getFullYear();
  return (
    <main className="relative isolate flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-navy px-4 py-8 sm:px-6 sm:py-10">
      {/* ===== Latar (sama seperti hero homepage) ===== */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/hero-1.JP" alt="" decoding="async" className="ken-burns h-full w-full object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-navy/70" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_85%_15%,rgba(8,102,217,0.4),transparent_70%)]" />
        <div className="bg-grid-faint absolute inset-0 opacity-40" />
        <div className="float-slow absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="float-slow absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-accent/15 blur-3xl [animation-delay:-3s]" />
      </div>

      {/* Logo untuk layar kecil (panel kiri disembunyikan) */}
      <div className="auth-rise mb-6 flex items-center gap-3 text-white lg:hidden">
        <BrandLogo />
        <span className="text-title-lg font-bold">PT Hiryu Techno Indonesia</span>
      </div>

      <div className="auth-card-in grid w-full max-w-5xl overflow-hidden rounded-xl border border-white/15 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] lg:grid-cols-[1.05fr_1fr]">
        {/* ===== Panel brand (desktop) ===== */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0B132B] via-navy to-navy-2 p-10 text-white lg:flex">
          <div className="bg-grid-faint pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="float-slow pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" aria-hidden="true" />
          <div className="float-slow pointer-events-none absolute -bottom-24 -left-16 h-60 w-60 rounded-full bg-accent/20 blur-3xl [animation-delay:-4s]" aria-hidden="true" />

          <div className="auth-rise relative flex items-center gap-3" style={{ "--d": "100ms" } as React.CSSProperties}>
            <BrandLogo />
            <span className="text-title-lg font-bold">PT Hiryu Techno Indonesia</span>
          </div>

          <div className="relative">
            <span className="auth-rise inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-label-sm uppercase tracking-widest text-white/90 backdrop-blur" style={{ "--d": "200ms" } as React.CSSProperties}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {eyebrow}
            </span>
            <h2 className="auth-rise mt-4 text-headline-xl text-white" style={{ "--d": "280ms" } as React.CSSProperties}>
              {heading}
            </h2>
            <div className="auth-rise mt-3 flex items-start gap-3" style={{ "--d": "360ms" } as React.CSSProperties}>
              <div className="mt-2.5 h-1 w-10 shrink-0 rounded bg-accent" />
              <p className="text-body-md text-slate-300">{text}</p>
            </div>

            <ul className="mt-8 space-y-2">
              {points.map((p, i) => (
                <li key={p.title} className="auth-rise" style={{ "--d": `${460 + i * 100}ms` } as React.CSSProperties}>
                  <div className="ico-trigger flex items-center gap-4 rounded-lg border border-transparent p-3 transition-all duration-300 hover:translate-x-1 hover:border-white/15 hover:bg-white/10">
                    <span className="ico-box flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-navy">
                      <Icon name={p.icon} fill className={`ico-anim ${p.anim ?? "ico-tilt"} text-[22px]`} />
                    </span>
                    <div>
                      <p className="text-title-md text-white">{p.title}</p>
                      <p className="text-body-sm text-slate-300">{p.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="auth-rise relative text-label-md text-slate-400" style={{ "--d": "800ms" } as React.CSSProperties}>
            {footnote ?? `© ${year} PT Hiryu Techno Indonesia`}
          </p>
        </aside>

        {/* ===== Panel form ===== */}
        <section className="relative p-6 sm:p-10 lg:p-12">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary to-accent" aria-hidden="true" />
          {children}
          <Link href="/" className="group mt-8 inline-flex items-center gap-1.5 text-body-sm text-on-surface-variant transition-colors hover:text-primary">
            <Icon name="arrow_back" className="text-[16px] transition-transform duration-300 group-hover:-translate-x-1" />
            Back to website
          </Link>
        </section>
      </div>

      <p className="auth-rise mt-6 text-center text-label-md text-white/60 lg:hidden">© {year} PT Hiryu Techno Indonesia</p>
    </main>
  );
}
