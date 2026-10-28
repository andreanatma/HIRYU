import { getSettings } from "@/lib/settings";
import { getT } from "@/lib/i18n";
import { sv } from "@/lib/lang";
import { safeMapsUrl } from "@/lib/maps";
import { Icon } from "./ui";
import { ContactForm } from "./contact-form";

export async function ContactSection({ heading }: { heading?: string }) {
  const [s, { lang, t }] = await Promise.all([getSettings(), getT()]);
  const wa = s.whatsapp.replace(/\D/g, "");
  const map = safeMapsUrl(s.maps_embed_url);
  const hours = sv(s, "office_hours", lang);
  const items: [string, string, string, string | null][] = [];
  if (s.email) items.push(["mail", t("c_email"), s.email, `mailto:${s.email}`]);
  if (wa) items.push(["chat", t("c_wa"), `+${wa}`, `https://wa.me/${wa}`]);
  if (s.address) items.push(["location_on", t("c_loc"), s.address, null]);
  if (hours) items.push(["schedule", t("c_hours"), hours, null]);
  return (
    <div className="grid items-start gap-8 lg:grid-cols-12">
      <div className="card p-6 sm:p-10 lg:col-span-7"><h2 className="mb-6 text-headline-xl text-navy">{heading ?? t("send_us")}</h2><ContactForm lang={lang} /></div>
      <aside className="space-y-6 lg:col-span-5" aria-label={t("c_aria")}>
        <div className="card space-y-5 p-6">
          {items.length === 0 && <p className="text-body-md text-on-surface-variant">{t("c_none")}</p>}
          {items.map(([i, l, v, h]) => (
            <div key={l} className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-surface-container text-primary"><Icon name={i} className="text-[20px]" /></span><div><p className="text-label-md uppercase text-slate-text">{l}</p>{h ? <a href={h} {...(h.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="text-title-md hover:text-primary">{v}</a> : <p className="whitespace-pre-line text-body-md">{v}</p>}</div></div>
          ))}
          {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn-accent w-full"><Icon name="chat" className="text-[20px]" />{t("c_wa_btn")}</a>}
        </div>
        {map ? (
          <div className="card overflow-hidden"><iframe title={t("c_map_title")} src={map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-72 w-full border-0" /></div>
        ) : (
          <div className="card flex h-40 items-center justify-center p-6 text-center text-body-sm text-on-surface-variant">{t("c_map_none")}</div>
        )}
      </aside>
    </div>
  );
}