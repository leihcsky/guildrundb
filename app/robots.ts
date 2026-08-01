import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";

// Required for `output: "export"` (Cloudflare Pages static hosting).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
