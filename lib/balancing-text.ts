/**
 * Best-effort English summaries from Guildrun balancing dumps
 * when localization description strings are missing.
 */

import type { BalancingLike } from "@/lib/description";

type StatMod = {
  TargetStat?: string;
  Value?: number | string;
};

const STAT_LABELS: Record<string, string> = {
  Attack: "Attack",
  AttackSpeed: "Attack Speed",
  OmniVamp: "Omnivamp",
  Omnivamp: "Omnivamp",
  Magic: "Magic",
  ManaRegen: "Mana Regen",
  StartingMana: "Starting Mana",
  Defense: "Defense",
  MaxHealth: "Max HP",
  MaxHP: "Max HP",
  HPPerSecond: "HP/S",
  Crit: "Crit",
  AttackRange: "Attack Range",
  Mana: "Mana",
  Shields: "Shields",
};

const STAT_TYPE_LABELS: Record<number, string> = {
  1: "Max HP",
  4: "Defense",
  6: "Attack",
  7: "Magic",
  9: "Attack Speed",
  10: "Attack Range",
  11: "Crit",
  12: "Mana Regen",
  13: "Omnivamp",
  15: "HP/S",
  18: "Starting Mana",
};

const STATUS_LABELS: Record<number, string> = {
  1: "Burn",
  2: "Frost",
  3: "Poison",
  4: "Stun",
};

