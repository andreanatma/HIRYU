import { Icon } from "./ui";
import { cn } from "@/lib/utils";

export function ProductImage({ id, alt, className }: { id?: number | null; alt: string; className?: string }) {
  return (
    <div className={cn("flex aspect-square items-center justify-center overflow-hidden border border-line bg-white", className)}>
      {id ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/media/${id}`} alt={alt} loading="lazy" className="h-full w-full object-contain p-6" />
      ) : (
        <Icon name="science" className="text-[56px] text-primary/30" />
      )}
    </div>
  );
}