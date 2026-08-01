import tagsData from "@/content/meta/tags.json";

export type TagCategory = "combat" | "class" | "stat" | "other";

export type TagDefinition = {
  id: string;
  label: string;
  category: TagCategory;
  summary: string;
  classSlug?: string;
};

const MARKUP_TAG_RE = /\[([^\]]+)\]<([^>]+)>/g;

/** Tags that appear in dumps but are not useful as player-facing mechanics. */
const IGNORED_TAGS = new Set([
  "bold",
  "basicstat",
  "primarystat",
  "datatracking",
  "generate",
  "lasting",
  "backup",
  "backuponly",
  "class",
  "reserve",
  "seconds",
  "health",
  "wad",
  "rhd",
  "trh",
  "gtp",
  "threat",
  "storm",
  "shardstabilizer",
  "duelists",
  "damage",
  "rank",
  "reroll",
  "startingmana",
  "attackrange",
  "movespeed",
  "mana",
  "hp/s",
]);

function isNoiseTag(tag: string) {
  if (IGNORED_TAGS.has(tag)) return true;
  if (tag.startsWith("statcalc_")) return true;
  return false;
}

function titleCaseFromId(id: string) {
  return id
    .split(/[_/-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function cleanMarkupLabel(label: string) {
  return label
    .replace(/:$/, "")
    .replace(/^\{[^}]+\}\s*/, "")
    .replace(/\s*\{[^}]+\}/g, "")
    .trim();
}

const definitions = (tagsData.tags ?? []) as TagDefinition[];

export function getTagDefinitions(): TagDefinition[] {
  return definitions;
}

export function getTagDefinition(id: string): TagDefinition | undefined {
  return definitions.find((tag) => tag.id === id);
}

/**
 * Pull mechanic ids from game markup like `[Rush]<rush>` / `[Warrior's]<warrior>`.
 * Falls back to curated keyword labels found in plain generated summaries.
 */
export function extractTags(input: string | undefined | null): string[] {
  if (!input) return [];

  const found = new Set<string>();
  const re = new RegExp(MARKUP_TAG_RE.source, "g");
  let match: RegExpExecArray | null;

  while ((match = re.exec(input)) !== null) {
    const tag = match[2].trim().toLowerCase();
    if (!tag || isNoiseTag(tag)) continue;
    found.add(tag);
  }

  if (found.size === 0) {
    const lower = input.toLowerCase();
    for (const def of definitions) {
      if (isNoiseTag(def.id)) continue;
      const label = def.label.toLowerCase();
      if (label.length < 3) continue;
      const pattern = new RegExp(`\\b${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (pattern.test(lower)) found.add(def.id);
    }
  }

  return [...found];
}

export function resolveTagMeta(
  id: string,
  fallbackLabel?: string,
): TagDefinition {
  const known = getTagDefinition(id);
  if (known) return known;

  const label = cleanMarkupLabel(fallbackLabel || "") || titleCaseFromId(id);
  return {
    id,
    label,
    category: "other",
    summary: `Guildrun mechanic related to ${label}.`,
  };
}

export function getCuratedTagIds(): string[] {
  return definitions.map((tag) => tag.id);
}
