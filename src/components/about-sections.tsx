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
    if (b.startsWith("## ")) {
      const [first, ...rest] = b.split("\n");
      cur = { title: first.slice(3).trim(), text: rest.join("\n").trim() };
      items.push(cur);
      continue;
    }
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
const meta = (list: Meta[], title: string, i: number): Meta =>
  list.find((m) => m.re.test(title)) ?? { re: /./, icon: list[i % list.length].icon };

/* ---------- gradasi latar: warna akhir satu band = warna awal band berikutnya (tanpa garis batas) ---------- */
type Tone = "mist" | "blue" | "white";
// Class ditulis utuh agar terdeteksi Tailwind.
const FROM: Record<Tone, string> = { mist: "from-mist", blue: "from-[#EEF4FC]", white: "from-white" };
const TO: Record<Tone, string> = { mist: "to-mist", blue: "to-[#EEF4FC]", white: "to-white" };

/* ---------- potongan UI ---------- */
function Paras({ items, className = "" }: { items: string[]; className?: string }) {
  return <div className={`space-y-4 ${className}`}>{items.map((t, i) => <p key={i} className="whitespace-pre-line">{t}</p>)}</div>;
}

/** Judul bagian di tengah: garis aksen kuning di bawahnya (sama seperti section lain). */
function CenterHead({ id, title, eyebrow }: { id: string; title: string; eyebrow?: string }) {
  return (
    <div className="mb-10 text-center md:mb-12">
      {eyebrow && <span className="text-label-md font-bold uppercase tracking-wider text-primary">{eyebrow}</span>}
      <h2 id={id} className="mt-1 break-words text-headline-lg text-navy md:text-headline-xl">{title}</h2>
      <div className="mx-auto mt-3 h-1 w-14 rounded bg-accent" />
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
    <article className="ico-trigger group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-500 motion-safe:hover:-translate-y-2 hover:border-primary/35 hover:shadow-[0_24px_44px_-20px_rgba(8,102,217,0.38)]">
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
      <span className="accent-bar" />
    </article>
  );
}

function WhyItem({ item, icon, index }: { item: Item; icon: string; index: number }) {
  return (
    <li className="ico-trigger">
      <Reveal delay={(index % 3) * 100} className="h-full">
        <div className="card card-lift group relative flex h-full flex-col items-center !rounded-2xl px-5 py-7 text-center">
          <Badge icon={icon} className="!h-16 !w-16 ring-4 ring-primary/10" />
          <h3 className="mt-4 text-title-lg text-navy transition-colors duration-300 group-hover:text-primary">{item.title}</h3>
          {item.text && <p className="mt-2 max-w-xs text-body-sm leading-relaxed text-slate-text">{item.text}</p>}
          <span className="accent-bar" />
        </div>
      </Reveal>
    </li>
  );
}

