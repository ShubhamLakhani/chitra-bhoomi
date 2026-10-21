import Image from "next/image";
import { site } from "@/content/site";

/**
 * Official Chitra Bhoomi wordmark (dark ink + orange on transparent).
 * It is never recoloured, so it is only placed on light surfaces.
 * Set its size with a height class; the width follows the artwork's ratio.
 */
export function Logo({ priority = false, className = "h-10" }: { priority?: boolean; className?: string }) {
  return (
    <Image
      src="/images/brand/chitra-bhoomi-wordmark-no-tagline.png"
      alt={site.name}
      width={242}
      height={80}
      priority={priority}
      // Never stretched: the box follows the artwork's ratio and the image is contained within it
      className={`w-auto max-w-none shrink-0 self-start object-contain ${className}`}
    />
  );
}
