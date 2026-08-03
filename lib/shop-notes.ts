import type { Item, Relic } from "@/types";
import { getTagDefinition } from "@/lib/tags";

export type ShopDecisionNotes = {
  bestFor: string;
  skipWhen: string;
  shopNote: string;
  /** Rule-built for now; reserved for future JSON overlays. */
  source: "auto";
};

type TagBuckets = {
  classes: string[];
  combat: string[];
  stats: string[];
};

const CLASS_IDS = new Set([
  "warrior",
  "tank",
  "vanguard",
  "assassin",
  "duelist",
  "mystic",
  "mage",
]);

const COMBAT_IDS = new Set([
  "rush",
  "crit",
  "stall",
  "shield",
  "burn",
  "poison",
  "frost",
  "shard",
  "stealth",
  "stun",
  "heal",
  "omnivamp",
  "debuff",
  "taunt",
]);

function labelFor(id: string) {
  return getTagDefinition(id)?.label ?? id;
}

function joinList(labels: string[], max = 3) {
  const slice = labels.slice(0, max);
  if (slice.length === 0) return "";
  if (slice.length === 1) return slice[0];
  if (slice.length === 2) return `${slice[0]} and ${slice[1]}`;
  return `${slice.slice(0, -1).join(", ")}, and ${slice[slice.length - 1]}`;
}

function bucketTags(tags: string[]): TagBuckets {
  const classes: string[] = [];
  const combat: string[] = [];
  const stats: string[] = [];
  const seen = new Set<string>();

  for (const raw of tags) {
    const id = raw.toLowerCase();
    if (seen.has(id)) continue;
    seen.add(id);
    const def = getTagDefinition(id);
    if (def?.category === "class" || CLASS_IDS.has(id)) {
      classes.push(labelFor(id));
    } else if (def?.category === "combat" || COMBAT_IDS.has(id)) {
      combat.push(labelFor(id));
    } else if (def?.category === "stat") {
      stats.push(labelFor(id));
    }
  }

  return { classes, combat, stats };
}

function rarityTier(rarity: string | undefined) {
  const r = (rarity ?? "").toLowerCase();
  if (r.includes("enemy") || r.includes("actboss")) return "enemy" as const;
  if (r.includes("singlebattle") || r.includes("boost")) return "boost" as const;
  if (r.includes("quest")) return "quest" as const;
  if (r.includes("teamsize")) return "meta" as const;
  if (r.includes("unique")) return "unique" as const;
  if (r.includes("legendary") || r.includes("mythic")) return "legendary" as const;
  if (r.includes("epic")) return "epic" as const;
  if (r.includes("rare")) return "rare" as const;
  if (r.includes("uncommon")) return "uncommon" as const;
  if (r.includes("common")) return "common" as const;
  return "unknown" as const;
}

function nameRole(name: string) {
  const n = name.toLowerCase();
  if (n.includes("banner")) return "banner" as const;
  if (n.includes("engine")) return "engine" as const;
  if (n.includes("filigree")) return "filigree" as const;
  if (n.includes("prism")) return "prism" as const;
  if (n.includes("amplifier")) return "amplifier" as const;
  if (n.includes("conduit")) return "conduit" as const;
  if (n.includes("ascendancy")) return "spike" as const;
  if (n.includes("fluctuator") || n.includes("accumulator")) return "stacker" as const;
  return "generic" as const;
}

