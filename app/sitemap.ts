import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";
import {
  getBuilds,
  getGuides,
  getHeroClasses,
  getHeroes,
  getItems,
  getMechanicsIndex,
  getRelics,
} from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/heroes",
    "/relics",
    "/items",
    "/classes",
    "/builds",
    "/guides",
    "/keywords",
    "/search",
    "/about",
    "/privacy",
    "/terms",
    "/copyright",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/heroes" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/search" ? 0.4 : 0.8,
  }));

  const heroes = getHeroes().map((hero) => ({
    url: `${base}/heroes/${hero.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const relics = getRelics().map((relic) => ({
    url: `${base}/relics/${relic.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const items = getItems().map((item) => ({
    url: `${base}/items/${item.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const classes = getHeroClasses().map((heroClass) => ({
    url: `${base}/classes/${heroClass.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const builds = getBuilds().map((build) => ({
    url: `${base}/builds/${build.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const guides = getGuides().map((guide) => ({
    url: `${base}/guides/${guide.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const keywords = getMechanicsIndex().map((keyword) => ({
    url: `${base}/keywords/${keyword.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...heroes,
    ...relics,
    ...items,
    ...classes,
    ...builds,
    ...guides,
    ...keywords,
  ];
}
