import "server-only";
import { permanentRedirect } from "next/navigation";
import { prisma } from "./db";

/** When a slug lookup misses, send visitors of an old URL to the current one (HTTP 308). No-op if no redirect is stored. */
export async function redirectIfRenamed(entity: "product" | "blog" | "service" | "portfolio", slug: string, base: string): Promise<void> {
  const r = await prisma.slugRedirect.findUnique({ where: { entity_oldSlug: { entity, oldSlug: slug } } });
  if (r) permanentRedirect(`${base}/${r.newSlug}`);
}
