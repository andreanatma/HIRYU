/** Only accept Google Maps embed URLs; anything else is ignored so an admin typo can never inject an arbitrary iframe source. */
export function safeMapsUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw.trim());
    if (u.protocol === "https:" && (u.hostname === "www.google.com" || u.hostname === "google.com") && u.pathname.startsWith("/maps/embed")) return u.toString();
  } catch { /* ignore */ }
  return null;
}
