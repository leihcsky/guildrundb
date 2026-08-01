import heroLinksMeta from "@/content/meta/hero-links.json";
import type { GameAbility, HeroSpecialization } from "@/types";

export type HeroLinkEntry = {
  classSlugs: string[];
  role?: string;
  activeAbilityId?: number;
};

type RawPassive = {
  id: number | string;
  targetHero?: string;
};

type RawSpec = {
  id: number | string;
  name?: string;
};

type RawHero = {
  id: number | string;
  slug?: string;
  name?: string;
};

export type HeroAssociationBundle = {
  metaBySlug: Map<string, HeroLinkEntry>;
  passivesByHeroName: Map<string, GameAbility[]>;
  activeById: Map<number, GameAbility>;
  specsByHeroId: Map<number, HeroSpecialization[]>;
};

function toSlug(value: string, fallbackId: string | number) {
  const base = value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base ? `${base}-${fallbackId}` : `entry-${fallbackId}`;
}

export function getHeroLinkEntry(slug: string): HeroLinkEntry | undefined {
  const heroes = heroLinksMeta.heroes as Record<string, HeroLinkEntry>;
  return heroes[slug];
}

export function resolveActiveAbilityId(
  heroId: number,
  override?: number,
): number | undefined {
  if (override !== undefined) return override;
  return heroId;
}

export function buildHeroAssociations(
  heroes: RawHero[],
  actives: GameAbility[],
  passives: GameAbility[],
  rawPassives: RawPassive[],
  rawSpecs: RawSpec[],
): HeroAssociationBundle {
  const metaBySlug = new Map<string, HeroLinkEntry>(
    Object.entries(heroLinksMeta.heroes as Record<string, HeroLinkEntry>),
  );

  const activeById = new Map<number, GameAbility>(
    actives.map((ability) => [Number(ability.id), ability]),
  );

  const passiveById = new Map<string, GameAbility>(
    passives.map((ability) => [ability.id, ability]),
  );

  const passivesByHeroName = new Map<string, GameAbility[]>();
  for (const raw of rawPassives) {
    const heroName = raw.targetHero?.trim();
    if (!heroName) continue;
    const ability = passiveById.get(String(raw.id));
    if (!ability) continue;
    const list = passivesByHeroName.get(heroName) ?? [];
    list.push(ability);
    passivesByHeroName.set(heroName, list);
  }

  for (const [, list] of passivesByHeroName) {
    list.sort((a, b) => Number(a.id) - Number(b.id));
  }

  const specsByHeroId = new Map<number, HeroSpecialization[]>();
  for (const raw of rawSpecs) {
    const specId = Number(raw.id);
    const heroId = Math.floor(specId / 100);
    if (!heroId) continue;
    const name = raw.name?.trim() || `Spec ${specId}`;
    const spec: HeroSpecialization = {
      id: String(specId),
      slug: toSlug(name, specId),
      name,
    };
    const list = specsByHeroId.get(heroId) ?? [];
    list.push(spec);
    specsByHeroId.set(heroId, list);
  }

  for (const [, list] of specsByHeroId) {
    list.sort((a, b) => Number(a.id) - Number(b.id));
  }

  // Ensure every hero slug from roster has a lookup entry (even if empty).
  for (const hero of heroes) {
    const slug = hero.slug?.trim();
    if (!slug || metaBySlug.has(slug)) continue;
    metaBySlug.set(slug, { classSlugs: [] });
  }

  return {
    metaBySlug,
    passivesByHeroName,
    activeById,
    specsByHeroId,
  };
}
