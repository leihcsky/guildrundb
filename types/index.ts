export type HeroClass = string;
export type HeroRole = string;
export type RelicRarity = string;
export type RelicType = string;
export type ItemType = string;

export interface Ability {
  name: string;
  description: string;
  cooldown?: string;
  image?: string;
}

export interface HeroSpecialization {
  id: string;
  slug: string;
  name: string;
  /** Linked passive description when names match a hero passive. */
  description?: string;
  image?: string;
}

export type HeroRank = "C" | "B" | "A" | "S";

export interface HeroRankArt {
  rank: HeroRank;
  label: string;
  summary: string;
  image: string;
  hasImage: boolean;
}

export interface Hero {
  id: string;
  slug: string;
  name: string;
  class: HeroClass;
  classSlug: string;
  classSlugs: string[];
  role: HeroRole;
  image: string;
  /** Prefer half-body / cropped Rank C art for detail hero headers. */
  portraitImage: string;
  overview: string;
  stats: Record<string, number | string>;
  ranks: HeroRankArt[];
  passive: string;
  abilities: Ability[];
  activeAbility?: GameAbility;
  passiveAbilities: GameAbility[];
  specializations: HeroSpecialization[];
  recommendedRelics: string[];
  recommendedItems: string[];
  recommendedBuilds: string[];
  tips?: string[];
  relatedHeroes?: string[];
  featured?: boolean;
  updatedAt: string;
  hasImage: boolean;
  tags: string[];
}

export interface Relic {
  id: string;
  slug: string;
  name: string;
  rarity: RelicRarity;
  type: RelicType;
  image: string;
  effect: string;
  unlock?: string;
  bestHeroes?: string[];
  bestBuilds?: string[];
  relatedRelics?: string[];
  featured?: boolean;
  updatedAt: string;
  hasImage: boolean;
  tags: string[];
}

export interface Item {
  id: string;
  slug: string;
  name: string;
  type: ItemType;
  image: string;
  stats: string;
  source?: string;
  recommendedHeroes?: string[];
  featured?: boolean;
  updatedAt: string;
  hasImage: boolean;
  tags: string[];
}

export interface GameAbility {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  kind: "active" | "passive";
  hasImage: boolean;
  tags: string[];
}

export interface HeroClassInfo {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  hasImage: boolean;
  tags: string[];
  mechanics: string[];
}

export interface MechanicIndexEntry {
  id: string;
  label: string;
  category: string;
  summary: string;
  classSlug?: string;
  relicCount: number;
  abilityCount: number;
  classCount: number;
}

export interface Build {
  slug: string;
  title: string;
  overview: string;
  /** When this comp is a good pickup for the current run. */
  goal?: string;
  heroes: string[];
  /** Optional flex / substitute hero slugs if the core pick is missing. */
  flexHeroes?: string[];
  relics: string[];
  items: string[];
  /** Combat keywords this engine wants to stack. */
  keywords?: string[];
  playstyle?: string;
  /** Front / back placement notes. */
  positioning?: string;
  /** Short opening → spike → finish steps. */
  gameplan?: string[];
  tips?: string[];
  strength?: string[];
  weakness?: string[];
  /** Demo / patch label, e.g. Demo 0.5.5 */
  patch?: string;
  featured?: boolean;
  updatedAt: string;
  /** GSC hero for "{name} build guildrun" — defaults to first core hero. */
  seoPrimaryHero?: string;
  /** Override meta title (keep short; site name appended automatically). */
  seoTitle?: string;
  /** Override meta description (~150 chars). */
  seoDescription?: string;
  /** Optional on-page H1; defaults to "Guildrun {Hero} Build". */
  seoHeading?: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  content: string;
  updatedAt: string;
  tags?: string[];
}

export type HeroTierGrade = "S" | "A" | "B" | "C" | "D";

export interface TierListEntry {
  heroSlug: string;
  tier: HeroTierGrade;
  rank: number;
  role: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  bestModes: string[];
  recommendedBuildSlug?: string | null;
}

export interface BuildTierEntry {
  buildSlug: string;
  tier: HeroTierGrade;
  rank: number;
  summary: string;
  whyTier: string;
  bestFor: string[];
}

export interface TierListMeta {
  version: string;
  updatedAt: string;
  intro: string;
  /** Short note for the latest ranking change (shown on-page). */
  changelog?: string;
  methodology: string[];
  faq: Array<{ question: string; answer: string }>;
  /** Primary meta: ranked team builds. */
  buildEntries?: BuildTierEntry[];
  /** Secondary: individual hero power rankings. */
  entries: TierListEntry[];
}

/** Resolved tier row with live Hero + optional Build. */
export interface ResolvedTierListEntry extends TierListEntry {
  hero: Hero;
  recommendedBuild?: Build;
}

/** Resolved build-tier row with live Build + roster/item/relic snapshots. */
export interface ResolvedBuildTierEntry extends BuildTierEntry {
  build: Build;
  heroes: Hero[];
  flexHeroes: Hero[];
  items: Item[];
  relics: Relic[];
}

export type SearchEntityType =
  | "hero"
  | "relic"
  | "item"
  | "build"
  | "guide"
  | "keyword"
  | "class";

export interface SearchResult {
  type: SearchEntityType;
  slug: string;
  name: string;
  description: string;
  href: string;
  meta?: string;
}
