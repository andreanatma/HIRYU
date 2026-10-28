import { Icon } from "@/components/ui";

export type AboutSec = { id: number; heading: string; body: string; imageId: number | null };

/** Parse "## Judul\n\nIsi" menjadi daftar {title, text}. */
function parseCards(body: string) {
  const blocks = body.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const out: { title: string; text: string }[] = [];
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].startsWith("## ")) out.push({ title: blocks[i].slice(3), text: blocks[i + 1] && !blocks[i + 1].startsWith("## ") ? blocks[i + 1] : "" });
  }
  return out;
}

/** Parse "- Judul: isi" menjadi daftar {title, text}. */
function parseBullets(body: string) {
  return body.replace(/\r\n/g, "\n").split("\n").map((l) => l.trim()).filter((l) => l.startsWith("- ")).map((l) => {
    const t = l.slice(2);
    const k = t.indexOf(":");
    return k > 0 ? { title: t.slice(0, k).trim(), text: t.slice(k + 1).trim() } : { title: t, text: "" };
  });
}

const paras = (body: string) => body.replace(/\r\n/g, "\n").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

// Letakkan 6 gambar di public/about/ (nama file bebas, sesuaikan di sini). Urutan = urutan prinsip.
const PRINCIPLE_IMAGES = ["/about/quality.jpg", "/about/safety.jpg", "/about/innovation.jpg", "/about/service.jpg", "/about/social.jpg", "/about/partnership.jpg"];
const PRINCIPLE_ICONS = ["workspace_premium", "diamond", "visibility", "link", "ecg_heart", "handshake"];
const WHY_ICONS = ["military_tech", "verified_user", "request_quote", "tune", "bolt", "favorite"];

function Divider() {
  return <div className="mx-auto mt-2 h-1 w-14 rounded bg-primary" />;
}

export function AboutSections({ sections }: { sections: AboutSec[] }) {
  const [intro, vision, mission, principles, why, ...rest] = sections;
  return (
    <div className="bg-navy py-16 text-white">
      <div className="container-x max-w-5xl space-y-16 text-center">
        {intro && (
          <section aria-labelledby={`about-${intro.id}`}>
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-primary-container"><Icon name="biotech" className="text-[32px]" /></span>
            <h2 id={`about-${intro.id}`} className="sr-only">{intro.heading}</h2>
            <div className="mx-auto max-w-4xl space-y-3 text-body-lg font-semibold text-primary-fixed-dim">
              {paras(intro.body).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>
        )}

        {vision && (
          <section aria-labelledby={`about-${vision.id}`}>
            <Icon name="rocket_launch" className="text-[40px]" />
            <h2 id={`about-${vision.id}`} className="mt-1 text-title-lg">{vision.heading}</h2>
            <Divider />
            <div className="mx-auto mt-6 max-w-3xl space-y-3 text-body-lg">{paras(vision.body).map((p, i) => <p key={i}>{p}</p>)}</div>
          </section>
        )}

        {mission && (
          <section aria-labelledby={`about-${mission.id}`}>
            <Icon name="target" className="text-[40px]" />
            <h2 id={`about-${mission.id}`} className="mt-1 text-title-lg">{mission.heading}</h2>
            <Divider />
            <div className="mx-auto mt-8 max-w-3xl space-y-8">
              {parseCards(mission.body).map((c) => (
                <div key={c.title}>
                  <h3 className="text-title-md"><span aria-hidden="true" className="text-primary-fixed-dim">⊙ </span>{c.title}<span aria-hidden="true" className="text-primary-fixed-dim"> ⊙</span></h3>
                  <p className="mt-2 text-body-lg">{c.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {principles && (
          <section aria-labelledby={`about-${principles.id}`}>
            <h2 id={`about-${principles.id}`} className="text-headline-lg uppercase tracking-wide">{principles.heading}</h2>
            <div className="mt-10 grid gap-8 text-left sm:grid-cols-2 lg:grid-cols-3">
              {parseCards(principles.body).slice(0, 6).map((c, i) => (
                <article key={c.title} className="text-center">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={PRINCIPLE_IMAGES[i]} alt="" loading="lazy" className="h-44 w-full rounded-2xl border-2 border-primary object-cover" />
                    <span className="absolute -bottom-6 left-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-primary-container"><Icon name={PRINCIPLE_ICONS[i] ?? "star"} className="text-[26px]" /></span>
                  </div>
                  <h3 className="mt-9 text-title-lg">{c.title}</h3>
                  <p className="mt-2 text-body-sm text-slate-300">{c.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {why && (
          <section aria-labelledby={`about-${why.id}`}>
            <h2 id={`about-${why.id}`} className="mx-auto w-fit rounded bg-accent px-6 py-2 text-title-lg font-extrabold uppercase tracking-wide text-navy">{why.heading}</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {parseBullets(why.body).slice(0, 6).map((c, i) => (
                <article key={c.title} className="flex flex-col items-center text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary-container bg-white text-primary-container"><Icon name={WHY_ICONS[i] ?? "star"} className="text-[28px]" /></span>
                  <h3 className="mt-3 text-title-lg">{c.title}</h3>
                  <p className="mt-2 text-body-sm text-slate-300">{c.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {rest.map((s) => (
          <section key={s.id}>
            <h2 className="text-headline-lg">{s.heading}</h2>
            <div className="mx-auto mt-4 max-w-3xl space-y-3 text-body-lg">{paras(s.body).map((p, i) => <p key={i}>{p}</p>)}</div>
          </section>
        ))}
      </div>
    </div>
  );
}