import fs from "node:fs";
import path from "node:path";
import type { SiteImage } from "@/content/site";

export type ResolvedImage = SiteImage & { available: boolean };

/**
 * Checks at build/render time whether a photograph exists in /public.
 * Missing photographs fall back to the drawing plate named in the content.
 */
export function resolveImage(img: SiteImage): ResolvedImage {
  const file = path.join(process.cwd(), "public", img.src);
  return { ...img, available: fs.existsSync(file) };
}
