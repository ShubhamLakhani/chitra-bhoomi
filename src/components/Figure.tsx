import Image from "next/image";
import { ArchPlate, plateLabel } from "@/components/ArchPlate";
import type { ResolvedImage } from "@/lib/media";

type Props = {
  image: ResolvedImage;
  sizes: string;
  priority?: boolean;
  /** Must include a position utility (defaults to "relative") */
  className?: string;
  /** Show the small "drawing placeholder" tag on plates */
  tag?: boolean;
  tagTone?: "light" | "dark";
};

/** A photograph when available, otherwise the matching drawing plate. */
export function Figure({ image, sizes, priority, className = "relative", tag = true, tagTone }: Props) {
  const tone = tagTone ?? (image.plate === "facade-night" ? "dark" : "light");
  return (
    <div className={`overflow-hidden ${className}`}>
      <div data-figure-inner className="absolute inset-0 will-change-transform">
        {image.available ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
            style={{ objectPosition: image.focus ?? "50% 50%" }}
          />
        ) : (
          <ArchPlate kind={image.plate} title={`Concept drawing, not a project photograph: ${image.alt}`} />
        )}
      </div>
      {!image.available && tag && (
        // Drawing-sheet treatment: inset frame + title block, so the plate
        // reads as a conceptual study rather than documentation of a project.
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${
            tone === "dark" ? "text-paper/75 [--sheet:#191816]" : "text-graphite [--sheet:#f6f2ea]"
          }`}
        >
          <span className="absolute inset-3 border border-current opacity-25" />
          <span className="absolute left-3 top-3 border-b border-r border-current/25 bg-[var(--sheet)] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em]">
            Concept study
          </span>
          <span className="absolute bottom-3 left-3 border-r border-t border-current/25 bg-[var(--sheet)] px-2.5 py-1.5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em]">
            {plateLabel(image.plate)}
            <span className="block opacity-80">Not a project photograph</span>
          </span>
        </div>
      )}
    </div>
  );
}
