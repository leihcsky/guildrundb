import type { Build } from "@/types";
import { getHeroBySlug } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site.config";
import type { Metadata } from "next";

const MAX_DESC = 155;

function trimDescription(text: string, max = MAX_DESC) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

/** Primary hero slug for GSC queries like "irini build guildrun". */
export function getBuildPrimaryHeroSlug(build: Build): string | undefined {
  if (build.seoPrimaryHero) return build.seoPrimaryHero;
  return build.heroes[0];
}

/** Short SEO title (~30–45 chars before site suffix). Matches GSC "hero build guildrun" patterns. */
export function buildSeoTitle(build: Build): string {
  if (build.seoTitle?.trim()) return build.seoTitle.trim();

  const primarySlug = getBuildPrimaryHeroSlug(build);
  const hero = primarySlug ? getHeroBySlug(primarySlug) : undefined;

  if (hero) {
    return `Guildrun ${hero.name} Build`;
  }

  return `Guildrun ${build.title} Build`;
}

export function buildSeoDescription(build: Build): string {
  if (build.seoDescription?.trim()) return trimDescription(build.seoDescription.trim());

  const primarySlug = getBuildPrimaryHeroSlug(build);
  const hero = primarySlug ? getHeroBySlug(primarySlug) : undefined;
  const heroName = hero?.name ?? "team";
  const patch = build.patch ?? siteConfig.gameVersion;

  const coreNames = build.heroes
    .map((s) => getHeroBySlug(s)?.name)
    .filter(Boolean)
    .join(", ");

  return trimDescription(
    `${heroName} build for ${patch}: ${build.overview} Core heroes — ${coreNames}. Relics, items, positioning, and when to pick this Guildrun comp.`,
  );
}

/** Visible H1 — keyword-forward but readable on-page. */
export function buildPageHeading(build: Build): string {
  if (build.seoHeading?.trim()) return build.seoHeading.trim();

  const primarySlug = getBuildPrimaryHeroSlug(build);
  const hero = primarySlug ? getHeroBySlug(primarySlug) : undefined;

  if (hero) {
    return `Guildrun ${hero.name} Build`;
  }

  return build.title;
}

export function buildBuildMetadata(build: Build): Metadata {
  return buildMetadata({
    title: buildSeoTitle(build),
    description: buildSeoDescription(build),
    path: `/builds/${build.slug}`,
  });
}
