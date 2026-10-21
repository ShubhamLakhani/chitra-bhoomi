import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev badge so local reviews match production.
  devIndicators: false,
  // Lets a production build run beside `next dev` without sharing `.next`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
