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
  hasQuestEffect?: boolean;
  questRequiredProgress?: number | string;
  questEffect?: unknown;
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

function parseExplicitArgs(balancing: BalancingLike): Arg[] {
  if (!balancing) return [];
  const explicit = balancing.descriptionArgs;
  if (!Array.isArray(explicit) || explicit.length === 0) return [];
  return explicit
    .map((v) => asNumber(v))
    .filter((v): v is number => v !== null);
}

function maxPlaceholderIndex(description: string): number {
  let max = -1;
  for (const m of description.matchAll(/\{(\d+)\}/g)) {
    const idx = Number(m[1]);
    if (idx > max) max = idx;
  }
  return max;
}

function findAbilityTiming(balancing: BalancingLike): {
  duration: number | null;
  delay: number | null;
} {
  if (!balancing) return { duration: null, delay: null };
  const lists = [balancing.abilityActions, balancing.abilityEffects];
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const entry of list) {
      const data = parseEntryFull(entry);
      if (!data) continue;
      const duration = asNumber(data._duration);
      const delay = asNumber(data._delay);
      if (duration !== null || delay !== null) {
        return { duration, delay };
      }
    }
  }
  return { duration: null, delay: null };
}

/**
 * P1: exporter `descriptionArgs` is best-effort and often wrong
 * (e.g. Aria channel: delay dumped as `{0}` instead of `_duration`).
 */
function pickDescriptionArgs(
  description: string,
  balancing: BalancingLike,
): Arg[] {
  if (!balancing) return [];

  const extracted = extractArgsFromEffects(description, balancing);
  const explicit = parseExplicitArgs(balancing);
  const maxIdx = maxPlaceholderIndex(description);

  if (!explicit.length) return extracted;

  // Incomplete exporter args → prefer a fuller effects walk when available.
  if (maxIdx >= 0 && explicit.length <= maxIdx) {
    return extracted.length > explicit.length ? extracted : explicit;
  }

  const { duration, delay } = findAbilityTiming(balancing);
  const firstLooksLikeDelay =
    duration !== null &&
    delay !== null &&
    explicit[0] !== undefined &&
    Math.abs(explicit[0] - delay) <= 0.05 &&
    Math.abs(explicit[0] - duration) > 0.05;

  // Aria / custom Channel: effects walk rebuilds the full arg list correctly.
  if (
    /Channel\b/i.test(description) &&
    firstLooksLikeDelay &&
    extracted[0] !== undefined &&
    Math.abs(extracted[0] - duration!) <= 0.05 &&
    extracted.length > 3
  ) {
    return extracted;
  }

  // Storm / cloud style: only `{0}` is duration; keep remaining exporter args.
  if (
    firstLooksLikeDelay &&
    /for\s*\{0\}\s*seconds/i.test(description)
  ) {
    return [duration!, ...explicit.slice(1)];
  }

  return explicit;
}

