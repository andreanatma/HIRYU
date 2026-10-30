"use client"; // Tambahkan ini agar bisa menggunakan interaksi client-side

import { useState } from "react";
import { Icon, MediaImg } from "./ui";

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

/* ---------- potongan UI ---------- */
function Paras({ items, className = "" }: { items: string[]; className?: string }) {
  return <div className={`space-y-4 ${className}`}>{items.map((t, i) => <p key={i} className="whitespace-pre-line">{t}</p>)}</div>;
}

function CardHead({ id, icon, title }: { id: string; icon: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="ico-box flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/40">
        <Icon name={icon} className="text-[30px] text-white" />
      </span>
      <div>
        <h2 id={id} className="text-title-lg text-white md:text-headline-md">{title}</h2>
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
    <article className="ico-trigger flex flex-col overflow-hidden rounded-2xl border-2 border-primary-container bg-white shadow-[0_10px_25px_-8px_rgba(8,102,217,0.35)] transition-transform hover:-translate-y-1">
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary to-navy">
        {m.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/about/${m.photo}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center"><Icon name={m.icon} className="text-[80px] text-white/25" /></div>
        )}
        <Badge icon={m.icon} className="absolute bottom-3 left-3" />
      </div>
      <div className="flex-1 px-6 pb-7 pt-5 text-center">
        <h3 className="text-title-lg text-navy">{item.title.replace(/:$/, "")}</h3>
        <div className="mx-auto mt-2 h-0.5 w-10 rounded bg-accent" />
        <p className="mt-3 text-body-sm leading-relaxed text-slate-text">{item.text}</p>
      </div>
    </article>
  );
}

function WhyItem({ item, icon }: { item: Item; icon: string }) {
  return (
    <li className="ico-trigger flex flex-col items-center px-2 text-center">
      <Badge icon={icon} className="!h-16 !w-16 ring-4 ring-white/15" />
      <h3 className="mt-4 text-title-lg text-white">{item.title}</h3>
      {item.text && <p className="mt-2 max-w-xs text-body-sm leading-relaxed text-slate-300">{item.text}</p>}
    </li>
  );
}

