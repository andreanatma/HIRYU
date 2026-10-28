import "server-only";
import { cookies } from "next/headers";
import { DICT, type DictKey } from "./dictionary";
import { DEFAULT_LANG, LANG_COOKIE, fmt, isLang, type Lang } from "./lang";

export async function getLang(): Promise<Lang> {
  const v = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(v) ? v : DEFAULT_LANG;
}

export async function getT() {
  const lang = await getLang();
  const t = (k: DictKey, v?: Record<string, string | number>) => (v ? fmt(DICT[lang][k], v) : DICT[lang][k]);
  return { lang, t };
}