const TRIGGER_LABELS: Record<number, string> = {
  1: "Passive",
  2: "Passive",
  3: "At start of combat",
  4: "On combat survival",
  5: "At end of combat",
  6: "On equip",
  10: "When auto attacked",
  11: "On cast",
  13: "When a Hero drops low on health",
  15: "After Stall",
  17: "On auto attack",
  18: "When enemies take DoT damage",
  19: "When a Hero inflicts a Debuff",
  20: "When Shields take damage",
  21: "Passive",
  30: "When dealing damage",
  31: "On Crit",
  32: "On kill",
  40: "On Rush trigger",
  42: "On Stall trigger",
  60: "Each second",
  80: "On first attack",
  100: "On acquire",
  120: "When Shards are generated",
};

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "?";
  if (Number.isInteger(value)) return String(value);
  return String(parseFloat(value.toFixed(3)));
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value.trim())) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function statLabel(raw: string | undefined): string {
  if (!raw) return "Stat";
  return STAT_LABELS[raw] || raw.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function actionTypeName(action: Record<string, unknown>): string {
  const type = action.$type;
  if (typeof type !== "string") return "";
  const m = type.match(/\.([A-Za-z0-9_]+),\s/);
  return m ? m[1] : "";
}

function parseEffectEntry(entry: unknown): Record<string, unknown> | null {
  if (!entry || typeof entry !== "object") return null;
  const obj = entry as Record<string, unknown>;
  if (typeof obj.json === "string" && obj.json.startsWith("{")) {
    try {
      return JSON.parse(obj.json) as Record<string, unknown>;
    } catch {
      /* fall through */
    }
  }
  if (obj.data && typeof obj.data === "object") {
    return obj.data as Record<string, unknown>;
  }
  return obj;
}

function formatSignedStat(value: number, label: string): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${formatNumber(value)} ${label}`;
}

/** "+25 Attack, +10 Attack Speed" from ItemStatModification[]. */
export function formatStatModifications(mods: unknown): string {
  if (!Array.isArray(mods) || mods.length === 0) return "";
  const parts: string[] = [];
  for (const mod of mods) {
    if (!mod || typeof mod !== "object") continue;
    const row = mod as StatMod;
    const value = asNumber(row.Value);
    if (value === null) continue;
    parts.push(formatSignedStat(value, statLabel(row.TargetStat)));
  }
  return parts.join(", ");
}

function summarizeAction(action: Record<string, unknown>): string | null {
  const type = actionTypeName(action);

  if (type.includes("ModifyAllBasicStatsPercent")) {
    const pct = asNumber(action.Percent);
    if (pct === null) return null;
    const shown = pct <= 1 && pct >= -1 ? pct * 100 : pct;
    return `${shown >= 0 ? "+" : ""}${formatNumber(shown)}% to basic stats`;
  }

  if (type.includes("ModifyTargetStatPercent") || type.includes("ModifyStatPercent")) {
    const pct = asNumber(action.Percent);
    const stat =
      STAT_TYPE_LABELS[Number(action.StatType)] ||
      STAT_TYPE_LABELS[Number(action.StatTypeTarget)] ||
      "stats";
    if (pct === null) return null;
    const shown = pct <= 1 && pct >= -1 ? pct * 100 : pct;
    return `${shown >= 0 ? "+" : ""}${formatNumber(shown)}% ${stat}`;
  }

  if (type.includes("ModifyStat") || ("StatType" in action && ("Value" in action || "Amount" in action))) {
    const value = asNumber(action.Value) ?? asNumber(action.Amount);
    const stat = STAT_TYPE_LABELS[Number(action.StatType)];
    if (value === null || !stat) return null;
    return formatSignedStat(value, stat);
  }

  if (type.includes("ApplyStatusFromTargetStatPercent")) {
    const pct = asNumber(action.Percent);
    const status = STATUS_LABELS[Number(action.Status)] || "Debuff";
    if (pct === null) return `inflict ${status}`;
    const shown = pct <= 1 ? pct * 100 : pct;
    return `inflict ${formatNumber(shown)}% ${status}`;
  }

  if (type.includes("ApplyStatusWithDuration")) {
    const amount = asNumber(action.Amount) ?? asNumber(action.Value);
    const duration = asNumber(action.Duration);
    const status = STATUS_LABELS[Number(action.Status)] || "status";
    if (amount === null) return null;
    const dur =
      duration !== null && duration > 0 && duration < 90
        ? ` for ${formatNumber(duration)}s`
        : "";
    return `inflict ${formatNumber(amount)} ${status}${dur}`;
  }

  if (type.includes("ApplyStatus")) {
    const amount = asNumber(action.Amount) ?? asNumber(action.Value);
    const status = STATUS_LABELS[Number(action.Status)] || "status";
    if (amount === null) return `inflict ${status}`;
    return `inflict ${formatNumber(amount)} ${status}`;
  }

  if (type.includes("ApplyShieldFrom") || type.includes("ApplyShield")) {
    const amount = asNumber(action.Amount) ?? asNumber(action.Value);
    const pct = asNumber(action.Percent);
    if (amount !== null) return `gain ${formatNumber(amount)} Shields`;
    if (pct !== null) {
      const shown = pct <= 1 ? pct * 100 : pct;
      return `gain ${formatNumber(shown)}% Shields`;
    }
    return "gain Shields";
  }

  if (type.includes("Heal")) {
    const amount = asNumber(action.Amount) ?? asNumber(action.Value);
    if (amount === null) return "heal";
    return `heal ${formatNumber(amount)}`;
  }

  if (type.includes("DealDamage")) {
    const amount = asNumber(action.Amount) ?? asNumber(action.Value);
    if (amount === null) return "deal damage";
    return `deal ${formatNumber(amount)} damage`;
  }

  if (type.includes("GainShards")) {
    const amount = asNumber(action.Amount) ?? asNumber(action.Value);
    if (amount === null) return "gain Shards";
    return `gain ${formatNumber(amount)} Shards`;
  }

  if (type.includes("PowerCrystalSetup")) {
    const count = asNumber(action.count);
    return count !== null
      ? `set up Power Crystal (x${formatNumber(count)})`
      : "set up Power Crystal";
  }

  if (type.includes("StatCrystalStartOfCombat")) {
    const s1 = STAT_TYPE_LABELS[Number(action.stat1)];
    const s2 = STAT_TYPE_LABELS[Number(action.stat2)];
    const a1 = asNumber(action.amount1);
    const a2 = asNumber(action.amount2);
    const parts: string[] = [];
    if (s1 && a1 !== null) parts.push(formatSignedStat(a1, s1));
    if (s2 && a2 !== null) parts.push(formatSignedStat(a2, s2));
    if (!parts.length) return "grant bonus stats to nearby allies";
    return `grant nearby allies ${parts.join(" and ")}`;
  }

  if (type.includes("ModifyAllBasicStatsPercent")) {
    return null;
  }

  // Custom / opaque actions — keep a short readable cue, never invent numbers
  if (type.includes("CreateRelic") || type.includes("CreateItem") || type.includes("CreateAll")) {
    return "creates related rewards";
  }
  if (type.includes("SetTeamSize") || type.includes("IncrementTeamSize")) {
    return "changes team size rules";
  }
  if (type.includes("TriggerDemonFury")) {
    return "triggers Demon Fury";
  }
  if (type.includes("SurvivalCombat")) {
    return "on combat survival";
  }
  if (type.includes("RiftAnchor") || type.includes("RiftSeal") || type.includes("Rift")) {
    return "Rift Seal effect";
  }
  if (type.includes("PowerCrystal") || type.includes("LargePowerCrystal")) {
    return "Power Crystal effect";
  }
  if (type.includes("StatCrystalDestroy")) {
    return "consumed when the crystal breaks";
  }
  if (type.includes("IncrementGlobal") || type.includes("InflictDebuffGlobal")) {
    return "advances a boss/global stack";
  }
  if (type.includes("ModifyGlobalHeroItemSlot")) {
    return "changes item slot rules";
  }

  return null;
}

function targetSuffix(targetType: unknown): string {
  switch (Number(targetType)) {
    case 3:
      return " on enemies";
    case 5:
      return " on matching Heroes";
    case 2:
      return " on nearby allies";
    default:
      return "";
  }
}

function summarizeEffectEntry(entry: unknown): string | null {
  const data = parseEffectEntry(entry);
  if (!data) return null;

  const trigger = Number(data["<Trigger>k__BackingField"]);
  const triggerLabel = TRIGGER_LABELS[trigger] || "Effect";
  const actions = Array.isArray(data._actions) ? data._actions : [];
  const parts: string[] = [];

  for (const action of actions) {
    if (!action || typeof action !== "object") continue;
    const line = summarizeAction(action as Record<string, unknown>);
    if (line) parts.push(line);
  }

  if (!parts.length) return null;

  const body = parts.join(", ");
  const suffix = body.includes(" on ") ? "" : targetSuffix(data.TargetType);

  // Passive/on-acquire with pure stat lines → skip redundant "Passive:" prefix
  if (
    (trigger === 1 || trigger === 2 || trigger === 100) &&
    parts.every((p) => p.startsWith("+") || p.startsWith("-"))
  ) {
    return body;
  }

  if (trigger === 1 || trigger === 2) {
    return body + suffix;
  }

  return `${triggerLabel}, ${body}${suffix}`;
}

function summarizeEffectLists(balancing: BalancingLike): string {
  if (!balancing) return "";
  const lists = [
    balancing.effects,
    balancing.specialEffects,
    balancing.abilityEffects,
  ];
  const lines: string[] = [];
  const seen = new Set<string>();

  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const entry of list) {
      const line = summarizeEffectEntry(entry);
      if (!line || seen.has(line)) continue;
      seen.add(line);
      lines.push(line);
    }
  }

  return lines.join(" ");
}

function isMostlyStatLines(text: string): boolean {
  const chunks = text
    .split(/[.,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/^(At start of combat|Passive|On acquire),\s*/i, ""));
  if (!chunks.length) return false;
  return chunks.every((chunk) => /^[+-]?\d/.test(chunk));
}

export function buildItemDisplayText(input: {
  stats?: string;
  description?: string;
  balancing?: BalancingLike;
}): string {
  const authored = (input.stats || input.description || "").trim();
  if (authored) return authored;

  const mods = formatStatModifications(
    input.balancing && typeof input.balancing === "object"
      ? input.balancing.statModifications
      : undefined,
  );
  const effects = summarizeEffectLists(input.balancing);

  if (mods && effects) {
    // Start-of-combat ModifyStat usually duplicates ItemStatModification.
    if (isMostlyStatLines(effects)) return mods;
    return `${mods}. ${effects}`;
  }

  return mods || effects;
}

export function buildRelicDisplayText(input: {
  effect?: string;
  description?: string;
  balancing?: BalancingLike;
}): string {
  const authored = (input.effect || input.description || "").trim();
  if (authored) return authored;
  return summarizeEffectLists(input.balancing).trim();
}

export function runtimeTitle(balancing: BalancingLike): string {
  if (!balancing || typeof balancing !== "object") return "";
  const title = balancing.runtimeTitle;
  return typeof title === "string" ? title.trim() : "";
}
