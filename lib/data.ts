import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type {
  Build,
  GameAbility,
  Guide,
  Hero,
  HeroClassInfo,
  HeroRank,
  HeroRankArt,
  HeroSpecialization,
  Item,
  MechanicIndexEntry,
  Relic,
  SearchResult,
} from "@/types";
import {
  buildHeroAssociations,
  resolveActiveAbilityId,
  type HeroAssociationBundle,
} from "@/lib/hero-links";
import {
  extractTags,
  getCuratedTagIds,
  getTagDefinition,
  resolveTagMeta,
} from "@/lib/tags";
import {
  resolveDescription,
  type BalancingLike,
} from "@/lib/description";
import {
  buildItemDisplayText,
  buildRelicDisplayText,
  runtimeTitle,
} from "@/lib/balancing-text";
import { ADJACENT_GUIDE } from "@/lib/adjacent-meta";
import { RED_RIFT_GUIDE } from "@/lib/red-rift-meta";

/**
 * Data access layer.
 * Raw Unity/dat dumps under /content are normalized into UI-facing English models.
 * Chinese fields (*Zh) are intentionally ignored for display.
 */

const contentDir = path.join(process.cwd(), "content");
const guidesDir = path.join(contentDir, "guides");
const PLACEHOLDER_IMAGE = "/brand/logo-mark.svg";
const DEFAULT_UPDATED_AT = "2026-07-26";

type RawImages = {
  portrait?: string;
  icon?: string;
  cropped?: Record<string, string>;
  halfBody?: Record<string, string>;
  frameBreak?: Record<string, string>;
};

type RawHero = {
  id: number | string;
  slug?: string;
  name?: string;
  nameZh?: string;
  class?: string;
  role?: string;
  overview?: string;
  image?: string;
  images?: RawImages;
  stats?: Record<string, number | string>;
  passive?: string;
  abilities?: Hero["abilities"];
  recommendedRelics?: string[];
  recommendedItems?: string[];
  recommendedBuilds?: string[];
  tips?: string[];
  relatedHeroes?: string[];
  featured?: boolean;
  updatedAt?: string;
};

type RawRelic = {
  id: number | string;
  slug?: string;
  name?: string;
  nameZh?: string;
  rarity?: number | string;
  rarityName?: string;
  type?: string;
  effect?: string;
  description?: string;
  descriptionZh?: string;
  balancing?: BalancingLike;
  image?: string;
  images?: RawImages;
  unlock?: string;
  bestHeroes?: string[];
  bestBuilds?: string[];
  relatedRelics?: string[];
  featured?: boolean;
  updatedAt?: string;
};

type RawItem = {
  id: number | string;
  slug?: string;
  name?: string;
  nameZh?: string;
  type?: string;
  stats?: string;
  description?: string;
  descriptionZh?: string;
  balancing?: BalancingLike;
  image?: string;
  images?: RawImages;
  source?: string;
  recommendedHeroes?: string[];
  featured?: boolean;
  updatedAt?: string;
};

