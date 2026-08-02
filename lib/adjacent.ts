import rankModifiersRaw from "@/content/rankModifiers.json";
import { ADJACENT_GUIDE } from "@/lib/adjacent-meta";
import {
  formatGameText,
  getActiveAbilities,
  getHeroes,
  getItems,
  getPassiveAbilities,
  getRelics,
} from "@/lib/data";
import type { BalancingLike } from "@/lib/description";

export { ADJACENT_GUIDE };

export type AdjacentGroup =
  | "ally-buff"
  | "enemy-pressure"
  | "pair-formation"
  | "positional-trigger";

export type AdjacentRelatedEntry = {
  id: string;
  kind: "relic" | "item" | "hero-ability" | "rank-mod";
  name: string;
  description: string;
  href?: string;
  meta?: string;
  group: AdjacentGroup;
};

const ADJACENT_RE = /\badjacent\b/i;

type RawRankMod = {
  id: number | string;
  name?: string;
  description?: string;
  balancing?: BalancingLike;
};

function classifyAdjacentText(text: string): AdjacentGroup {
  const t = text.toLowerCase();

  if (t.includes("exactly one other hero")) return "pair-formation";

  if (
    t.includes("adjacent to its target") ||
    t.includes("adjacent heroes to them") ||
    (t.includes("enemy adjacent") && t.includes("refresh"))
  ) {
    return "positional-trigger";
  }

  if (
    t.includes("adjacent enemies") ||
    t.includes("on adjacent enemy")
  ) {
    return "enemy-pressure";
  }

  if (
    t.includes("adjacent heroes") ||
    t.includes("holder and adjacent") ||
    /\bheals?\b/.test(t)
  ) {
    return "ally-buff";
  }

  return "enemy-pressure";
}

function dedupeKey(entry: AdjacentRelatedEntry) {
  return `${entry.kind}:${entry.name.toLowerCase()}:${entry.description.slice(0, 80)}`;
}

/**
 * Scan Demo content for English “adjacent” mentions and group for the guide.
 */
export function getAdjacentRelatedContent(): {
  entries: AdjacentRelatedEntry[];
  byGroup: Record<AdjacentGroup, AdjacentRelatedEntry[]>;
  counts: { total: number } & Record<AdjacentGroup, number>;
} {
  const collected: AdjacentRelatedEntry[] = [];

  for (const relic of getRelics()) {
    if (!ADJACENT_RE.test(relic.effect)) continue;
    collected.push({
      id: `relic-${relic.id}`,
      kind: "relic",
      name: relic.name,
      description: relic.effect,
      href: `/relics/${relic.slug}`,
      meta: relic.rarity || undefined,
      group: classifyAdjacentText(relic.effect),
    });
  }

  for (const item of getItems()) {
    if (!ADJACENT_RE.test(item.stats)) continue;
    collected.push({
      id: `item-${item.id}`,
      kind: "item",
      name: item.name,
      description: item.stats,
      href: `/items/${item.slug}`,
      meta: item.type && item.type.toLowerCase() !== "item" ? item.type : undefined,
      group: classifyAdjacentText(item.stats),
    });
  }

  for (const hero of getHeroes()) {
    const abilityLines: Array<{ name: string; description: string; label: string }> =
      [];

    if (
      hero.activeAbility &&
      ADJACENT_RE.test(hero.activeAbility.description)
    ) {
      abilityLines.push({
        name: hero.activeAbility.name,
        description: hero.activeAbility.description,
        label: "Active",
      });
    }

    for (const passive of hero.passiveAbilities) {
      if (!ADJACENT_RE.test(passive.description)) continue;
      abilityLines.push({
        name: passive.name,
        description: passive.description,
        label: "Passive",
      });
    }

    for (const ability of hero.abilities) {
      if (!ADJACENT_RE.test(ability.description)) continue;
      const already = abilityLines.some(
        (line) =>
          line.name === ability.name && line.description === ability.description,
      );
      if (already) continue;
      abilityLines.push({
        name: ability.name,
        description: ability.description,
        label: "Ability",
      });
    }

    for (const line of abilityLines) {
      collected.push({
        id: `hero-ability-${hero.id}-${line.name}`,
        kind: "hero-ability",
        name: line.name,
        description: line.description,
        href: `/heroes/${hero.slug}`,
        meta: `${hero.name} · ${line.label}`,
        group: classifyAdjacentText(line.description),
      });
    }
  }

  // Monster / unlinked kits still mention adjacent (Slam, Bash, Dragon breaths…).
  const linkedAbilityNames = new Set(
    collected
      .filter((entry) => entry.kind === "hero-ability")
      .map((entry) => entry.name.toLowerCase()),
  );

  for (const ability of [...getActiveAbilities(), ...getPassiveAbilities()]) {
    if (!ADJACENT_RE.test(ability.description)) continue;
    if (linkedAbilityNames.has(ability.name.toLowerCase())) continue;
    collected.push({
      id: `ability-${ability.kind}-${ability.id}`,
      kind: "hero-ability",
      name: ability.name,
      description: ability.description,
      meta: ability.kind === "active" ? "Active ability" : "Passive ability",
      group: classifyAdjacentText(ability.description),
    });
    linkedAbilityNames.add(ability.name.toLowerCase());
  }

  for (const raw of rankModifiersRaw as RawRankMod[]) {
    const description = raw.description || "";
    if (!ADJACENT_RE.test(description)) continue;
    const resolved = formatGameText(description, raw.balancing);
    collected.push({
      id: `rank-mod-${raw.id}`,
      kind: "rank-mod",
      name: raw.name || `Rank modifier ${raw.id}`,
      description: resolved,
      meta: "Rank modifier",
      group: classifyAdjacentText(description),
    });
  }

  const seen = new Set<string>();
  const entries = collected.filter((entry) => {
    const key = dedupeKey(entry);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const byGroup: Record<AdjacentGroup, AdjacentRelatedEntry[]> = {
    "ally-buff": [],
    "enemy-pressure": [],
    "pair-formation": [],
    "positional-trigger": [],
  };

  for (const entry of entries) {
    byGroup[entry.group].push(entry);
  }

  for (const group of Object.keys(byGroup) as AdjacentGroup[]) {
    byGroup[group].sort((a, b) => a.name.localeCompare(b.name));
  }

  return {
    entries,
    byGroup,
    counts: {
      total: entries.length,
      "ally-buff": byGroup["ally-buff"].length,
      "enemy-pressure": byGroup["enemy-pressure"].length,
      "pair-formation": byGroup["pair-formation"].length,
      "positional-trigger": byGroup["positional-trigger"].length,
    },
  };
}
