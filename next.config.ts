import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Cloudflare Pages static hosting (produces /out).
  output: "export",
  images: {
    // next/image optimizer is not available on static export / CF Pages.
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