/** Walk balancing effect trees (ignores descriptionArgs). */
export function extractArgsFromEffects(
  description: string,
  balancing?: BalancingLike,
): Arg[] {
  if (!balancing) return [];

  const stackArgs = preferSpecialStackArgs(balancing, description);
  if (stackArgs) return stackArgs;

  const out: Arg[] = [];

  collectFromEffectList(
    balancing.abilityActions as unknown[] | undefined,
    out,
    description,
  );

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

function isQuestBalancing(balancing: BalancingLike): boolean {
  if (!balancing) return false;
  if (balancing.hasQuestEffect === true) return true;
  if (balancing.questEffect != null) return true;
  return asNumber(balancing.questRequiredProgress) !== null;
}

function parseQuestRoot(
  balancing: BalancingLike,
): Record<string, unknown> | null {
  if (!balancing?.questEffect) return null;
  return parseEntryFull(balancing.questEffect);
}

function extractQuestObjectiveArgs(
  balancing: BalancingLike,
  _objectiveText: string,
): Arg[] {
  const root = parseQuestRoot(balancing);
  const cond =
    root && typeof root._condition === "object" && root._condition
      ? (root._condition as Record<string, unknown>)
      : null;

  if (cond) {
    const poison = asNumber(cond._poisonThreshold);
    const frost = asNumber(cond._frostThreshold);
    const burn = asNumber(cond._burnThreshold);
    if (poison !== null && frost !== null && burn !== null) {
      return [poison, frost, burn];
    }

    const combined = asNumber(cond._requiredCombinedClassCount);
    if (combined !== null) return [combined];

    const shards = asNumber(cond._requiredAmount);
    if (shards !== null) return [shards];
  }

  const progress =
    asNumber(balancing?.questRequiredProgress) ??
    asNumber(root?._requiredProgress);
  return progress !== null ? [progress] : [];
}

function emitQuestRewardAction(
  action: Record<string, unknown>,
  ctx: {
    out: Arg[];
    percentByStat: Map<number, number>;
    perIncrement: Array<{ value: number; increment: number; statType: number }>;
    teamSizeAmount: number | null;
    critBuff: number | null;
    stunDuration: number | null;
  },
) {
  const type = actionTypeName(action);

  if (type.includes("CriticalAscendancy")) {
    const crit = asNumber(action._critBuff);
    const stun = asNumber(action._stunDuration);
    if (crit !== null) ctx.critBuff = crit;
    if (stun !== null) ctx.stunDuration = stun;
    return;
  }

  if (type.includes("IncrementTeamSize")) {
    const amount = asNumber(action.Amount);
    if (amount !== null) ctx.teamSizeAmount = amount;
    return;
  }

  if (type.includes("ModifyStatByTriggerValuePerIncrement")) {
    const statType = asNumber(action.StatType) ?? 0;
    const increment = asNumber(action.Increment);
    const value = asNumber(action.Value) ?? asNumber(action.Amount) ?? 1;
    if (increment !== null) {
      ctx.perIncrement.push({ value, increment, statType });
    }
    return;
  }

  if (type.includes("ModifyStatPercent")) {
    const statType = asNumber(action.StatType);
    const pct = asNumber(action.Percent);
    if (statType !== null && pct !== null) {
      ctx.percentByStat.set(statType, Math.abs(pct));
    }
    return;
  }

  if (type.includes("ApplyStatusWithDuration")) {
    // Stun-for-duration: prefer Duration over Amount (stack count).
    const duration = asNumber(action.Duration);
    if (duration !== null) {
      ctx.out.push(duration);
      return;
    }
  }

  if (
    type.includes("ApplyStatus") ||
    type.includes("ApplyShield") ||
    type.includes("IncreasePlayerRushDuration") ||
    type.includes("ReducePlayerStallDuration") ||
    type.includes("ModifyStatAction") ||
    type.includes("GainShards")
  ) {
    for (const key of ["Value", "Amount", "Duration", "Percent"] as const) {
      // Shield Amount before Duration; skip Duration when Amount already emitted for shields.
      if (key === "Duration" && type.includes("ApplyShield") && "Amount" in action) {
        continue;
      }
      const n = asNumber(action[key]);
      if (n !== null) {
        ctx.out.push(key === "Percent" ? Math.abs(n) : n);
        if (key === "Value" || key === "Amount") return;
      }
    }
    return;
  }

  emitFromAction(action, ctx.out);
}

function extractQuestRewardArgs(
  balancing: BalancingLike,
  rewardText: string,
): Arg[] {
  const root = parseQuestRoot(balancing);
  if (!root) return [];

  const rewards = root["<Rewards>k__BackingField"];
  if (!Array.isArray(rewards)) return [];

  // "Get {0} random Crest items" — count ItemFromPoolReward entries
  const poolRewards = rewards.filter((reward) => {
    if (!reward || typeof reward !== "object") return false;
    const type = actionTypeName(reward);
    return type.includes("ItemFromPoolReward");
  });
  if (poolRewards.length > 0 && /Crest|random/i.test(rewardText)) {
    return [poolRewards.length];
  }

  const ctx = {
    out: [] as Arg[],
    percentByStat: new Map<number, number>(),
    perIncrement: [] as Array<{
      value: number;
      increment: number;
      statType: number;
    }>,
    teamSizeAmount: null as number | null,
    critBuff: null as number | null,
    stunDuration: null as number | null,
  };
  const thresholds: number[] = [];

  for (const reward of rewards) {
    if (!reward || typeof reward !== "object") continue;
    const effects = (reward as Record<string, unknown>)[
      "<RewardEffects>k__BackingField"
    ];
    if (!Array.isArray(effects)) continue;

    for (const effect of effects) {
      if (!effect || typeof effect !== "object") continue;
      const data = effect as Record<string, unknown>;
      const cond =
        data._condition && typeof data._condition === "object"
          ? (data._condition as Record<string, unknown>)
          : null;
      const threshold = asNumber(cond?._threshold);
      if (threshold !== null) thresholds.push(threshold);

      const actions = data._actions;
      if (!Array.isArray(actions)) continue;
      for (const action of actions) {
        if (action && typeof action === "object") {
          emitQuestRewardAction(action as Record<string, unknown>, ctx);
        }
      }
    }
  }

  if (ctx.critBuff !== null) {
    const args: Arg[] = [ctx.critBuff];
    if (ctx.stunDuration !== null) args.push(ctx.stunDuration);
    return args;
  }

  if (ctx.perIncrement.length > 0) {
    // Conduit copy: "{0} Magic and {1} Attack per {2} Status"
    const ordered = [...ctx.perIncrement].sort((a, b) => {
      const rank = (s: number) => (s === 7 ? 0 : s === 6 ? 1 : 10 + s);
      return rank(a.statType) - rank(b.statType);
    });
    const values = ordered.map((p) => p.value);
    const increment = ordered[0].increment;
    return [...values, increment];
  }

  if (ctx.teamSizeAmount !== null) {
    const max =
      // Dump often omits Max; Mandates are +1 capped at 1.
      ctx.teamSizeAmount;
    return [ctx.teamSizeAmount, max];
  }

  // "reaches {0} Poison, lose {1}% Max HP / {2}% Attack / {3}% AS"
  if (
    thresholds.length > 0 &&
    /reaches/i.test(rewardText) &&
    ctx.percentByStat.size >= 2
  ) {
    const th = thresholds[0];
    const maxHp = ctx.percentByStat.get(1);
    const attack = ctx.percentByStat.get(6);
    const attackSpeed = ctx.percentByStat.get(9);
    if (maxHp !== undefined && attack !== undefined && attackSpeed !== undefined) {
      return [th, maxHp, attack, attackSpeed];
    }
  }

  // "reaches {0} Frost, Stun for {1} seconds" / "reaches {0} Burn, inflict {1}"
  if (thresholds.length > 0 && /reaches/i.test(rewardText)) {
    return [thresholds[0], ...ctx.out];
  }

  if (ctx.percentByStat.size > 0 && ctx.out.length === 0) {
    return [...ctx.percentByStat.values()];
  }

  return ctx.out;
}

function applyArgsToText(text: string, args: Arg[]): string {
  let out = text;

  out = out.replace(
    /\[([^\]]+)\]<(statcalc_[a-z0-9_]+)>/gi,
    (full, formula: string, tag: string) => {
      if (!formula.includes("{") || !/\{(\d+)\}/.test(formula)) return full;
      const resolved = formatStatCalcFormula(formula, args, tag);
      if (resolved.startsWith("[") && resolved.endsWith("]")) {
        return formula.replace(/\{(\d+)\}/g, (_: string, idx: string) => {
          const v = args[Number(idx)];
          return v === undefined ? `{${idx}}` : formatNumber(v);
        });
      }
      return resolved;
    },
  );

  out = out.replace(/\{(\d+)\}(%?)/g, (_: string, idx: string, pct: string) => {
    const value = args[Number(idx)];
    if (value === undefined) return `{${idx}}${pct}`;
    return `${formatPlainArg(value, pct === "%")}${pct}`;
  });

  return out;
}

