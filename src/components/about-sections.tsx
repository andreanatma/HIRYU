import { Icon, MediaImg } from "./ui";

export type AboutRow = { id: number; heading: string; body: string; imageId: number | null };
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

/* ---------- ikon & foto (disamakan dengan PDF Company Profile) ---------- */
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

function IconTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/40"><Icon name={icon} className="text-[36px] text-white" /></span>
      <h2 className="mt-3 text-title-lg text-white">{title}</h2>
      <div className="mt-3 h-1 w-16 rounded bg-accent" />
    </div>
  );
}

function Badge({ icon, className = "" }: { icon: string; className?: string }) {
  return (
    <span className={`flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-primary to-brand-hover text-white shadow-lg ${className}`}>
      <Icon name={icon} className="text-[26px]" />
    </span>
  );
}

function PrincipleCard({ item, m }: { item: Item; m: Meta }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border-2 border-primary-container bg-white shadow-[0_10px_25px_-8px_rgba(8,102,217,0.35)] transition-transform hover:-translate-y-1">
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
    <li className="flex flex-col items-center px-2 text-center">
      <Badge icon={icon} className="!h-16 !w-16 ring-4 ring-white/15" />
      <h3 className="mt-4 text-title-lg text-white">{item.title}</h3>
      {item.text && <p className="mt-2 max-w-xs text-body-sm leading-relaxed text-slate-300">{item.text}</p>}
    </li>
  );
}

/* ---------- komponen utama ---------- */
export function AboutSections({ sections, companyName }: { sections: AboutRow[]; companyName: string }) {
  const used = new Set<number>();
  const take = (re: RegExp) => { const s = sections.find((x) => !used.has(x.id) && re.test(x.heading)); if (s) used.add(s.id); return s; };

  // Kata kunci Inggris + Indonesia
  const vision = take(/vision|visi/i);
  const mission = take(/mission|misi/i);
  let principles = take(/principle|prinsip|value|nilai/i);
  let why = take(/why|mengapa|kenapa|choose|memilih/i);

  const principlesP = principles ? parse(principles.body) : null;
  const whyP = why ? parse(why.body) : null;
  // Jika formatnya bukan daftar item, jangan hilangkan: tampilkan sebagai blok biasa.
  if (principles && principlesP && principlesP.items.length === 0) { used.delete(principles.id); principles = undefined; }
  if (why && whyP && whyP.items.length === 0) { used.delete(why.id); why = undefined; }

  const intro = take(/^about|tentang|profil|profile/i) ?? sections.find((s) => !used.has(s.id));
  if (intro) used.add(intro.id);
  const extra = sections.filter((s) => !used.has(s.id));

  const introP = intro ? parse(intro.body) : null;
  const visionP = vision ? parse(vision.body) : null;
  const missionP = mission ? parse(mission.body) : null;
  const hasTop = !!(intro || vision || mission || extra.length);

  return (
    <div>
      <div className="h-2 bg-accent" aria-hidden="true" />

      {/* BAND 1 — biru brand: intro, vision, mission */}
      {hasTop && (
        <div className="relative overflow-hidden bg-gradient-to-b from-brand-hover via-primary to-brand-hover text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:26px_26px] opacity-[0.07]" />
          <div className="pointer-events-none absolute -right-32 -top-20 h-96 w-96 rounded-full bg-white/10 blur-[110px]" />

          {intro && introP && (
            <section aria-labelledby="ab-intro" className="container-x relative max-w-4xl py-16 text-center">
              <div className="mx-auto mb-8 flex items-center justify-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/40 bg-white/10"><Icon name="biotech" className="text-[30px]" /></span>
                <span className="text-left text-title-md font-bold uppercase leading-tight tracking-wide">{companyName}</span>
              </div>
              <h2 id="ab-intro" className="sr-only">{intro.heading}</h2>
              <Paras items={introP.lead.length ? introP.lead : [intro.body]} className="text-body-lg font-semibold leading-relaxed" />
              {intro.imageId && <MediaImg id={intro.imageId} alt={intro.heading} className="mt-10 h-72 w-full rounded-xl border border-white/20" />}
            </section>
          )}

          {vision && visionP && (
            <section aria-labelledby="ab-vision" className="container-x relative max-w-3xl pb-14 text-center">
              <div id="ab-vision"><IconTitle icon="rocket_launch" title={vision.heading} /></div>
              <Paras items={visionP.lead.length ? visionP.lead : [vision.body]} className="mt-6 text-body-lg text-white/90" />
            </section>
          )}

          {mission && missionP && (
            <section aria-labelledby="ab-mission" className="container-x relative max-w-3xl pb-16 text-center">
              <div id="ab-mission"><IconTitle icon="target" title={mission.heading} /></div>
              {missionP.lead.length > 0 && <Paras items={missionP.lead} className="mt-6 text-body-lg text-white/90" />}
              <div className="mt-8 space-y-8">
                {missionP.items.map((it) => (
                  <div key={it.title}>
                    <h3 className="inline-flex items-center gap-2 text-title-md text-white">
                      <Icon name="add_circle" className="text-[16px] text-accent" />{it.title}<Icon name="add_circle" className="text-[16px] text-accent" />
                    </h3>
                    <p className="mt-2 whitespace-pre-line text-body-md leading-relaxed text-white/85">{it.text}</p>
                  </div>
                ))}
              </div>
            </section>
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

      {/* BAND 2 — terang: prinsip perusahaan dengan 6 foto */}
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

      {/* BAND 3 — navy-2: mengapa memilih kami */}
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
    </div>
  );
}