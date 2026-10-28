// Defaults contain ONLY text sourced from the company's Website Blueprint (hero copy) and the company name.
// Contact details are intentionally empty: they must be entered by an administrator in Settings.
// Keys ending in `_id` are the Indonesian versions; empty = English is shown.
export const SETTING_FIELDS = [
  { key: "company_name", label: "Company name", def: "PT Hiryu Techno Indonesia", type: "text" },
  { key: "tagline", label: "Tagline (EN)", def: "Supplier, Service & Calibration for Laboratory and Testing Equipment.", type: "textarea" },
  { key: "tagline_id", label: "Tagline (ID)", def: "Supplier, Servis & Kalibrasi untuk Peralatan Laboratorium dan Pengujian.", type: "textarea" },
  { key: "hero_title", label: "Homepage hero title (EN)", def: "Precision Instruments. Reliable Solutions.", type: "textarea" },
  { key: "hero_title_id", label: "Homepage hero title (ID)", def: "Instrumen Presisi. Solusi Andal.", type: "textarea" },
  { key: "hero_subtitle", label: "Homepage hero description (EN)", def: "We support equipment sourcing, technical services, and calibration requirements within our available scope.", type: "textarea" },
  { key: "hero_subtitle_id", label: "Homepage hero description (ID)", def: "Kami mendukung pengadaan peralatan, layanan teknis, dan kebutuhan kalibrasi sesuai ruang lingkup yang kami miliki.", type: "textarea" },
  { key: "email", label: "Company email", def: "", type: "text" },
  { key: "whatsapp", label: "WhatsApp number (international format, digits only, e.g. 628123456789)", def: "", type: "text" },
  { key: "address", label: "Company address", def: "", type: "textarea" },
  { key: "maps_embed_url", label: "Google Maps embed URL (src of the embed iframe, https://www.google.com/maps/embed?...)", def: "", type: "text" },
  { key: "office_hours", label: "Office hours (EN)", def: "", type: "text" },
  { key: "office_hours_id", label: "Office hours (ID)", def: "", type: "text" },
  { key: "footer_description", label: "Footer description (EN)", def: "Service, repair, and maintenance of laboratory equipment, plus calibration and equipment supply.", type: "textarea" },
  { key: "footer_description_id", label: "Footer description (ID)", def: "Servis, perbaikan, dan perawatan peralatan laboratorium, serta kalibrasi dan suplai peralatan.", type: "textarea" },
] as const;