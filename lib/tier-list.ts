import fs from "fs";
import path from "path";
import type {
  BuildTierEntry,
  Hero,
  HeroTierGrade,
  ResolvedBuildTierEntry,
  ResolvedTierListEntry,
  TierListEntry,
  TierListMeta,
} from "@/types";
import {
  getBuildBySlug,
  getHeroBySlug,
  getHeroes,
  resolveHeroesBySlugs,
  resolveItemsBySlugs,
  resolveRelicsBySlugs,
} from "@/lib/data";

const TIER_ORDER: HeroTierGrade[] = ["S", "A", "B", "C", "D"];

let cachedMeta: TierListMeta | null = null;

function loadTierListMeta(): TierListMeta {
  if (cachedMeta) return cachedMeta;
  const filePath = path.join(process.cwd(), "content/meta/tier-list.json");
  let text = fs.readFileSync(filePath, "utf-8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const raw = JSON.parse(text) as TierListMeta;
  cachedMeta = raw;
  return raw;
}

export function getTierListMeta(): TierListMeta {
  return loadTierListMeta();
}

export function getTierGrades(): HeroTierGrade[] {
  return [...TIER_ORDER];
}

function resolveEntry(entry: TierListEntry): ResolvedTierListEntry | null {
  const hero = getHeroBySlug(entry.heroSlug);
  if (!hero) return null;
  const recommendedBuild = entry.recommendedBuildSlug
    ? getBuildBySlug(entry.recommendedBuildSlug)
    : undefined;
  return {
    ...entry,
    hero,
    recommendedBuild: recommendedBuild ?? undefined,
  };
}

function resolveBuildEntry(
  entry: BuildTierEntry,
): ResolvedBuildTierEntry | null {
  const build = getBuildBySlug(entry.buildSlug);
  if (!build) return null;
  return {
    ...entry,
    build,
    heroes: resolveHeroesBySlugs(build.heroes),
    flexHeroes: resolveHeroesBySlugs(build.flexHeroes ?? []),
    items: resolveItemsBySlugs(build.items),
    relics: resolveRelicsBySlugs(build.relics),
  };
}

/** All ranked heroes, sorted by rank ascending. */
export function getTierListEntries(): ResolvedTierListEntry[] {
  return loadTierListMeta()
    .entries.map(resolveEntry)
    .filter((entry): entry is ResolvedTierListEntry => Boolean(entry))
    .sort((a, b) => a.rank - b.rank);
}

/** Ranked team builds for the primary tier-list section. */
export function getBuildTierEntries(): ResolvedBuildTierEntry[] {
  const entries = loadTierListMeta().buildEntries ?? [];
  return entries
    .map(resolveBuildEntry)
    .filter((entry): entry is ResolvedBuildTierEntry => Boolean(entry))
    .sort((a, b) => a.rank - b.rank);
}

export function getBuildTierByTier(): Record<
  HeroTierGrade,
  ResolvedBuildTierEntry[]
> {
  const grouped = Object.fromEntries(
    TIER_ORDER.map((tier) => [tier, [] as ResolvedBuildTierEntry[]]),
  ) as Record<HeroTierGrade, ResolvedBuildTierEntry[]>;

  for (const entry of getBuildTierEntries()) {
    grouped[entry.tier].push(entry);
  }
  return grouped;
}

export function getTierListByTier(): Record<
  HeroTierGrade,
  ResolvedTierListEntry[]
> {
  const grouped = Object.fromEntries(
    TIER_ORDER.map((tier) => [tier, [] as ResolvedTierListEntry[]]),
  ) as Record<HeroTierGrade, ResolvedTierListEntry[]>;

  for (const entry of getTierListEntries()) {
    grouped[entry.tier].push(entry);
  }
  return grouped;
}

export function getHeroTierEntry(
  heroSlug: string,
): ResolvedTierListEntry | undefined {
  return getTierListEntries().find((entry) => entry.heroSlug === heroSlug);
}

/** Heroes present in the roster but missing from the tier JSON (debug aid). */
export function getUnrankedHeroes(): Hero[] {
  const ranked = new Set(getTierListEntries().map((e) => e.heroSlug));
  return getHeroes().filter((hero) => !ranked.has(hero.slug));
}
