"use client";

import { useEffect, useState } from "react";
import { Icon, MediaImg } from "./ui";
import { Reveal } from "./public/reveal";

export type AboutRow = { id: number; heading: string; body: string; imageId: number | null };
export type TeamMember = { id: number; name: string; role: string; imageUrl: string | null };

type Item = { title: string; text: string };

/* ---------- parsing ("## " = subjudul, "- Judul: isi" = bullet) ---------- */
function blocks(body: string) {
  return body.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
}

function parse(body: string): { lead: string[]; items: Item[] } {
  const lead: string[] = [];
  const items: Item[] = [];
  let cur: Item | null = null;
  for (const b of blocks(body)) {
    if (b.startsWith("## ")) { cur = { title: b.slice(3).trim(), text: "" }; items.push(cur); continue; }
    const lines = b.split("\n").map((l) => l.trim());
    if (lines.every((l) => l.startsWith("- "))) {
      for (const l of lines) {
        const t = l.slice(2);
        const i = t.indexOf(":");
        items.push(i > 0 ? { title: t.slice(0, i).trim(), text: t.slice(i + 1).trim() } : { title: t, text: "" });
      }
      cur = null;
      continue;
    }
    if (cur) cur.text += (cur.text ? "\n\n" : "") + b;
    else lead.push(b);
  }
  return { lead, items };
}

/* ---------- ikon & foto ---------- */
type Meta = { re: RegExp; icon: string; photo?: string };
const PRINCIPLES: Meta[] = [
  { re: /quality|kualitas/i, icon: "military_tech", photo: "quality" },
  { re: /safety|aman|keamanan/i, icon: "diamond", photo: "safety" },
  { re: /innovat|inovasi/i, icon: "visibility", photo: "innovation" },
  { re: /customer|service|pelanggan|layan/i, icon: "link", photo: "service" },
  { re: /social|environment|sosial|lingkungan/i, icon: "vital_signs", photo: "responsibility" },
  { re: /partner|collab|sama|kolaborasi/i, icon: "volunteer_activism", photo: "collaboration" },
];
const WHY: Meta[] = [
  { re: /professional/i, icon: "military_tech" },
  { re: /trust/i, icon: "verified_user" },
  { re: /price/i, icon: "list_alt" },
  { re: /flexib/i, icon: "dashboard_customize" },
  { re: /fast/i, icon: "vital_signs" },
  { re: /satisf/i, icon: "volunteer_activism" },
];
const meta = (list: Meta[], title: string, i: number): Meta => list.find((m) => m.re.test(title)) ?? { re: /./, icon: list[i % list.length].icon };

/* ---------- gradasi antar-band (tanpa garis batas keras) ---------- */
type Tone = "mist" | "navy" | "white";
// Class ditulis utuh agar terdeteksi Tailwind.
const FADE_TO: Record<Tone, string> = { mist: "to-mist", navy: "to-navy-2", white: "to-white" };

