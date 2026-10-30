import Link from "next/link";
import { Icon } from "./ui";
import { Reveal } from "./public/reveal";
import { cn } from "@/lib/utils";
import { t } from "@/lib/dictionary";

/** Gambar produk (dipakai di halaman detail). Zoom halus saat hover. */
export function ProductImage({ id, alt, className }: { id?: number | null; alt: string; className?: string }) {
  return (
    <div className={cn("group flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-line bg-gradient-to-br from-white to-mist", className)}>
      {id ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/media/${id}`} alt={alt} loading="lazy" className="h-full w-full object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105" />
      ) : (
        <Icon name="science" className="text-[56px] text-primary/30" />
      )}
    </div>
  );
}

export type ProductCardData = { slug: string; name: string; brand: string | null; model: string | null; imageId: number | null };

/** Kartu produk bergaya homepage: terangkat, kilau, zoom gambar, garis aksen kuning, tombol dengan panah. */
export function ProductCard({ p, index = 0 }: { p: ProductCardData; index?: number }) {
  const href = `/products/${p.slug}`;
  return (
    <Reveal delay={(index % 3) * 80} className="h-full">
      <article className="card card-lift shine group relative flex h-full flex-col overflow-hidden">
        <Link href={href} aria-label={p.name} className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-br from-white to-mist">
          {p.imageId ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/media/${p.imageId}`} alt={p.name} loading="lazy" className="h-full w-full object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-110" />
          ) : (
            <span className="flex h-full w-full items-center justify-center"><Icon name="science" className="text-[44px] text-primary/30" /></span>
          )}
          {p.brand && <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/90 px-2.5 py-1 text-label-sm uppercase text-primary shadow-sm backdrop-blur">{p.brand}</span>}
        </Link>
        <div className="flex flex-1 flex-col p-3.5 md:p-5">
          <h3 className="line-clamp-2 text-title-md text-navy transition-colors group-hover:text-primary md:text-title-lg">{p.name}</h3>
          {p.model && <p className="mt-0.5 truncate text-label-md uppercase text-slate-text">{p.model}</p>}
          <span className="flex-1" />
          <Link href={href} className="btn-primary group/btn mt-3 w-full !py-2 text-body-sm md:mt-4">
            {t("view_product")}<Icon name="arrow_forward" className="text-[16px] transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
        <span className="accent-bar" />
      </article>
    </Reveal>
  );
}