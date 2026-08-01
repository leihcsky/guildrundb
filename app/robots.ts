import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";
import { absoluteUrl } from "@/lib/seo";

// Required for `output: "export"` (Cloudflare Pages static hosting).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url.replace(/\/+$/, ""),
  };
}