/**
 * Quest templates reuse `{0}` for objective vs reward with different values.
 * Resolve paragraphs separately: first = objective, rest = reward.
 */
function resolveQuestDescription(
  input: string,
  balancing: BalancingLike,
): string | null {
  if (!balancing || !isQuestBalancing(balancing)) return null;
  if (!/\{(\d+)\}/.test(input)) return null;

  const parts = input.split(/\n\n+/);
  if (parts.length >= 2) {
    const objective = applyArgsToText(
      parts[0],
      extractQuestObjectiveArgs(balancing, parts[0]),
    );
    const rewardBody = parts.slice(1).join("\n\n");
    const reward = applyArgsToText(
      rewardBody,
      extractQuestRewardArgs(balancing, rewardBody),
    );
    return `${objective}\n\n${reward}`;
  }

  // Single block: objective-style progress / condition thresholds only.
  const args = extractQuestObjectiveArgs(balancing, input);
  if (!args.length) return null;
  return applyArgsToText(input, args);
}

/** Extract ordered format args for a description from balancing data. */
export function extractDescriptionArgs(
  description: string,
  balancing?: BalancingLike,
): Arg[] {
  if (!balancing) return [];

  // Quest relics: callers should use resolveQuestDescription; expose objective args.
  if (isQuestBalancing(balancing)) {
    return extractQuestObjectiveArgs(balancing, description);
  }

  return pickDescriptionArgs(description, balancing);
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

  // P0: quest relics reuse `{0}` across objective/reward with different values.
  const questResolved = resolveQuestDescription(input, balancing);
  if (questResolved !== null) return questResolved;

  const args = extractDescriptionArgs(input, balancing);
  return applyArgsToText(input, args);
}
