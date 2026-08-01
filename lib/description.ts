/**
 * Resolve Guildrun localization placeholders using balancing / descriptionArgs.
 *
 * Templates look like:
 * - "last {0} seconds longer"
 * - "[{0}+{1}_Magic]<statcalc_damage>"
 * - "[{0}+{1}|{2}|{3}|{4}_Magic]<statcalc_shield>"
 */

export type BalancingLike = {
  descriptionArgs?: Array<number | string>;
  abilityActions?: unknown[];
  abilityEffects?: unknown[];
  effects?: unknown[];
  specialEffects?: unknown[];
  [key: string]: unknown;
} | null
  | undefined;

type Arg = number;

const STAT_LABELS: Record<string, string> = {
  Attack: "Attack",
  AttackSpeed: "Attack Speed",
  Magic: "Magic",
  Defense: "Defense",
  MaxHealth: "Max Health",
  MaxHP: "Max HP",
  Crit: "Crit",
  ManaRegen: "Mana Regen",
  Mana: "Mana",
  Rank: "rank",
  Omnivamp: "Omnivamp",
  Shields: "Shields",
};

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "?";
  if (Number.isInteger(value)) return String(value);
  const rounded = Math.round(value * 1000) / 1000;
  return String(parseFloat(rounded.toFixed(3)));
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value.trim())) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function actionTypeName(raw: unknown): string {
  if (!raw || typeof raw !== "object") return "";
  const obj = raw as Record<string, unknown>;
  if (typeof obj.$type === "string") {
    const m = obj.$type.match(/\.([A-Za-z0-9_]+),\s/);
    if (m) return m[1];
  }
  return "";
}