function effectSignals(text: string) {
  const t = text.toLowerCase();
  return {
    onKill: /\bon kill\b|\bkills?\b/.test(t),
    onRush: /\brush\b/.test(t),
    onStall: /\bstall\b/.test(t),
    teamWide: /\ballies\b|\bnearby\b|\bteam\b|\bheroes are\b/.test(t),
    permanent: /\bpermanent\b|\bpermanently\b/.test(t),
    conditional: /\bif\b|\bwhen\b|\bafter\b|\bfor rush\b|\bstall \(/.test(t),
  };
}

function buildRelicBestFor(relic: Relic, buckets: TagBuckets, role: ReturnType<typeof nameRole>) {
  const { classes, combat } = buckets;
  const classBit = classes.length
    ? `${joinList(classes)} boards`
    : "boards that already fire the keywords on this relic";
  const combatBit = combat.length ? `built around ${joinList(combat)}` : "that can trigger its conditions every fight";

  switch (role) {
    case "banner":
      return `Best for ${classBit} that want a class identity piece — take it when you are committing that class, not dabbling.`;
    case "engine":
      return `Best for ${classBit} that need a fight-to-fight payoff loop ${combatBit}.`;
    case "filigree":
    case "prism":
      return `Best as a power spike on ${classBit} once the core loop is online.`;
    case "amplifier":
      return `Best when you already have the matching martial or defensive fantasy and want a clean multiplier.`;
    case "conduit":
    case "stacker":
      return `Best for runs that trigger ${combat.length ? joinList(combat) : "its keyword"} often enough to stack value across fights.`;
    case "spike":
      return `Best as a late luxury when ${combatBit} and you can afford a high-rarity slot.`;
    default:
      return `Best for ${classBit} ${combatBit}.`;
  }
}

function buildRelicSkipWhen(relic: Relic, buckets: TagBuckets, role: ReturnType<typeof nameRole>, signals: ReturnType<typeof effectSignals>) {
  const { classes, combat } = buckets;
  const parts: string[] = [];

  if (classes.length) {
    parts.push(`you are not running ${joinList(classes)}`);
  }
  if (combat.length) {
    parts.push(`you rarely trigger ${joinList(combat)}`);
  }
  if (signals.onKill) {
    parts.push("you cannot secure kills to pay the on-kill line");
  }
  if (role === "banner" || role === "engine") {
    parts.push("this would be your only piece of that fantasy");
  }
  if (rarityTier(relic.rarity) === "unique" || rarityTier(relic.rarity) === "legendary") {
    parts.push("a cheaper enabler would stabilize the board first");
  }
  if (parts.length === 0) {
    return "Skip when you cannot activate the effect text most fights — dead conditions beat pretty rarity.";
  }
  return `Skip when ${parts.slice(0, 3).join(", or ")}.`;
}

function buildRelicShopNote(relic: Relic, buckets: TagBuckets, role: ReturnType<typeof nameRole>, signals: ReturnType<typeof effectSignals>) {
  const tier = rarityTier(relic.rarity);
  const rarityLabel = relic.rarity?.trim() || "Unknown rarity";

  const slot =
    role === "banner" || role === "engine"
      ? "engine / identity piece"
      : role === "filigree" || role === "prism" || role === "amplifier"
        ? "mid–late power spike"
        : role === "spike" || tier === "unique" || tier === "legendary"
          ? "late luxury"
          : tier === "common" || tier === "uncommon"
            ? "early enabler"
            : "flex shop piece";

  const triggerHint = signals.conditional
    ? " Read the trigger line before you lock it — condition frequency matters more than the number."
    : signals.teamWide
      ? " Team-wide text wants multiple allies that share the tag."
      : "";

  const combatHint = buckets.combat.length
    ? ` Stack ${joinList(buckets.combat)} support around it.`
    : "";

  return `${rarityLabel} ${slot}. Prefer it when the board already leans this direction.${combatHint}${triggerHint}`;
}

export function buildRelicShopNotes(relic: Relic): ShopDecisionNotes {
  const buckets = bucketTags(relic.tags);
  const role = nameRole(relic.name);
  const signals = effectSignals(relic.effect || "");
  const tier = rarityTier(relic.rarity);

  if (tier === "enemy") {
    return {
      bestFor: "Reference entry for enemy or boss-linked effects — useful for understanding what you are fighting, not a normal shop buy.",
      skipWhen: "Do not treat this like a draft relic; it is documentation for encounter pressure.",
      shopNote: `${relic.rarity || "Enemy"} entry. Use it to plan formation and sustain, not as a pickup checklist item.`,
      source: "auto",
    };
  }

  if (tier === "boost") {
    return {
      bestFor: "Single-battle or temporary boost windows where the keyword payoff is immediate.",
      skipWhen: "You need lasting run-long scaling more than a one-fight spike.",
      shopNote: `${relic.rarity || "Boost"} — short-horizon power. Take it to win the next hard fight, then reassess.`,
      source: "auto",
    };
  }

  if (tier === "quest") {
    return {
      bestFor: buildRelicBestFor(relic, buckets, role),
      skipWhen: "The quest line or unlock condition is not realistic for this run.",
      shopNote: `${relic.rarity || "Quest relic"} — check unlock/quest text first; the effect only matters if you can complete the line.`,
      source: "auto",
    };
  }

  if (tier === "meta") {
    return {
      bestFor: "Runs where party size or meta constraints are the real bottleneck.",
      skipWhen: "Your board already has the slot count it needs and this would crowd better combat relics.",
      shopNote: "Meta / team-size style relic — buy for structure, not raw damage numbers.",
      source: "auto",
    };
  }

  return {
    bestFor: buildRelicBestFor(relic, buckets, role),
    skipWhen: buildRelicSkipWhen(relic, buckets, role, signals),
    shopNote: buildRelicShopNote(relic, buckets, role, signals),
    source: "auto",
  };
}

function buildItemBestFor(item: Item, buckets: TagBuckets) {
  const { classes, combat, stats } = buckets;
  if (classes.length && combat.length) {
    return `Best for ${joinList(classes)} heroes who lean on ${joinList(combat)}.`;
  }
  if (classes.length) {
    return `Best for ${joinList(classes)} carries or supports that match this item’s class keyword.`;
  }
  if (combat.length) {
    return `Best for boards already stacking ${joinList(combat)} so the item pays every fight.`;
  }
  if (stats.length) {
    return `Best when you need a clean ${joinList(stats)} bump on the hero who is already carrying the plan.`;
  }
  if (item.stats?.trim()) {
    return "Best as a flexible gear slot when the effect text matches your current carry’s job.";
  }
  return "Best as a temporary explore pick until more keyword data lands for this item.";
}

function buildItemSkipWhen(item: Item, buckets: TagBuckets) {
  const { classes, combat, stats } = buckets;
  const parts: string[] = [];
  if (classes.length) parts.push(`your carry is not ${joinList(classes)}`);
  if (combat.length) parts.push(`you are not playing ${joinList(combat)}`);
  if (stats.length) parts.push(`another hero needs the ${joinList(stats)} more`);
  if (!item.stats?.trim()) {
    parts.push("you are forcing it without knowing the effect");
  }
  if (parts.length === 0) {
    return "Skip when a different item more clearly advances your win condition this shop.";
  }
  return `Skip when ${parts.slice(0, 3).join(", or ")}.`;
}

function buildItemShopNote(item: Item, buckets: TagBuckets) {
  const { classes, combat, stats } = buckets;
  if (!item.stats?.trim()) {
    return "Effect text is incomplete in the dump — use keywords and related heroes as a shortlist, then confirm in-game before committing Shards.";
  }
  if (classes.length) {
    return `Class-tagged gear: park it on a ${joinList(classes)} unit first. Treat off-class greed as a last resort.`;
  }
  if (combat.length) {
    return `Keyword gear for ${joinList(combat)}. Buy it to reinforce a loop you already cast or trigger, not to invent one from nothing.`;
  }
  if (stats.length) {
    return `Stat stick focused on ${joinList(stats)}. Give it to the hero whose job improves most from that stat this fight.`;
  }
  return "General gear — compare the effect to your carry’s job and only buy if it shortens the path to winning the next spike fight.";
}

export function buildItemShopNotes(item: Item): ShopDecisionNotes {
  const buckets = bucketTags(item.tags);
  return {
    bestFor: buildItemBestFor(item, buckets),
    skipWhen: buildItemSkipWhen(item, buckets),
    shopNote: buildItemShopNote(item, buckets),
    source: "auto",
  };
}
