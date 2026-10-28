"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LANG_COOKIE, isLang } from "@/lib/lang";

export async function setLang(l: string): Promise<void> {
  const v = isLang(l) ? l : "en";
  (await cookies()).set(LANG_COOKIE, v, { path: "/", maxAge: 31_536_000, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  revalidatePath("/", "layout");
}