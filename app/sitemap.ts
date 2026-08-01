import type { MetadataRoute } from "next";
import {
  getBuilds,
  getGuides,
  getHeroClasses,
  getHeroes,
  getItems,
  getRelics,
} from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

// Required for `output: "export"` (Cloudflare Pages static hosting).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Keywords (/keywords, /keywords/[tag]) are omitted: useful in-app hubs,
  // but low standalone search intent vs heroes/relics/items/guides.
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/heroes",
    "/relics",
    "/items",
    "/classes",
    "/builds",
    "/guides",
    "/search",
    "/about",
    "/privacy",
    "/terms",
    "/copyright",
    "/contact",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency:
      path === "/" || path === "/heroes" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/search" ? 0.4 : 0.8,
  }));

  const heroes = getHeroes().map((hero) => ({
    url: absoluteUrl(`/heroes/${hero.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const relics = getRelics().map((relic) => ({
    url: absoluteUrl(`/relics/${relic.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const items = getItems().map((item) => ({
    url: absoluteUrl(`/items/${item.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const classes = getHeroClasses().map((heroClass) => ({
    url: absoluteUrl(`/classes/${heroClass.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const builds = getBuilds().map((build) => ({
    url: absoluteUrl(`/builds/${build.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const guides = getGuides().map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...heroes,
    ...relics,
    ...items,
    ...classes,
    ...builds,
    ...guides,
  ];
}
