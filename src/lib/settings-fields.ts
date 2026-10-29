// Contact details are intentionally empty: they must be entered by an administrator in Settings.
export const SETTING_FIELDS = [
  { key: "company_name", label: "Company name", def: "PT Hiryu Techno Indonesia", type: "text" },
  { key: "tagline", label: "Tagline", def: "Supplier, Service & Calibration for Laboratory and Testing Equipment.", type: "textarea" },
  { key: "hero_title", label: "Homepage hero title", def: "Precision Instruments. Reliable Solutions.", type: "textarea" },
  { key: "hero_subtitle", label: "Homepage hero description", def: "We support equipment sourcing, technical services, and calibration requirements within our available scope.", type: "textarea" },
  { key: "email", label: "Company email", def: "", type: "text" },
  { key: "whatsapp", label: "WhatsApp number (international format, digits only, e.g. 628123456789)", def: "", type: "text" },
  { key: "address", label: "Company address", def: "", type: "textarea" },
  { key: "maps_embed_url", label: "Google Maps embed URL (src of the embed iframe, https://www.google.com/maps/embed?...)", def: "", type: "text" },
  { key: "office_hours", label: "Office hours", def: "", type: "text" },
  { key: "footer_description", label: "Footer description", def: "Service, repair, and maintenance of laboratory equipment, plus calibration and equipment supply.", type: "textarea" },
] as const;