function readJson<T>(filename: string): T {
  const filePath = path.join(contentDir, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

/** English display name only — never fall back to Chinese. */
function englishName(name: string | undefined, fallback: string) {
  const value = name?.trim();
  return value || fallback;
}

/**
 * Convert game markup to readable English text.
 * Example: "[Warrior's]<warrior> [Rush]<rush>" → "Warrior's Rush"
 * When balancing is provided, replaces {0}/{1} and statcalc formulas with numbers.
 */
export function formatGameText(
  input: string | undefined | null,
  balancing?: BalancingLike,
): string {
  if (!input) return "";

  const withValues = resolveDescription(input, balancing);

  return withValues
    .replace(/\[([^\]]+)\]<[^>]+>/g, "$1")
    .replace(/\\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function toSlug(value: string, fallbackId: string | number) {
  const base = value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base ? `${base}-${fallbackId}` : `entry-${fallbackId}`;
}

function resolveImage(
  raw: { image?: string; images?: RawImages },
  prefer: "portrait" | "icon" = "icon",
): { src: string; hasImage: boolean } {
  const candidates =
    prefer === "portrait"
      ? [
          raw.image,
          raw.images?.portrait,
          raw.images?.icon,
          raw.images?.cropped?.A,
          raw.images?.cropped?.S,
          raw.images?.halfBody?.A,
        ]
      : [
          raw.image,
          raw.images?.icon,
          raw.images?.portrait,
          raw.images?.cropped?.A,
          raw.images?.cropped?.S,
        ];

  const src = candidates.find((value) => Boolean(value?.trim()))?.trim();
  if (!src) return { src: PLACEHOLDER_IMAGE, hasImage: false };
  return { src, hasImage: true };
}

function mapRarity(raw: RawRelic): string {
  if (raw.rarityName?.trim()) return raw.rarityName.trim();
  if (typeof raw.rarity === "string" && raw.rarity.trim()) return raw.rarity.trim();
  switch (raw.rarity) {
    case 1:
      return "Common";
    case 2:
      return "Rare";
    case 3:
      return "Epic";
    case 4:
      return "Unique";
    default:
      return "";
  }
}

type RawPassiveAbility = RawAbility & {
  targetHero?: string;
};

type RawHeroSpecialization = {
  id: number | string;
  name?: string;
};

let associationCache: HeroAssociationBundle | null = null;

function getHeroAssociations(): HeroAssociationBundle {
  if (associationCache) return associationCache;

  const rawHeroes = readJson<RawHero[]>("heroes.json");
  const rawPassives = readJson<RawPassiveAbility[]>("passiveAbilities.json");
  const rawSpecs = readJson<RawHeroSpecialization[]>("heroSpecializations.json");
  const actives = readJson<RawAbility[]>("activeAbilities.json").map((row) =>
    normalizeAbility(row, "active"),
  );
  const passives = rawPassives.map((row) => normalizeAbility(row, "passive"));

  associationCache = buildHeroAssociations(
    rawHeroes,
    actives,
    passives,
    rawPassives,
    rawSpecs,
  );

  return associationCache;
}

function pickImage(...candidates: Array<string | undefined | null>) {
  const src = candidates.find((value) => Boolean(value?.trim()))?.trim();
  if (!src) return { src: PLACEHOLDER_IMAGE, hasImage: false };
  return { src, hasImage: true };
}

const RANK_META: Array<{
  rank: HeroRank;
  label: string;
  summary: string;
}> = [
  {
    rank: "C",
    label: "Rank C",
    summary: "Base kit — the active ability is equipped and the starting stat line applies.",
  },
  {
    rank: "B",
    label: "Rank B",
    summary:
      "First rank-up — choose one of three fixed specializations. Some paths add a class.",
  },
  {
    rank: "A",
    label: "Rank A",
    summary:
      "Draft a class modifier from the active class pool after taking the Rank A stat package.",
  },
  {
    rank: "S",
    label: "Rank S",
    summary:
      "Demo max — take the final stat package and draft the last class modifier.",
  },
];

function resolveHeroRanks(raw: RawHero): HeroRankArt[] {
  const cropped = raw.images?.cropped ?? {};
  const halfBody = raw.images?.halfBody ?? {};
  const frameBreak = raw.images?.frameBreak ?? {};

  return RANK_META.map((meta) => {
    const image = pickImage(
      halfBody[meta.rank],
      cropped[meta.rank],
      cropped[`${meta.rank}_Med`],
      frameBreak[meta.rank],
      raw.images?.portrait,
      raw.images?.icon,
      raw.image,
    );
    return {
      ...meta,
      image: image.src,
      hasImage: image.hasImage,
    };
  });
}

function linkSpecializations(
  specs: HeroSpecialization[],
  passives: GameAbility[],
): HeroSpecialization[] {
  return specs.map((spec) => {
    const match = passives.find(
      (passive) => passive.name.toLowerCase() === spec.name.toLowerCase(),
    );
    if (!match) return spec;
    return {
      ...spec,
      description: match.description,
      image: match.image,
    };
  });
}

function formatClassLabel(
  classSlugs: string[],
  classMap: Map<string, HeroClassInfo>,
) {
  return classSlugs
    .map((slug) => classMap.get(slug)?.name ?? slug)
    .filter(Boolean)
    .join(" / ");
}

function normalizeHero(raw: RawHero): Hero {
  const id = String(raw.id);
  const numericId = Number(raw.id);
  const name = englishName(raw.name, `Hero ${id}`);
  const slug = raw.slug || toSlug(name, id);
  const image = resolveImage(raw, "icon");
  const ranks = resolveHeroRanks(raw);
  const portraitPick = pickImage(
    raw.images?.halfBody?.C,
    raw.images?.cropped?.C,
    raw.images?.portrait,
    image.src,
  );
  const links = getHeroAssociations();
  const meta = links.metaBySlug.get(slug);
  const classMap = new Map(getHeroClasses().map((heroClass) => [heroClass.slug, heroClass]));

  const classSlugs =
    meta?.classSlugs ??
    (raw.class?.trim() ? [classSlugFromName(raw.class)] : []);
  const classSlug = classSlugs[0] ?? "";
  const classLabel =
    raw.class?.trim() || formatClassLabel(classSlugs, classMap) || "";

  const activeId = resolveActiveAbilityId(numericId, meta?.activeAbilityId);
  const activeAbility =
    activeId !== undefined ? links.activeById.get(activeId) : undefined;
  const passiveAbilities = links.passivesByHeroName.get(name) ?? [];
  const specializations = linkSpecializations(
    links.specsByHeroId.get(numericId) ?? [],
    passiveAbilities,
  );

  const tagSet = new Set<string>();
  for (const heroClassSlug of classSlugs) {
    tagSet.add(heroClassSlug);
    const heroClass = classMap.get(heroClassSlug);
    heroClass?.mechanics.forEach((tag) => tagSet.add(tag));
  }
  activeAbility?.tags.forEach((tag) => tagSet.add(tag));
  passiveAbilities.forEach((ability) =>
    ability.tags.forEach((tag) => tagSet.add(tag)),
  );

  const legacyAbilities =
    raw.abilities && raw.abilities.length > 0
      ? raw.abilities.map((ability) => ({
          ...ability,
          name: englishName(ability.name, "Ability"),
          description: formatGameText(ability.description),
        }))
      : [
          ...(activeAbility
            ? [
                {
                  name: activeAbility.name,
                  description: activeAbility.description,
                  image: activeAbility.image,
                },
              ]
            : []),
          ...passiveAbilities.map((ability) => ({
            name: ability.name,
            description: ability.description,
            image: ability.image,
          })),
        ];

  const basePassive =
    passiveAbilities[0]?.description || formatGameText(raw.passive);

  return {
    id,
    slug,
    name,
    class: classLabel,
    classSlug,
    classSlugs,
    role: meta?.role?.trim() || raw.role?.trim() || "",
    image: image.src,
    portraitImage: portraitPick.src,
    hasImage: image.hasImage || portraitPick.hasImage,
    overview:
      formatGameText(raw.overview) ||
      meta?.role?.trim() ||
      `${name} is a Guildrun hero. Explore their class, abilities, and synergies below.`,
    stats: raw.stats ?? {},
    ranks,
    passive: basePassive,
    abilities: legacyAbilities,
    activeAbility,
    passiveAbilities,
    specializations,
    recommendedRelics: raw.recommendedRelics ?? [],
    recommendedItems: raw.recommendedItems ?? [],
    recommendedBuilds: raw.recommendedBuilds ?? [],
    tips: raw.tips,
    relatedHeroes: raw.relatedHeroes,
    featured: raw.featured,
    updatedAt: raw.updatedAt || DEFAULT_UPDATED_AT,
    tags: [...tagSet],
  };
}

function normalizeRelic(raw: RawRelic): Relic {
  const id = String(raw.id);
  const name = englishName(
    raw.name || runtimeTitle(raw.balancing),
    `Relic ${id}`,
  );
  const image = resolveImage(raw, "icon");
  const sourceText = buildRelicDisplayText(raw);

  return {
    id,
    slug: raw.slug || toSlug(name, id),
    name,
    rarity: mapRarity(raw),
    type: raw.type?.trim() || "",
    image: image.src,
    hasImage: image.hasImage,
    // English description only — never descriptionZh
    effect: formatGameText(sourceText, raw.balancing),
    unlock: raw.unlock,
    bestHeroes: raw.bestHeroes,
    bestBuilds: raw.bestBuilds,
    relatedRelics: raw.relatedRelics,
    featured: raw.featured,
    updatedAt: raw.updatedAt || DEFAULT_UPDATED_AT,
    tags: extractTags(sourceText),
  };
}

function normalizeItem(raw: RawItem): Item {
  const id = String(raw.id);
  const name = englishName(
    raw.name || runtimeTitle(raw.balancing),
    `Item ${id}`,
  );
  const image = resolveImage(raw, "icon");
  const sourceText = buildItemDisplayText(raw);

  return {
    id,
    slug: raw.slug || toSlug(name, id),
    name,
    type: raw.type?.trim() || "Item",
    image: image.src,
    hasImage: image.hasImage,
    stats: formatGameText(sourceText, raw.balancing),
    source: raw.source,
    recommendedHeroes: raw.recommendedHeroes,
    featured: raw.featured,
    updatedAt: raw.updatedAt || DEFAULT_UPDATED_AT,
    tags: extractTags(sourceText),
  };
}

type RawAbility = {
  id: number | string;
  name?: string;
  description?: string;
  balancing?: BalancingLike;
  images?: RawImages;
  image?: string;
};

type RawHeroClass = {
  id: number | string;
  name?: string;
  description?: string;
  images?: RawImages;
  image?: string;
};

function normalizeAbility(
  raw: RawAbility,
  kind: "active" | "passive",
): GameAbility {
  const id = String(raw.id);
  const name = englishName(raw.name, `Ability ${id}`);
  const image = resolveImage(raw, "icon");
  const sourceText = raw.description || "";

  return {
    id,
    slug: toSlug(name, id),
    name,
    description: formatGameText(sourceText, raw.balancing),
    image: image.src,
    hasImage: image.hasImage,
    kind,
    tags: extractTags(sourceText),
  };
}

function classSlugFromName(name: string) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeHeroClass(raw: RawHeroClass): HeroClassInfo {
  const id = String(raw.id);
  const name = englishName(raw.name, `Class ${id}`);
  const image = resolveImage(raw, "icon");
  const sourceText = raw.description || "";
  const tags = extractTags(sourceText);
  const slug = classSlugFromName(name) || `class-${id}`;

  return {
    id,
    slug,
    name,
    description: formatGameText(sourceText),
    image: image.src,
    hasImage: image.hasImage,
    tags,
    mechanics: tags.filter((tag) => tag !== slug),
  };
}

export function getHeroes(): Hero[] {
  return readJson<RawHero[]>("heroes.json")
    .map(normalizeHero)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getHeroBySlug(slug: string): Hero | undefined {
  return getHeroes().find((hero) => hero.slug === slug);
}

export function getFeaturedHeroes(limit = 6): Hero[] {
  const heroes = getHeroes();
  const featured = heroes.filter((hero) => hero.featured);
  if (featured.length > 0) return featured.slice(0, limit);

  const withImages = heroes.filter((hero) => hero.hasImage);
  return (withImages.length > 0 ? withImages : heroes).slice(0, limit);
}

export function getRelics(): Relic[] {
  return readJson<RawRelic[]>("relics.json")
    .map(normalizeRelic)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getRelicBySlug(slug: string): Relic | undefined {
  return getRelics().find((relic) => relic.slug === slug);
}

export function getFeaturedRelics(limit = 6): Relic[] {
  const relics = getRelics();
  const featured = relics.filter((relic) => relic.featured);
  if (featured.length > 0) return featured.slice(0, limit);

  const withImages = relics.filter((relic) => relic.hasImage);
  return (withImages.length > 0 ? withImages : relics).slice(0, limit);
}

export function getItems(): Item[] {
  return readJson<RawItem[]>("items.json")
    .map(normalizeItem)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getItemBySlug(slug: string): Item | undefined {
  return getItems().find((item) => item.slug === slug);
}

export function getActiveAbilities(): GameAbility[] {
  return readJson<RawAbility[]>("activeAbilities.json").map((row) =>
    normalizeAbility(row, "active"),
  );
}

export function getPassiveAbilities(): GameAbility[] {
  return readJson<RawAbility[]>("passiveAbilities.json").map((row) =>
    normalizeAbility(row, "passive"),
  );
}

export function getAbilities(): GameAbility[] {
  return [...getActiveAbilities(), ...getPassiveAbilities()].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function getHeroClasses(): HeroClassInfo[] {
  return readJson<RawHeroClass[]>("heroClasses.json")
    .map(normalizeHeroClass)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getHeroClassBySlug(slug: string): HeroClassInfo | undefined {
  return getHeroClasses().find((heroClass) => heroClass.slug === slug);
}

export function getItemsByTag(tag: string, limit = 24): Item[] {
  const normalized = tag.toLowerCase();
  return getItems()
    .filter((item) => item.tags.includes(normalized))
    .sort(
      (a, b) =>
        Number(b.hasImage) - Number(a.hasImage) || a.name.localeCompare(b.name),
    )
    .slice(0, limit);
}

export function getSynergyItems(item: Item, limit = 6): Item[] {
  if (item.tags.length === 0) return [];

  const scored = getItems()
    .filter((entry) => entry.slug !== item.slug)
    .map((entry) => {
      const overlap = entry.tags.filter((tag) => item.tags.includes(tag)).length;
      return { entry, overlap };
    })
    .filter((row) => row.overlap > 0)
    .sort(
      (a, b) =>
        b.overlap - a.overlap ||
        Number(b.entry.hasImage) - Number(a.entry.hasImage) ||
        a.entry.name.localeCompare(b.entry.name),
    );

  return scored.slice(0, limit).map((row) => row.entry);
}

/** Relics that share combat / class tags with an item. */
export function getItemRelatedRelics(item: Item, limit = 6): Relic[] {
  if (item.tags.length === 0) return [];

  const scored = getRelics()
    .map((relic) => {
      const overlap = relic.tags.filter((tag) => item.tags.includes(tag)).length;
      return { relic, overlap };
    })
    .filter((entry) => entry.overlap > 0)
    .sort(
      (a, b) =>
        b.overlap - a.overlap ||
        Number(b.relic.hasImage) - Number(a.relic.hasImage) ||
        a.relic.name.localeCompare(b.relic.name),
    );

  return scored.slice(0, limit).map((entry) => entry.relic);
}

/** Heroes whose class matches class tags on an item (e.g. warrior, mystic). */
export function getItemRelatedHeroes(item: Item, limit = 6): Hero[] {
  const classTags = item.tags.filter((tag) =>
    getHeroClasses().some((heroClass) => heroClass.slug === tag),
  );
  if (classTags.length === 0) return [];

  const seen = new Set<string>();
  const related: Hero[] = [];

  for (const tag of classTags) {
    for (const hero of getHeroesByClassSlug(tag)) {
      if (seen.has(hero.slug)) continue;
      seen.add(hero.slug);
      related.push(hero);
      if (related.length >= limit) return related;
    }
  }

  return related;
}

export function getRelicsByTag(tag: string, limit = 24): Relic[] {
  const normalized = tag.toLowerCase();
  return getRelics()
    .filter((relic) => relic.tags.includes(normalized))
    .sort((a, b) => {
      const rarityScore = (value: string) =>
        ({ Unique: 5, Legendary: 4, Epic: 3, Rare: 2, Common: 1 }[value] ?? 0);
      return rarityScore(b.rarity) - rarityScore(a.rarity) || a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

export function getAbilitiesByTag(tag: string, limit = 24): GameAbility[] {
  const normalized = tag.toLowerCase();
  return getAbilities()
    .filter((ability) => ability.tags.includes(normalized))
    .slice(0, limit);
}

export function getClassesByTag(tag: string): HeroClassInfo[] {
  const normalized = tag.toLowerCase();
  return getHeroClasses().filter(
    (heroClass) =>
      heroClass.slug === normalized ||
      heroClass.tags.includes(normalized) ||
      heroClass.mechanics.includes(normalized),
  );
}

export function getSynergyRelics(relic: Relic, limit = 6): Relic[] {
  if (relic.tags.length === 0) return [];

  const scored = getRelics()
    .filter((item) => item.slug !== relic.slug)
    .map((item) => {
      const overlap = item.tags.filter((tag) => relic.tags.includes(tag)).length;
      return { item, overlap };
    })
    .filter((entry) => entry.overlap > 0)
    .sort(
      (a, b) =>
        b.overlap - a.overlap ||
        Number(b.item.hasImage) - Number(a.item.hasImage) ||
        a.item.name.localeCompare(b.item.name),
    );

  return scored.slice(0, limit).map((entry) => entry.item);
}

export function getHeroesByClassSlug(classSlug: string): Hero[] {
  const normalized = classSlug.toLowerCase();
  return getHeroes().filter(
    (hero) =>
      hero.classSlug === normalized || hero.classSlugs.includes(normalized),
  );
}

/** Relics that overlap a hero's class tags and ability mechanics. */
export function getHeroSynergyRelics(hero: Hero, limit = 6): Relic[] {
  const priorityTags = [...new Set([...hero.classSlugs, ...hero.tags])];
  if (priorityTags.length === 0) return getFeaturedRelics(limit);

  const scored = getRelics()
    .map((relic) => {
      const overlap = relic.tags.filter((tag) => priorityTags.includes(tag)).length;
      const classBoost = hero.classSlugs.some((slug) => relic.tags.includes(slug))
        ? 2
        : 0;
      return { relic, score: overlap + classBoost };
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.relic.hasImage) - Number(a.relic.hasImage) ||
        a.relic.name.localeCompare(b.relic.name),
    );

  const picked = scored.slice(0, limit).map((entry) => entry.relic);
  return picked.length > 0 ? picked : getFeaturedRelics(limit);
}

export function getMechanicsIndex(): MechanicIndexEntry[] {
  const curated = getCuratedTagIds();
  const relics = getRelics();
  const abilities = getAbilities();
  const classes = getHeroClasses();

  return curated
    .map((id) => {
      const meta = resolveTagMeta(id);
      const definition = getTagDefinition(id);
      return {
        id,
        label: meta.label,
        category: meta.category,
        summary: meta.summary,
        classSlug: definition?.classSlug,
        relicCount: relics.filter((relic) => relic.tags.includes(id)).length,
        abilityCount: abilities.filter((ability) => ability.tags.includes(id)).length,
        classCount: classes.filter(
          (heroClass) =>
            heroClass.slug === id ||
            heroClass.tags.includes(id) ||
            heroClass.mechanics.includes(id),
        ).length,
      } satisfies MechanicIndexEntry;
    })
    .filter(
      (entry) =>
        entry.relicCount > 0 || entry.abilityCount > 0 || entry.classCount > 0,
    )
    .sort((a, b) => b.relicCount - a.relicCount || a.label.localeCompare(b.label));
}

export function getMechanicById(id: string): MechanicIndexEntry | undefined {
  return getMechanicsIndex().find((entry) => entry.id === id);
}

export function getFeaturedMechanics(limit = 8): MechanicIndexEntry[] {
  return getMechanicsIndex()
    .filter((entry) => entry.category === "combat")
    .slice(0, limit);
}

export function getBuilds(): Build[] {
  if (!fs.existsSync(path.join(contentDir, "builds.json"))) return [];
  return readJson<Build[]>("builds.json");
}

export function getBuildBySlug(slug: string): Build | undefined {
  return getBuilds().find((build) => build.slug === slug);
}

const SYNTHETIC_GUIDES = [ADJACENT_GUIDE, RED_RIFT_GUIDE];
const SYNTHETIC_SLUGS = new Set(SYNTHETIC_GUIDES.map((guide) => guide.slug));

export function getGuides(): Guide[] {
  if (!fs.existsSync(guidesDir)) {
    return [...SYNTHETIC_GUIDES];
  }

  const files = fs.readdirSync(guidesDir).filter((file) => file.endsWith(".md"));

  const fromMarkdown = files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(guidesDir, file), "utf-8");
      const { data, content } = matter(raw);

      return {
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        content,
        updatedAt: String(data.updatedAt ?? new Date().toISOString()),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      } satisfies Guide;
    })
    .filter((guide) => !SYNTHETIC_SLUGS.has(guide.slug));

  return [...fromMarkdown, ...SYNTHETIC_GUIDES].sort(
    (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt),
  );
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return getGuides().find((guide) => guide.slug === slug);
}

export function getLatestGuides(limit = 3): Guide[] {
  return getGuides().slice(0, limit);
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export function getSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const hero of getHeroes()) {
    results.push({
      type: "hero",
      slug: hero.slug,
      name: hero.name,
      description: hero.overview,
      href: `/heroes/${hero.slug}`,
      meta: [hero.class, hero.role].filter(Boolean).join(" · ") || "Hero",
    });
  }

  for (const relic of getRelics()) {
    results.push({
      type: "relic",
      slug: relic.slug,
      name: relic.name,
      description: relic.effect,
      href: `/relics/${relic.slug}`,
      meta: [relic.rarity, relic.type].filter(Boolean).join(" · ") || "Relic",
    });
  }

  for (const item of getItems()) {
    results.push({
      type: "item",
      slug: item.slug,
      name: item.name,
      description: item.stats,
      href: `/items/${item.slug}`,
      meta: item.type || "Item",
    });
  }

  for (const build of getBuilds()) {
    results.push({
      type: "build",
      slug: build.slug,
      name: build.title,
      description: build.overview,
      href: `/builds/${build.slug}`,
    });
  }

  for (const guide of getGuides()) {
    results.push({
      type: "guide",
      slug: guide.slug,
      name: guide.title,
      description: guide.description,
      href: `/guides/${guide.slug}`,
    });
  }

  for (const keyword of getMechanicsIndex()) {
    results.push({
      type: "keyword",
      slug: keyword.id,
      name: keyword.label,
      description: keyword.summary,
      href: `/keywords/${keyword.id}`,
      meta: keyword.category,
    });
  }

  for (const heroClass of getHeroClasses()) {
    results.push({
      type: "class",
      slug: heroClass.slug,
      name: heroClass.name,
      description: heroClass.description,
      href: `/classes/${heroClass.slug}`,
      meta: "Class",
    });
  }

  return results;
}

export function searchAll(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return getSearchIndex().filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.meta?.toLowerCase().includes(q) ?? false),
  );
}

export type DataStatEntry = {
  label: string;
  count: number;
  href: string;
  description: string;
};

export function getDataStats(): DataStatEntry[] {
  const index = readJson<{
    collections: Record<string, { count: number }>;
  }>("index.json");

  const collection = (key: string) => index.collections[key]?.count ?? 0;

  return [
    {
      label: "Heroes",
      count: collection("heroes"),
      href: "/heroes",
      description: "Classes, abilities, and specializations",
    },
    {
      label: "Relics",
      count: collection("relics"),
      href: "/relics",
      description: "Effects, rarity, and synergies",
    },
    {
      label: "Items",
      count: collection("items"),
      href: "/items",
      description: "Stats and triggered effects",
    },
    {
      label: "Classes",
      count: collection("heroClasses"),
      href: "/classes",
      description: "Warrior, Mage, Assassin, and more",
    },
    {
      label: "Abilities",
      count:
        collection("activeAbilities") + collection("passiveAbilities"),
      href: "/keywords",
      description: "Active and passive skill effects",
    },
    {
      label: "Specializations",
      count: collection("heroSpecializations"),
      href: "/heroes",
      description: "Rank-up paths across the roster",
    },
    {
      label: "Builds",
      count: getBuilds().length,
      href: "/builds",
      description: "Curated team comps and playstyles",
    },
    {
      label: "Guides",
      count: getGuides().length,
      href: "/guides",
      description: "Strategy tips and getting started",
    },
  ];
}

export function resolveHeroesBySlugs(slugs: string[]): Hero[] {
  const map = new Map(getHeroes().map((hero) => [hero.slug, hero]));
  return slugs.map((slug) => map.get(slug)).filter(Boolean) as Hero[];
}

export function resolveRelicsBySlugs(slugs: string[]): Relic[] {
  const map = new Map(getRelics().map((relic) => [relic.slug, relic]));
  return slugs.map((slug) => map.get(slug)).filter(Boolean) as Relic[];
}

export function resolveItemsBySlugs(slugs: string[]): Item[] {
  const map = new Map(getItems().map((item) => [item.slug, item]));
  return slugs.map((slug) => map.get(slug)).filter(Boolean) as Item[];
}

export function resolveBuildsBySlugs(slugs: string[]): Build[] {
  const map = new Map(getBuilds().map((build) => [build.slug, build]));
  return slugs.map((slug) => map.get(slug)).filter(Boolean) as Build[];
}
