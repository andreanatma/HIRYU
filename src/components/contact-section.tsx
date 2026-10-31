import { getSettings } from "@/lib/settings";
import { t } from "@/lib/dictionary";
import { safeMapsUrl } from "@/lib/maps";
import { cn } from "@/lib/utils";
import { Icon } from "./ui";
import { ContactForm } from "./contact-form";

/** Kartu bergaya katalog produk: terangkat + kilau + garis aksen kuning saat hover. Dipakai di /contact dan beranda. */
const HOVER_SOFT = "transition-[box-shadow,border-color] duration-300 hover:border-primary/30 hover:shadow-[0_24px_44px_-24px_rgba(8,102,217,0.35)]";

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
  const directions = s.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address.replace(/\s+/g, " ").trim())}` : null;

  return (
    // lg: kedua kolom setinggi sama (items-stretch). Kartu form mengikuti tinggi kolom kanan; peta memanjang mengisi sisa.
    // Mobile/tablet: bertumpuk; di tablet (sm) daftar kontak menjadi 2 kolom agar tidak terlalu panjang.
    <div className="grid gap-5 md:gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-8">
      {/* ---------- Form ---------- */}
      <div className={cn("card group relative flex flex-col overflow-hidden p-5 sm:p-8 lg:col-span-7 lg:p-10", HOVER_SOFT)}>
        <div className="mb-6">
          <h2 className="text-headline-lg text-navy sm:text-headline-xl">{heading ?? t("send_us")}</h2>
          <div className="mt-3 h-1 w-12 rounded bg-accent transition-all duration-500 group-hover:w-20" />
        </div>
        <ContactForm />
        <span className="accent-bar" />
      </div>

      {/* ---------- Info + peta ---------- */}
      <aside className="flex flex-col gap-5 md:gap-6 lg:col-span-5" aria-label={t("c_aria")}>
        <div className="card card-lift shine group relative overflow-hidden p-4 sm:p-5 lg:p-6">
          {items.length === 0 && <p className="text-body-md text-on-surface-variant">{t("c_none")}</p>}
          <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
            {items.map(([icon, label, value, href]) => {
              const body = (
                <>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-container text-primary transition-all duration-300 group-hover/row:-rotate-6 group-hover/row:scale-110 group-hover/row:bg-primary group-hover/row:text-white">
                    <Icon name={icon} className="text-[20px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-label-md uppercase text-slate-text">{label}</span>
                    <span className={cn("block [overflow-wrap:anywhere]", href ? "text-title-md text-navy transition-colors group-hover/row:text-primary" : "whitespace-pre-line text-body-md text-on-surface")}>{value}</span>
                  </span>
                  {href && <Icon name={href.startsWith("http") ? "north_east" : "arrow_forward"} className="arrow-shift mt-1 text-[18px] text-outline opacity-0 transition-opacity duration-300 group-hover/row:opacity-100" />}
                </>
              );
              const rowCls = "group/row -mx-2 flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors duration-200 hover:bg-mist";
              return href ? (
                <a key={label} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={rowCls}>{body}</a>
              ) : (
                <div key={label} className={rowCls}>{body}</div>
              );
            })}
          </div>
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn-accent shine group/btn mt-4 w-full hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30 active:translate-y-0 active:scale-[0.99]">
              <Icon name="chat" className="text-[20px]" />{t("c_wa_btn")}
              <Icon name="arrow_forward" className="text-[18px] transition-transform duration-300 group-hover/btn:translate-x-1" />
            </a>
          )}
          <span className="accent-bar" />
        </div>

        {map ? (
          // Mobile: tinggi tetap. Desktop: mengisi sisa tinggi kolom (min 18rem) agar bawahnya sejajar dengan kartu form.
          <div className={cn("card relative h-64 overflow-hidden sm:h-72 lg:h-auto lg:min-h-[18rem] lg:flex-1", HOVER_SOFT)}>
            <iframe title={t("c_map_title")} src={map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />
            {directions && (
              <a href={directions} target="_blank" rel="noopener noreferrer" className="absolute inset-x-0 bottom-3 z-10 mx-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-label-md font-semibold text-navy shadow-md ring-1 ring-line backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:shadow-lg">
                <Icon name="directions" className="text-[16px]" />Get directions
              </a>
            )}
          </div>
        ) : (
          <div className="card flex h-36 items-center justify-center p-6 text-center text-body-sm text-on-surface-variant lg:h-auto lg:min-h-[10rem] lg:flex-1">{t("c_map_none")}</div>
        )}
      </aside>
    </div>
  );
}