/* ---------- Komponen Our Team ---------- */
export function TeamSection({ members, eyebrow = "People", title = "Our Team" }: { members: TeamMember[]; eyebrow?: string; title?: string }) {
  // 1. Tambahkan state untuk mendeteksi member yang sedang diklik
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  if (!members || members.length === 0) return null;

  return (
    <section aria-labelledby="team-heading" className="bg-white py-16 relative">
      <div className="container-x">
        {/* Header di tengah */}
        <div className="mb-12 text-center">
          <span className="text-label-md font-bold uppercase tracking-wider text-primary">{eyebrow}</span>
          <h2 id="team-heading" className="mt-1 text-headline-xl text-navy">{title}</h2>
          <div className="mx-auto mt-2 h-1 w-12 rounded bg-accent" />
        </div>

        {/* Maks. 3 kartu per baris; sisa baris selalu di tengah (1 kartu = tepat di tengah) */}
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-8">
          {members.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMember(m)} // 2. Set member saat diklik
              className="w-full cursor-pointer overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-mist">
                {m.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.imageUrl} alt={m.name} loading="lazy" className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="flex h-full items-center justify-center text-primary/40"><Icon name="person" className="text-[64px]" /></div>
                )}
              </div>
              <div className="p-5 text-left">
                <h3 className="text-title-lg font-bold text-navy">{m.name}</h3>
                <p className="mt-0.5 text-label-md uppercase tracking-wider text-primary">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Modal Pop-Up untuk member yang dipilih */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedMember(null)} // Tutup modal saat klik area luar
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Cegah klik dari menjalar ke background
          >
            {/* Tombol Tutup */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-black/60"
            >
              <Icon name="close" className="text-[20px]" />
            </button>

            {/* Foto Modal */}
            <div className="aspect-[4/3] w-full overflow-hidden bg-mist sm:aspect-square">
              {selectedMember.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedMember.imageUrl}
                  alt={selectedMember.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-primary/40">
                  <Icon name="person" className="text-[120px]" />
                </div>
              )}
            </div>

            {/* Konten Modal */}
            <div className="p-8 text-center">
              <h3 className="text-headline-sm font-bold text-navy">{selectedMember.name}</h3>
              <div className="mx-auto mt-3 h-1 w-12 rounded bg-accent" />
              <p className="mt-4 text-title-md uppercase tracking-wider text-primary">{selectedMember.role}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- Komponen Utama AboutSections ---------- */
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

  return (
    <div>
      <div className="h-2 bg-accent" aria-hidden="true" />

      {/* BAND 1 — Intro, Visi & Misi */}
      {hasTop && (
        <div className="relative overflow-hidden bg-gradient-to-b from-brand-hover via-primary to-brand-hover text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:26px_26px] opacity-[0.07]" />
          <div className="pointer-events-none absolute -right-32 -top-20 h-96 w-96 rounded-full bg-white/10 blur-[110px]" />

          {hasMain && (
            <div className="container-x relative py-14 lg:py-20">
              <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
                {intro && introP && (
                  <section aria-labelledby="ab-intro" className={hasSide ? "lg:col-span-5" : "mx-auto max-w-4xl text-center lg:col-span-12"}>
                    <div className={`ico-trigger mb-6 flex items-center gap-3 ${hasSide ? "" : "justify-center"}`}>
                      <span className="ico-box flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/40 bg-white/10">
                        <Icon name="biotech" className="text-[30px]" />
                      </span>
                      <span className="text-left text-title-md font-bold uppercase leading-tight tracking-wide">{companyName}</span>
                    </div>
                    <h2 id="ab-intro" className="sr-only">{intro.heading}</h2>
                    <Paras items={introP.lead.length ? introP.lead : [intro.body]} className="text-body-lg font-semibold leading-relaxed" />
                    {intro.imageId && <MediaImg id={intro.imageId} alt={intro.heading} className="mt-8 h-64 w-full rounded-xl border border-white/20" />}
                  </section>
                )}

                {hasSide && (
                  <div className={`space-y-6 ${intro ? "lg:col-span-7" : "lg:col-span-12"}`}>
                    {vision && visionP && (
                      <section aria-labelledby="ab-vision" className="ico-trigger rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-colors hover:bg-white/[0.14] md:p-8">
                        <CardHead id="ab-vision" icon="rocket_launch" title={vision.heading} />
                        <Paras items={visionP.lead.length ? visionP.lead : [vision.body]} className="mt-5 text-body-md leading-relaxed text-white/90" />
                      </section>
                    )}

                    {mission && missionP && (
                      <section aria-labelledby="ab-mission" className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm md:p-8">
                        <div className="ico-trigger w-fit">
                          <CardHead id="ab-mission" icon="target" title={mission.heading} />
                        </div>
                        {missionP.lead.length > 0 && <Paras items={missionP.lead} className="mt-5 text-body-md text-white/90" />}
                        <ul className="mt-6 space-y-5">
                          {missionP.items.map((it) => (
                            <li key={it.title} className="group flex gap-3 rounded-lg p-2 -m-2 transition-colors hover:bg-white/10">
                              <Icon name="add_circle" className="mt-0.5 shrink-0 text-[20px] text-accent transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-0.5" />
                              <div>
                                <h3 className="text-title-md text-white">{it.title}</h3>
                                {it.text && <p className="mt-1 whitespace-pre-line text-body-sm leading-relaxed text-white/85">{it.text}</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {extra.map((s) => (
            <section key={s.id} aria-labelledby={`ab-x-${s.id}`} className="container-x relative max-w-3xl pb-16 text-center">
              <h2 id={`ab-x-${s.id}`} className="text-headline-lg text-white">{s.heading}</h2>
              <div className="mx-auto mb-5 mt-3 h-1 w-14 rounded bg-accent" />
              {s.imageId && <MediaImg id={s.imageId} alt={s.heading} className="mb-6 h-64 w-full rounded-xl" />}
              <Paras items={blocks(s.body)} className="text-body-md text-white/85" />
            </section>
          ))}
        </div>
      )}

      {/* BAND 2 — Prinsip */}
      {principles && principlesP && principlesP.items.length > 0 && (
        <section aria-labelledby="ab-principles" className="bg-mist py-16">
          <div className="container-x">
            <div className="mb-12 text-center">
              <h2 id="ab-principles" className="text-headline-xl uppercase tracking-wide text-navy">{principles.heading}</h2>
              <div className="mx-auto mt-3 h-1 w-20 rounded bg-accent" />
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {principlesP.items.map((it, i) => <PrincipleCard key={it.title} item={it} m={meta(PRINCIPLES, it.title, i)} />)}
            </div>
          </div>
        </section>
      )}

      {/* BAND 3 — Mengapa Memilih Kami */}
      {why && whyP && whyP.items.length > 0 && (
        <section aria-labelledby="ab-why" className="relative overflow-hidden bg-navy-2 py-16 text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:26px_26px] opacity-[0.05]" />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-primary/30 blur-[110px]" />
          <div className="container-x relative">
            <div className="mb-14 text-center">
              <h2 id="ab-why" className="inline-block bg-accent px-6 py-2 text-title-lg font-extrabold uppercase tracking-wide text-navy shadow-lg md:text-headline-md">{why.heading}</h2>
            </div>
            <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {whyP.items.map((it, i) => <WhyItem key={it.title} item={it} icon={meta(WHY, it.title, i).icon} />)}
            </ul>
          </div>
        </section>
      )}

      {/* Bagian Our Team */}
      {team && <TeamSection members={team} eyebrow={teamEyebrow} title={teamTitle} />}
    </div>
  );
}