function parseEntryFull(entry: unknown): Record<string, unknown> | null {
  if (!entry || typeof entry !== "object") return null;
  const obj = entry as Record<string, unknown>;
  if (typeof obj.json === "string" && obj.json.startsWith("{")) {
    try {
      // Prefer the full SerializeReference blob — `data` often strips $type / Scalings.
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

function rank1Factor(scalings: unknown): number | null {
  if (!Array.isArray(scalings) || scalings.length === 0) return null;
  const first = scalings[0] as Record<string, unknown>;
  return asNumber(first.Rank1Factor);
}

function emitFromAction(action: Record<string, unknown>, out: Arg[]) {
  const type = actionTypeName(action);

  if (
    type.includes("DealCritableDamage") ||
    type.includes("DealDamage") ||
    ("BaseDamage" in action && Array.isArray(action.Scalings))
  ) {
    const base = asNumber(action.BaseDamage);
    if (base !== null) out.push(base);
    const factor = rank1Factor(action.Scalings);
    if (factor !== null) out.push(factor);
    return;
  }

  if (
    type.includes("ApplyStatusFromOwnerStat") ||
    ("Increment" in action && "Base" in action && "Status" in action)
  ) {
    const base = asNumber(action.Base);
    const inc = asNumber(action.Increment);
    if (base !== null) out.push(base);
    if (inc !== null) out.push(inc);
    return;
  }

  if (
    type.includes("ApplyShieldFromStat") ||
    type.includes("ModifyStatFromStat")
  ) {
    // [{0}+{1}_Stat] → base (often 0) + percent coefficient
    const max = asNumber(action.Max);
    out.push(max !== null ? max : 0);
    const pct = asNumber(action.Percent);
    if (pct !== null) out.push(pct);
    return;
  }

  if (type.includes("ModifyStatPercent")) {
    const pct = asNumber(action.Percent);
    if (pct !== null) out.push(pct);
    return;
  }

  if (
    type.includes("ModifyPermanentStat") ||
    type.includes("ModifyStatAction") ||
    type === "ModifyStatAction" ||
    type.includes("IncreaseRushDuration") ||
    type.includes("DecreaseStall") ||
    type.includes("IncreaseStall")
  ) {
    for (const key of ["Duration", "Value", "Amount", "Percent"] as const) {
      const n = asNumber(action[key]);
      if (n !== null) out.push(n);
    }
    return;
  }

  // Untyped partials: prefer explicit gameplay fields, avoid Duration on shields
  if ("BaseDamage" in action) {
    const base = asNumber(action.BaseDamage);
    if (base !== null) out.push(base);
    const factor = rank1Factor(action.Scalings);
    if (factor !== null) out.push(factor);
    return;
  }

  if ("_amountPerStack" in action) {
    const n = asNumber(action._amountPerStack);
    if (n !== null) out.push(n);
    return;
  }

  if ("Increment" in action && "Base" in action) {
    const base = asNumber(action.Base);
    const inc = asNumber(action.Increment);
    if (base !== null) out.push(base);
    if (inc !== null) out.push(inc);
    return;
  }

  if ("Percent" in action && !("Duration" in action && !("Value" in action))) {
    // ModifyStatFromStat-style untyped: treat as 0 + percent when Max present or only Percent
    if ("Max" in action || type.includes("FromStat")) {
      out.push(asNumber(action.Max) ?? 0);
    }
    const pct = asNumber(action.Percent);
    if (pct !== null) out.push(pct);
    return;
  }

  if ("Amount" in action) {
    const n = asNumber(action.Amount);
    if (n !== null) out.push(n);
    return;
  }
  if ("Value" in action) {
    const n = asNumber(action.Value);
    if (n !== null) out.push(n);
    return;
  }
  if ("Duration" in action) {
    const n = asNumber(action.Duration);
    if (n !== null) out.push(n);
  }
}

function emitFromCustomAbility(data: Record<string, unknown>, out: Arg[]) {
  // Channel / cast duration first when present
  const duration = asNumber(data._duration);
  if (duration !== null && duration > 0) out.push(duration);

  // Shield amount + magic scaling (Fiona Vault Spark pattern)
  const shield = asNumber(data._shieldAmount);
  if (shield !== null) {
    out.push(shield);
    const factor = rank1Factor(data._shieldScalings);
    if (factor !== null) out.push(factor);
  }

  const baseAllies = asNumber(data._baseAllies);
  const allyInc = asNumber(data._allyManaRegenIncrement);
  if (baseAllies !== null) out.push(baseAllies);
  if (allyInc !== null) out.push(allyInc);

  // Nested modular effects on ability actions (Aria beam ticks etc.)
  const regular = data._regularEffects;
  if (Array.isArray(regular)) {
    for (const effect of regular) {
      if (!effect || typeof effect !== "object") continue;
      const actions = (effect as Record<string, unknown>)._actions;
      if (!Array.isArray(actions)) continue;
      for (const action of actions) {
        if (action && typeof action === "object") {
          emitFromAction(action as Record<string, unknown>, out);
        }
      }
    }
  }
}

function effectMetaArgs(data: Record<string, unknown>, out: Arg[], description: string) {
  const interval = asNumber(data["<EffectInterval>k__BackingField"]);
  const stall = asNumber(data["<StallDuration>k__BackingField"]);
  const rush = asNumber(data["<RushDuration>k__BackingField"]);

  // "Every {0} Seconds" / interval-driven templates
  if (
    interval !== null &&
    interval > 0 &&
    /Every\s*\{(\d+)\}|\{(\d+)\}\s*Seconds/i.test(description)
  ) {
    out.push(interval);
  }

  // "After Stall ({0}, Stall {1}, ...)" — collect non-zero stall thresholds
  if (stall !== null && stall > 0 && /Stall\s*\(/i.test(description)) {
    out.push(stall);
  }

  // Rush (N) thresholds
  if (rush !== null && rush > 0 && /Rush\s*\(/i.test(description)) {
    out.push(rush);
  }
}

function collectFromEffectList(
  list: unknown[] | undefined,
  out: Arg[],
  description: string,
) {
  if (!Array.isArray(list)) return;

  // "After Stall (a, Stall b, and Stall c), gain +X%" — gather thresholds, then one percent
  const stallThresholdPattern = /Stall\s*\(\s*\{(\d+)\}/i.test(description);
  if (stallThresholdPattern) {
    const stalls: number[] = [];
    const other: Arg[] = [];
    let percent: number | null = null;

    for (const entry of list) {
      const data = parseEntryFull(entry);
      if (!data) continue;
      const stall = asNumber(data["<StallDuration>k__BackingField"]);
      if (stall !== null && stall > 0 && !stalls.includes(stall)) stalls.push(stall);

      const actions = data._actions;
      if (!Array.isArray(actions)) continue;
      for (const action of actions) {
        if (!action || typeof action !== "object") continue;
        const act = action as Record<string, unknown>;
        const type = actionTypeName(act);
        if (type.includes("ModifyStatPercent") || ("Percent" in act && !("Value" in act) && !("Base" in act))) {
          const pct = asNumber(act.Percent);
          if (pct !== null && percent === null) percent = pct;
          continue;
        }
        emitFromAction(act, other);
      }
    }

    out.push(...other, ...stalls);
    if (percent !== null) out.push(percent);
    return;
  }

  for (const entry of list) {
    const data = parseEntryFull(entry);
    if (!data) continue;

    effectMetaArgs(data, out, description);

    const actions = data._actions;
    if (Array.isArray(actions)) {
      for (const action of actions) {
        if (action && typeof action === "object") {
          emitFromAction(action as Record<string, unknown>, out);
        }
      }
    } else {
      // Custom ability action root (SeraphaelAbilityAction, FionaAction, ...)
      emitFromCustomAbility(data, out);
    }
  }
}

function preferSpecialStackArgs(
  balancing: BalancingLike,
  description: string,
): Arg[] | null {
  if (!balancing || !/gains\s*\[?\{0\}/i.test(description)) return null;
  const specials = balancing.specialEffects;
  if (!Array.isArray(specials)) return null;
  for (const entry of specials) {
    const data = parseEntryFull(entry);
    if (!data) continue;
    const actions = data._actions;
    if (!Array.isArray(actions)) continue;
    for (const action of actions) {
      if (!action || typeof action !== "object") continue;
      const act = action as Record<string, unknown>;
      const n =
        asNumber(act._amountPerStack) ??
        asNumber(act.amount) ??
        asNumber(act.Amount);
      if (n !== null) return [n];
    }
  }
  return null;
}

/** Extract ordered format args for a description from balancing data. */
export function extractDescriptionArgs(
  description: string,
  balancing?: BalancingLike,
): Arg[] {
  if (!balancing) return [];

  const explicit = balancing.descriptionArgs;
  if (Array.isArray(explicit) && explicit.length > 0) {
    return explicit
      .map((v) => asNumber(v))
      .filter((v): v is number => v !== null);
  }

  const stackArgs = preferSpecialStackArgs(balancing, description);
  if (stackArgs) return stackArgs;

  const out: Arg[] = [];

  collectFromEffectList(balancing.abilityActions as unknown[] | undefined, out, description);

  const abilityEffects = balancing.abilityEffects as unknown[] | undefined;
  const effects = balancing.effects as unknown[] | undefined;
  if (Array.isArray(abilityEffects) && abilityEffects.length > 0) {
    collectFromEffectList(abilityEffects, out, description);
  } else {
    collectFromEffectList(effects, out, description);
  }

  collectFromEffectList(
    balancing.specialEffects as unknown[] | undefined,
    out,
    description,
  );

  return out;
}

function statLabel(raw: string): string {
  return STAT_LABELS[raw] || raw.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function formatPercentCoefficient(coef: number): string {
  // 0.75 → 75%, 2.5 → 250%, 0.01 → 1%
  return formatNumber(coef * 100);
}

function formatPlainArg(value: number, followedByPercent: boolean): string {
  if (followedByPercent && value > 0 && value <= 1) {
    return formatNumber(value * 100);
  }
  return formatNumber(value);
}

/**
 * Format [{0}+{1}_Magic+{2}_ManaRegen] style formulas.
 */
function formatStatCalcFormula(
  formula: string,
  args: Arg[],
  calcTag: string,
): string {
  // Rank pipe form: {0}+{1}|{2}|{3}|{4}_Magic
  const pipe = formula.match(/^\{(\d+)\}\+\{(\d+)\}\|\{(\d+)\}\|\{(\d+)\}\|\{(\d+)\}_([A-Za-z]+)$/);
  if (pipe) {
    const base = args[Number(pipe[1])];
    const r1 = args[Number(pipe[2])];
    const stat = statLabel(pipe[6]);
    if (base === undefined) return formula;
    const parts = [`${formatNumber(base)}`];
    if (r1 !== undefined) {
      parts.push(`(+ ${formatNumber(r1)} per rank ${stat})`.replace(` ${stat}`, ""));
      // Prefer guildrun style: "500 (+500 per rank )"
      return `${formatNumber(base)} (+${formatNumber(r1)} per rank )`;
    }
    return parts.join(" ");
  }

  // General: {0}+{1}_Stat+{2}_OtherStat  OR  {0}+{1}_Stat
  const parts = formula.split("+").map((p) => p.trim());
  if (parts.length === 0) return formula;

  const baseMatch = parts[0].match(/^\{(\d+)\}$/);
  if (!baseMatch) return formula;
  const baseIdx = Number(baseMatch[1]);
  const base = args[baseIdx];
  if (base === undefined) return `[${formula}]`;

  const scalings: Array<{ coef: number; stat: string }> = [];
  for (let i = 1; i < parts.length; i++) {
    const m = parts[i].match(/^\{(\d+)\}_([A-Za-z]+)$/);
    if (!m) continue;
    const coef = args[Number(m[1])];
    if (coef === undefined) continue;
    scalings.push({ coef, stat: statLabel(m[2]) });
  }

  if (scalings.length === 0) return formatNumber(base);

  const isStatus =
    /burn|frost|poison|stun|bleed/i.test(calcTag) ||
    /burn|frost|poison/i.test(formula);

  // Status stacks: 0 + Increment → "1 per N Stat"
  if (base === 0 && scalings.length === 1 && isStatus) {
    return `1 per ${formatNumber(scalings[0].coef)} ${scalings[0].stat}`;
  }

  // Pure percent of stat (regen / shield from max HP): 0 + 0.01 → "1% Max Health"
  if (base === 0 && scalings.length === 1) {
    const { coef, stat } = scalings[0];
    if (coef > 0 && coef <= 1) {
      return `${formatPercentCoefficient(coef)}% ${stat}`;
    }
    if (Number.isInteger(coef) && coef >= 1) {
      return `1 per ${formatNumber(coef)} ${stat}`;
    }
  }

  const scalingText = scalings
    .map(({ coef, stat }) => {
      // Fractional / small coefficients → percent of stat
      if (!Number.isInteger(coef) || coef <= 10) {
        return `+ ${formatPercentCoefficient(coef)}% ${stat}`;
      }
      // Large integers → "1 per N Stat" (Fiona ally count pattern)
      return `+ 1 per ${formatNumber(coef)} ${stat}`;
    })
    .join(" , ");

  return `${formatNumber(base)} (${scalingText} )`;
}

/**
 * Replace placeholders and statcalc markup using extracted args.
 * Leaves unresolved `{n}` in place when args are missing.
 */
export function resolveDescription(
  input: string | undefined | null,
  balancing?: BalancingLike,
): string {
  if (!input) return "";

  const args = extractDescriptionArgs(input, balancing);

  let text = input;

  // 1) Resolve [formula]<statcalc_*> blocks first (consume multiple args)
  text = text.replace(
    /\[([^\]]+)\]<(statcalc_[a-z0-9_]+)>/gi,
    (full, formula: string, tag: string) => {
      if (!formula.includes("{")) {
        return full; // leave for markup strip later
      }
      // Only treat as calc if it looks like a formula with placeholders
      if (!/\{(\d+)\}/.test(formula)) return full;
      const resolved = formatStatCalcFormula(formula, args, tag);
      // If unresolved, keep original formula text without the tag
      if (resolved.startsWith("[") && resolved.endsWith("]")) {
        return formula.replace(/\{(\d+)\}/g, (_, idx) => {
          const v = args[Number(idx)];
          return v === undefined ? `{${idx}}` : formatNumber(v);
        });
      }
      return resolved;
    },
  );

  // 2) Replace remaining plain {n} (and {n}% fraction handling)
  text = text.replace(/\{(\d+)\}(%?)/g, (_, idx: string, pct: string) => {
    const value = args[Number(idx)];
    if (value === undefined) return `{${idx}}${pct}`;
    return `${formatPlainArg(value, pct === "%")}${pct}`;
  });

  return text;
}
