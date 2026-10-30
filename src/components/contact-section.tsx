import { getSettings } from "@/lib/settings";
import { t } from "@/lib/dictionary";
import { safeMapsUrl } from "@/lib/maps";
import { Icon } from "./ui";
import { ContactForm } from "./contact-form";

export async function ContactSection({ heading }: { heading?: string }) {
  const s = await getSettings();
  const wa = s.whatsapp.replace(/\D/g, "");
  const map = safeMapsUrl(s.maps_embed_url);
  const hours = s.office_hours;
  const items: [string, string, string, string | null][] = [];
  if (s.email) items.push(["mail", t("c_email"), s.email, `mailto:${s.email}`]);
  if (wa) items.push(["chat", t("c_wa"), `+${wa}`, `https://wa.me/${wa}`]);
  if (s.address) items.push(["location_on", t("c_loc"), s.address, null]);
  if (hours) items.push(["schedule", t("c_hours"), hours, null]);

  return (
    // lg: kedua kolom dibuat setinggi sama (items-stretch). Kartu form mengikuti tinggi kolom kanan
    // (info + peta); sebaliknya peta ikut memanjang bila form lebih tinggi. Di mobile tetap bertumpuk normal.
    <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-8">
      <div className="card flex flex-col p-6 sm:p-10 lg:col-span-7">
        <h2 className="mb-6 text-headline-xl text-navy">{heading ?? t("send_us")}</h2>
        <ContactForm />
      </div>

      <aside className="flex flex-col gap-6 lg:col-span-5" aria-label={t("c_aria")}>
        <div className="card space-y-5 p-6">
          {items.length === 0 && <p className="text-body-md text-on-surface-variant">{t("c_none")}</p>}
          {items.map(([i, l, v, h]) => (
            <div key={l} className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-surface-container text-primary"><Icon name={i} className="text-[20px]" /></span>
              <div className="min-w-0">
                <p className="text-label-md uppercase text-slate-text">{l}</p>
                {h ? (
                  <a href={h} {...(h.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="break-words text-title-md hover:text-primary">{v}</a>
                ) : (
                  <p className="whitespace-pre-line text-body-md">{v}</p>
                )}
              </div>
            </div>
          ))}
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn-accent w-full">
              <Icon name="chat" className="text-[20px]" />{t("c_wa_btn")}
            </a>
          )}
        </div>

        {map ? (
          // Mobile: tinggi tetap 18rem. Desktop: mengisi sisa tinggi kolom (min 18rem) agar bawahnya sejajar dengan kartu form.
          <div className="card relative h-72 overflow-hidden lg:h-auto lg:min-h-[18rem] lg:flex-1">
            <iframe title={t("c_map_title")} src={map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />
          </div>
        ) : (
          <div className="card flex h-40 items-center justify-center p-6 text-center text-body-sm text-on-surface-variant lg:h-auto lg:min-h-[10rem] lg:flex-1">{t("c_map_none")}</div>
        )}
      </aside>
    </div>
  );
}