/* ---------- Our Team ---------- */
export function TeamSection({ members, eyebrow = "People", title = "Our Team", strong = false, gradient }: { members: TeamMember[]; eyebrow?: string; title?: string; strong?: boolean; gradient?: string }) {
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
      <section aria-labelledby="team-heading" className={`sec-deco sec-grid relative bg-gradient-to-b py-14 md:py-16 ${strong ? "sec-strong" : ""} ${gradient ?? "from-white to-[#EEF4FC]"}`}>
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
              autoFocus
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

  // Rantai latar: setiap band mulai dari warna akhir band sebelumnya; band terakhir berakhir putih.
  const chain: { key: string; end: Tone }[] = [];
  if (hasTop) chain.push({ key: "top", end: "blue" });
  if (hasPrinciples) chain.push({ key: "principles", end: "mist" });
  if (hasWhy) chain.push({ key: "why", end: "white" });
  if (hasTeam) chain.push({ key: "team", end: "white" });

  const bg = (key: string) => {
    const i = chain.findIndex((c) => c.key === key);
    const from: Tone = i <= 0 ? "mist" : chain[i - 1].end;
    const to: Tone = i === chain.length - 1 ? "white" : chain[i].end;
    return `bg-gradient-to-b ${FROM[from]} ${TO[to]}`;
  };
  const teamGradient = (() => {
    const i = chain.findIndex((c) => c.key === "team");
    const from: Tone = i <= 0 ? "mist" : chain[i - 1].end;
    return `${FROM[from]} to-white`;
  })();

  const leadParas = introP ? (introP.lead.length ? introP.lead : [intro!.body]) : [];
  const [firstLead, ...restLead] = leadParas;

  return (
    <div>
      {/* BAND 1 — Tentang, Visi & Misi */}
      {hasTop && (
        <section aria-label={companyName} className={`sec-deco sec-dots ${bg("top")} pb-14 pt-6 md:pb-16 md:pt-8`}>
          <div className="container-x">
            {hasMain && (
              <div className="grid items-start gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
                {intro && introP && (
                  <section aria-labelledby="ab-intro" className={hasSide ? "lg:col-span-5" : "mx-auto max-w-4xl text-center lg:col-span-12"}>
                    <Reveal className="h-full">
                      {/* h-full: tinggi kartu mengikuti kolom Visi & Misi di kanan (desktop) */}
                      <div className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/70 bg-white p-6 shadow-[0_26px_50px_-28px_rgba(7,29,51,0.45)] md:p-8 ${hasSide ? "" : "text-center"}`}>
                        {/* Aksen atas + cahaya lembut agar kartu terasa premium namun teks tetap bersih */}
                        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/40" />
                        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

                        <div className={`ico-trigger relative mb-5 flex items-center gap-3 ${hasSide ? "" : "justify-center"}`}>
                          <span className="ico-box flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary ring-1 ring-primary/15">
                            <Icon name="biotech" className="text-[28px]" />
                          </span>
                          <span className="text-left text-label-md font-bold uppercase leading-tight tracking-wider text-primary">{companyName}</span>
                        </div>

                        <h2 id="ab-intro" className="relative break-words text-[1.875rem] font-bold leading-tight text-navy sm:text-[2.25rem] lg:text-[2.75rem]">{intro.heading}</h2>
                        <div className={`relative mt-3 h-1 w-14 rounded bg-accent ${hasSide ? "" : "mx-auto"}`} />

                        {firstLead && <p className="relative mt-6 whitespace-pre-line text-body-lg leading-relaxed text-on-surface">{firstLead}</p>}

                        {/*
                          Wrapper flex-1 + items-center: kotak berada tepat di tengah ruang antara paragraf
                          dan tepi bawah kartu, sehingga jarak atas = jarak bawah.
                          Margin negatif (-mb) membatalkan padding bawah kartu agar hitungannya adil
                          (hanya bila tidak ada gambar di bawahnya). py-8 = jarak minimum.
                        */}
                        {restLead.length > 0 && (
                          <div className={`relative flex flex-1 items-center py-8 ${intro.imageId ? "" : "-mb-6 md:-mb-8"}`}>
                            <div className="flex w-full items-center gap-4 rounded-xl border border-line border-l-4 border-l-accent bg-mist/70 p-5 text-left sm:p-6">
                              <Icon name="verified" className="shrink-0 text-[28px] text-primary" />
                              <Paras items={restLead} className="text-body-lg leading-relaxed text-on-surface-variant" />
                            </div>
                          </div>
                        )}

                        {intro.imageId && <MediaImg id={intro.imageId} alt={intro.heading} className="relative mt-2 aspect-[16/9] w-full rounded-xl border border-line shadow-md" />}
                      </div>
                    </Reveal>
                  </section>
                )}

                {hasSide && (
                  /* flex column: kartu Misi melar (flex-1) sehingga tepi bawahnya rata dengan kartu kiri */
                  <div className={`flex flex-col gap-6 ${intro ? "lg:col-span-7" : "lg:col-span-12"}`}>
                    {vision && visionP && (
                      <Reveal delay={100}>
                        <section aria-labelledby="ab-vision" className="ico-trigger group relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-[#0A2A4E] to-[#0B3A78] p-6 text-white shadow-[0_26px_50px_-24px_rgba(7,29,51,0.6)] transition-all duration-500 motion-safe:hover:-translate-y-1 md:p-8">
                          <div aria-hidden="true" className="bg-grid-faint pointer-events-none absolute inset-0 opacity-30" />
                          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/40 blur-3xl" />
                          <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />

                          <div className="relative flex items-center gap-4">
                            <span className="ico-box flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/25">
                              <Icon name="rocket_launch" className="text-[28px] text-accent" />
                            </span>
                            <div className="min-w-0">
                              <h2 id="ab-vision" className="break-words text-title-lg text-white md:text-headline-md">{vision.heading}</h2>
                              <div className="mt-2 h-1 w-14 rounded bg-accent" />
                            </div>
                          </div>
                          <Paras items={visionP.lead.length ? visionP.lead : [vision.body]} className="relative mt-5 text-body-md leading-relaxed text-slate-200 md:text-body-lg" />
                        </section>
                      </Reveal>
                    )}

                    {mission && missionP && (
                      <Reveal delay={200} className="flex flex-1 flex-col">
                        <section aria-labelledby="ab-mission" className="flex-1 rounded-2xl border border-white/70 bg-white p-6 shadow-[0_26px_50px_-28px_rgba(7,29,51,0.45)] md:p-8">
                          <div className="ico-trigger flex w-fit items-center gap-4">
                            <span className="ico-box flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary ring-1 ring-primary/15">
                              <Icon name="target" className="text-[28px]" />
                            </span>
                            <div className="min-w-0">
                              <h2 id="ab-mission" className="break-words text-title-lg text-navy md:text-headline-md">{mission.heading}</h2>
                              <div className="mt-2 h-1 w-14 rounded bg-accent" />
                            </div>
                          </div>

                          {missionP.lead.length > 0 && <Paras items={missionP.lead} className="mt-5 text-body-md leading-relaxed text-on-surface-variant" />}

                          <ol className="mt-6 space-y-3 sm:space-y-4">
                            {missionP.items.map((it, i) => (
                              <li key={`${i}-${it.title}`} className="group flex gap-4 rounded-xl border border-line bg-mist/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-md">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-brand-hover text-label-md font-bold text-white shadow-sm">
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                <div className="min-w-0">
                                  <h3 className="text-title-md text-navy transition-colors duration-300 group-hover:text-primary">{it.title}</h3>
                                  {it.text && <p className="mt-1 whitespace-pre-line text-body-sm leading-relaxed text-slate-text">{it.text}</p>}
                                </div>
                              </li>
                            ))}
                          </ol>
                        </section>
                      </Reveal>
                    )}
                  </div>
                )}
              </div>
            )}

            {extra.map((s) => (
              <section key={s.id} aria-labelledby={`ab-x-${s.id}`} className={`mx-auto max-w-3xl text-center ${hasMain ? "mt-10" : ""}`}>
                <Reveal>
                  <div className="rounded-2xl border border-white/70 bg-white p-6 shadow-[0_26px_50px_-28px_rgba(7,29,51,0.45)] md:p-8">
                    <h2 id={`ab-x-${s.id}`} className="text-headline-lg text-navy">{s.heading}</h2>
                    <div className="mx-auto mb-5 mt-3 h-1 w-14 rounded bg-accent" />
                    {s.imageId && <MediaImg id={s.imageId} alt={s.heading} className="mb-6 aspect-[16/9] w-full rounded-xl" />}
                    <Paras items={blocks(s.body)} className="text-body-md text-on-surface-variant" />
                  </div>
                </Reveal>
              </section>
            ))}
          </div>
        </section>
      )}

      {/* BAND 2 — Prinsip */}
      {hasPrinciples && principles && principlesP && (
        <section aria-labelledby="ab-principles" className={`sec-deco sec-grid ${bg("principles")} py-14 md:py-16`}>
          <div className="container-x">
            <Reveal><CenterHead id="ab-principles" title={principles.heading} /></Reveal>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {principlesP.items.map((it, i) => (
                <Reveal key={`${i}-${it.title}`} delay={(i % 3) * 100} className="h-full">
                  <PrincipleCard item={it} m={meta(PRINCIPLES, it.title, i)} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BAND 3 — Mengapa Memilih Kami */}
      {hasWhy && why && whyP && (
        <section aria-labelledby="ab-why" className={`sec-deco sec-dots ${bg("why")} py-14 md:py-16`}>
          <div className="container-x">
            <Reveal><CenterHead id="ab-why" title={why.heading} /></Reveal>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {whyP.items.map((it, i) => <WhyItem key={`${i}-${it.title}`} item={it} icon={meta(WHY, it.title, i).icon} index={i} />)}
            </ul>
          </div>
        </section>
      )}

      {/* Our Team */}
      {team && <TeamSection members={team} eyebrow={teamEyebrow} title={teamTitle} gradient={teamGradient} />}
    </div>
  );
}