function Fade({ to }: { to: Tone }) {
  return <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent md:h-32 ${FADE_TO[to]}`} />;
}

/* ---------- potongan UI ---------- */
function Paras({ items, className = "" }: { items: string[]; className?: string }) {
  return <div className={`space-y-4 ${className}`}>{items.map((t, i) => <p key={i} className="whitespace-pre-line">{t}</p>)}</div>;
}

function CardHead({ id, icon, title }: { id: string; icon: string; title: string }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="ico-box flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/40 sm:h-14 sm:w-14">
        <Icon name={icon} className="text-[26px] text-white sm:text-[30px]" />
      </span>
      <div className="min-w-0">
        <h2 id={id} className="break-words text-title-lg text-white md:text-headline-md">{title}</h2>
        <div className="mt-2 h-1 w-14 rounded bg-accent" />
      </div>
    </div>
  );
}

function Badge({ icon, className = "" }: { icon: string; className?: string }) {
  return (
    <span className={`ico-box flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-primary to-brand-hover text-white shadow-lg ${className}`}>
      <Icon name={icon} className="text-[26px]" />
    </span>
  );
}

function PrincipleCard({ item, m }: { item: Item; m: Meta }) {
  return (
    <article className="ico-trigger group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-primary-container bg-white shadow-[0_10px_25px_-8px_rgba(8,102,217,0.35)] transition-all duration-500 motion-safe:hover:-translate-y-2 hover:border-accent hover:shadow-[0_28px_50px_-20px_rgba(8,102,217,0.55)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary to-navy">
        {m.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/about/${m.photo}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
        ) : (
          <div className="flex h-full items-center justify-center"><Icon name={m.icon} className="text-[80px] text-white/25" /></div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
        <Badge icon={m.icon} className="absolute bottom-3 left-3" />
      </div>
      <div className="flex-1 px-5 pb-6 pt-5 text-center sm:px-6 sm:pb-7">
        <h3 className="text-title-lg text-navy transition-colors duration-300 group-hover:text-primary">{item.title.replace(/:$/, "")}</h3>
        <div className="mx-auto mt-2 h-0.5 w-10 rounded bg-accent transition-all duration-500 group-hover:w-20" />
        <p className="mt-3 text-body-sm leading-relaxed text-slate-text">{item.text}</p>
      </div>
    </article>
  );
}

function WhyItem({ item, icon, index }: { item: Item; icon: string; index: number }) {
  return (
    <li className="ico-trigger">
      <Reveal delay={(index % 3) * 100} className="h-full">
        <div className="flex h-full flex-col items-center rounded-2xl px-3 py-5 text-center transition-all duration-500 hover:bg-white/[0.06] motion-safe:hover:-translate-y-1.5">
          <Badge icon={icon} className="!h-16 !w-16 ring-4 ring-white/15" />
          <h3 className="mt-4 text-title-lg text-white">{item.title}</h3>
          {item.text && <p className="mt-2 max-w-xs text-body-sm leading-relaxed text-slate-300">{item.text}</p>}
        </div>
      </Reveal>
    </li>
  );
}

/* ---------- Our Team ---------- */
export function TeamSection({ members, eyebrow = "People", title = "Our Team" }: { members: TeamMember[]; eyebrow?: string; title?: string }) {
  const [selected, setSelected] = useState<TeamMember | null>(null);

  // Tutup modal dengan Esc + kunci scroll saat modal terbuka
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [selected]);

  if (!members || members.length === 0) return null;

  return (
    <>
    <section aria-labelledby="team-heading" className="sec-deco sec-grid relative bg-gradient-to-b from-white via-[#EAF3FF] to-white py-14 md:py-16">
      <div className="container-x">
        <Reveal>
          <div className="mb-10 text-center md:mb-12">
            <span className="text-label-md font-bold uppercase tracking-wider text-primary">{eyebrow}</span>
            <h2 id="team-heading" className="mt-1 text-headline-lg text-navy md:text-headline-xl">{title}</h2>
            <div className="mx-auto mt-2 h-1 w-12 rounded bg-accent" />
          </div>
        </Reveal>

        {/* Maks. 3 kartu per baris; sisa baris selalu di tengah (1 kartu = tepat di tengah) */}
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-5 sm:gap-6 lg:gap-8">
          {members.map((m, i) => (
            <Reveal key={m.id} delay={(i % 3) * 100} className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)]">
              <button
                type="button"
                onClick={() => setSelected(m)}
                aria-label={`${m.name} — ${m.role}`}
                className="group relative block h-full w-full overflow-hidden rounded-2xl border border-line bg-white text-left shadow-sm transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 motion-safe:hover:-translate-y-2 hover:border-primary/35 hover:shadow-[0_24px_44px_-20px_rgba(8,102,217,0.38)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-mist">
                  {m.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-primary/40"><Icon name="person" className="text-[64px]" /></div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-title-lg font-bold text-navy transition-colors duration-300 group-hover:text-primary">{m.name}</h3>
                  <p className="mt-0.5 text-label-md uppercase tracking-wider text-primary">{m.role}</p>
                </div>
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

      {/* Modal detail anggota tim (di luar <section> agar z-index tidak terjebak stacking context sec-deco) */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.name}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="reveal-in relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-all hover:rotate-90 hover:bg-black/60"
            >
              <Icon name="close" className="text-[20px]" />
            </button>

            <div className="aspect-[4/3] w-full overflow-hidden bg-mist sm:aspect-square">
              {selected.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.imageUrl} alt={selected.name} className="h-full w-full object-cover object-top" />
              ) : (
                <div className="flex h-full items-center justify-center text-primary/40"><Icon name="person" className="text-[120px]" /></div>
              )}
            </div>

            <div className="p-6 text-center sm:p-8">
              <h3 className="text-headline-md font-bold text-navy">{selected.name}</h3>
              <div className="mx-auto mt-3 h-1 w-12 rounded bg-accent" />
              <p className="mt-4 text-title-md uppercase tracking-wider text-primary">{selected.role}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Komponen utama ---------- */
export function AboutSections({ sections, companyName, team, teamEyebrow, teamTitle }: { sections: AboutRow[]; companyName: string; team?: TeamMember[]; teamEyebrow?: string; teamTitle?: string }) {
  const used = new Set<number>();
  const take = (re: RegExp) => { const s = sections.find((x) => !used.has(x.id) && re.test(x.heading)); if (s) used.add(s.id); return s; };

  const vision = take(/vision|visi/i);
  const mission = take(/mission|misi/i);
  let principles = take(/principle|prinsip|value|nilai/i);
  let why = take(/why|mengapa|kenapa|choose|memilih/i);

  const principlesP = principles ? parse(principles.body) : null;
  const whyP = why ? parse(why.body) : null;
  if (principles && principlesP && principlesP.items.length === 0) { used.delete(principles.id); principles = undefined; }
  if (why && whyP && whyP.items.length === 0) { used.delete(why.id); why = undefined; }

  const intro = take(/^about|tentang|profil|profile/i) ?? sections.find((s) => !used.has(s.id));
  if (intro) used.add(intro.id);
  const extra = sections.filter((s) => !used.has(s.id));

  const introP = intro ? parse(intro.body) : null;
  const visionP = vision ? parse(vision.body) : null;
  const missionP = mission ? parse(mission.body) : null;
  const hasSide = !!(vision || mission);
  const hasMain = !!(intro || hasSide);
  const hasTop = hasMain || extra.length > 0;

  const hasPrinciples = !!(principles && principlesP && principlesP.items.length > 0);
  const hasWhy = !!(why && whyP && whyP.items.length > 0);
  const hasTeam = !!team && team.length > 0;

  // Warna band berikutnya → menentukan tujuan gradasi di dasar tiap band
  const afterTop: Tone | null = hasPrinciples ? "mist" : hasWhy ? "navy" : hasTeam ? "white" : null;
  const afterPrinciples: Tone | null = hasWhy ? "navy" : hasTeam ? "white" : null;
  const afterWhy: Tone | null = hasTeam ? "white" : null;

  return (
    <div>
      {/* BAND 1 — Intro, Visi & Misi */}
      {hasTop && (
        <div className="relative overflow-hidden bg-gradient-to-b from-brand-hover via-primary to-brand-hover text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:26px_26px] opacity-[0.07]" />
          <div className="pointer-events-none absolute -right-32 -top-20 h-96 w-96 rounded-full bg-white/10 blur-[110px]" />
          {/* Hero navy → biru: menyatu dengan hero, aksen kuning tipis sebagai pemanis */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-navy to-transparent md:h-32" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

          {hasMain && (
            <div className={`container-x relative pt-16 lg:pt-24 ${afterTop ? "pb-24 lg:pb-32" : "pb-14 lg:pb-20"}`}>
              <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
                {intro && introP && (
                  <section aria-labelledby="ab-intro" className={hasSide ? "lg:col-span-5" : "mx-auto max-w-4xl text-center lg:col-span-12"}>
                    <Reveal>
                      <div className={`ico-trigger mb-6 flex items-center gap-3 ${hasSide ? "" : "justify-center"}`}>
                        <span className="ico-box flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/40 bg-white/10">
                          <Icon name="biotech" className="text-[30px]" />
                        </span>
                        <span className="text-left text-title-md font-bold uppercase leading-tight tracking-wide">{companyName}</span>
                      </div>
                      <h2 id="ab-intro" className="sr-only">{intro.heading}</h2>
                      <Paras items={introP.lead.length ? introP.lead : [intro.body]} className="text-body-md font-semibold leading-relaxed sm:text-body-lg" />
                      {intro.imageId && <MediaImg id={intro.imageId} alt={intro.heading} className="mt-8 aspect-[16/9] w-full rounded-xl border border-white/20" />}
                    </Reveal>
                  </section>
                )}

                {hasSide && (
                  <div className={`space-y-6 ${intro ? "lg:col-span-7" : "lg:col-span-12"}`}>
                    {vision && visionP && (
                      <Reveal delay={100}>
                        <section aria-labelledby="ab-vision" className="ico-trigger rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm transition-all duration-500 hover:border-accent/60 hover:bg-white/[0.16] motion-safe:hover:-translate-y-1 hover:shadow-[0_24px_44px_-20px_rgba(0,0,0,0.5)] sm:p-6 md:p-8">
                          <CardHead id="ab-vision" icon="rocket_launch" title={vision.heading} />
                          <Paras items={visionP.lead.length ? visionP.lead : [vision.body]} className="mt-5 text-body-md leading-relaxed text-white/90" />
                        </section>
                      </Reveal>
                    )}

                    {mission && missionP && (
                      <Reveal delay={200}>
                        <section aria-labelledby="ab-mission" className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm transition-all duration-500 hover:border-accent/60 hover:shadow-[0_24px_44px_-20px_rgba(0,0,0,0.5)] sm:p-6 md:p-8">
                          <div className="ico-trigger w-fit">
                            <CardHead id="ab-mission" icon="target" title={mission.heading} />
                          </div>
                          {missionP.lead.length > 0 && <Paras items={missionP.lead} className="mt-5 text-body-md text-white/90" />}
                          <ul className="mt-6 space-y-4 sm:space-y-5">
                            {missionP.items.map((it) => (
                              <li key={it.title} className="group -m-2 flex gap-3 rounded-lg p-2 transition-all duration-300 hover:bg-white/10 motion-safe:hover:translate-x-1">
                                <Icon name="add_circle" className="mt-0.5 shrink-0 text-[20px] text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-125" />
                                <div className="min-w-0">
                                  <h3 className="text-title-md text-white">{it.title}</h3>
                                  {it.text && <p className="mt-1 whitespace-pre-line text-body-sm leading-relaxed text-white/85">{it.text}</p>}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </section>
                      </Reveal>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {extra.map((s) => (
            <section key={s.id} aria-labelledby={`ab-x-${s.id}`} className={`container-x relative max-w-3xl pt-4 text-center ${afterTop ? "pb-24 lg:pb-32" : "pb-16"}`}>
              <Reveal>
                <h2 id={`ab-x-${s.id}`} className="text-headline-lg text-white">{s.heading}</h2>
                <div className="mx-auto mb-5 mt-3 h-1 w-14 rounded bg-accent" />
                {s.imageId && <MediaImg id={s.imageId} alt={s.heading} className="mb-6 aspect-[16/9] w-full rounded-xl" />}
                <Paras items={blocks(s.body)} className="text-body-md text-white/85" />
              </Reveal>
            </section>
          ))}

          {afterTop && <Fade to={afterTop} />}
        </div>
      )}

      {/* BAND 2 — Prinsip */}
      {hasPrinciples && principles && principlesP && (
        <section aria-labelledby="ab-principles" className={`relative overflow-hidden bg-mist pt-14 md:pt-16 ${afterPrinciples ? "pb-24 md:pb-32" : "pb-14 md:pb-16"}`}>
          <div className="container-x">
            <Reveal>
              <div className="mb-10 text-center md:mb-12">
                <h2 id="ab-principles" className="break-words text-headline-lg uppercase tracking-wide text-navy md:text-headline-xl">{principles.heading}</h2>
                <div className="mx-auto mt-3 h-1 w-20 rounded bg-accent" />
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {principlesP.items.map((it, i) => (
                <Reveal key={it.title} delay={(i % 3) * 100} className="h-full">
                  <PrincipleCard item={it} m={meta(PRINCIPLES, it.title, i)} />
                </Reveal>
              ))}
            </div>
          </div>
          {afterPrinciples && <Fade to={afterPrinciples} />}
        </section>
      )}

      {/* BAND 3 — Mengapa Memilih Kami */}
      {hasWhy && why && whyP && (
        <section aria-labelledby="ab-why" className={`relative overflow-hidden bg-navy-2 pt-14 text-white md:pt-16 ${afterWhy ? "pb-24 md:pb-32" : "pb-14 md:pb-16"}`}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:26px_26px] opacity-[0.05]" />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-primary/30 blur-[110px]" />
          <div className="container-x relative">
            <Reveal>
              <div className="mb-10 text-center md:mb-14">
                <h2 id="ab-why" className="inline-block max-w-full break-words bg-accent px-5 py-2 text-title-lg font-extrabold uppercase tracking-wide text-navy shadow-lg md:px-6 md:text-headline-md">{why.heading}</h2>
              </div>
            </Reveal>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 md:gap-y-10 lg:grid-cols-3">
              {whyP.items.map((it, i) => <WhyItem key={it.title} item={it} icon={meta(WHY, it.title, i).icon} index={i} />)}
            </ul>
          </div>
          {afterWhy && <Fade to={afterWhy} />}
        </section>
      )}

      {/* Our Team */}
      {team && <TeamSection members={team} eyebrow={teamEyebrow} title={teamTitle} />}
    </div>
  );
}