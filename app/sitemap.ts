import type { MetadataRoute } from "next";
import {
  getBuilds,
  getGuides,
  getHeroClasses,
  getHeroes,
} from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

// Required for `output: "export"` (Cloudflare Pages static hosting).
export const dynamic = "force-static";

/** Parse an ISO-ish date string to a Date, falling back to `now`. */
function toDate(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const heroes = getHeroes().map((hero) => ({
    url: absoluteUrl(`/heroes/${hero.slug}`),
    lastModified: toDate(hero.updatedAt, now),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const builds = getBuilds().map((build) => ({
    url: absoluteUrl(`/builds/${build.slug}`),
    lastModified: toDate(build.updatedAt, now),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const guides = getGuides().map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    lastModified: toDate(guide.updatedAt, now),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const classes = getHeroClasses().map((heroClass) => ({
    url: absoluteUrl(`/classes/${heroClass.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Stable site-wide date proxy for hub/static pages: newest content date, so
  // deploys that don't change content don't churn every lastmod (avoids noise).
  const contentDates = [...heroes, ...builds, ...guides].map(
    (entry) => entry.lastModified as Date,
  );
  const latestContentDate = contentDates.reduce(
    (max, d) => (d > max ? d : max),
    new Date(0),
  );
  const siteDate = latestContentDate.getTime() > 0 ? latestContentDate : now;

  // Keywords (/keywords, /keywords/[tag]) are omitted: useful in-app hubs, but
  // low standalone search intent. /search is a client-side utility page and is
  // noindex, so it is excluded here too. Per-relic and per-item detail pages
  // are excluded because they are thin, noindex,follow pages; their /relics and
  // /items hubs remain below.
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/heroes",
    "/relics",
    "/items",
    "/classes",
    "/builds",
    "/guides",
    "/tier-list",
    "/about",
    "/privacy",
    "/terms",
    "/copyright",
    "/contact",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: siteDate,
    changeFrequency:
      path === "/" || path === "/heroes" || path === "/tier-list"
        ? ("weekly" as const)
        : ("monthly" as const),
    priority:
      path === "/"
        ? 1
        : path === "/tier-list"
          ? 0.95
          : path === "/heroes"
            ? 0.9
            : path === "/about" ||
                path === "/privacy" ||
                path === "/terms" ||
                path === "/copyright" ||
                path === "/contact"
              ? 0.3
              : 0.8,
  }));

  return [
    ...staticRoutes,
    ...heroes,
    ...classes,
    ...builds,
    ...guides,
  ];
}
