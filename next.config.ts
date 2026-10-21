import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev badge so local reviews match production.
  devIndicators: false,
  // Serve AVIF/WebP where the browser supports them; the JPEG masters remain the fallback.
  images: { formats: ["image/avif", "image/webp"] },
  // Lets a production build run beside `next dev` without sharing `.next`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
