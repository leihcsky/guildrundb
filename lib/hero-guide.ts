import fs from "fs";
import path from "path";
import type { GameAbility, Hero, HeroSpecialization, Relic } from "@/types";
import { getTagDefinition } from "@/lib/tags";

/** Optional Phase B hand-written overlay (`content/meta/hero-guides/{slug}.json`). */
export type HeroGuideOverride = {
  roleLabel?: string;
  bestFor?: string;
  strength?: string;
  weakness?: string;
  howToPlay?: {
    early?: string;
    mid?: string;
    late?: string;
    positioning?: string;
  };
  /** Keyed by ability name */
  abilityNotes?: Record<string, string>;
  /** Keyed by specialization name */
  specNotes?: Record<string, string>;
  /** Keyed by relic slug */
  relicReasons?: Record<string, string>;
  faq?: Array<{ question: string; answer: string }>;
  tips?: string[];
};

export type HeroGuideModel = {
  source: "auto" | "hybrid";
  roleLabel: string;
  bestFor: string;
  strength: string;
  weakness: string;
  howToPlay: {
    early: string;
    mid: string;
    late: string;
    positioning: string;
  };
  abilityNotes: Record<string, string>;
  specNotes: Record<string, string>;
  relicReasons: Record<string, string>;
  faq: Array<{ question: string; answer: string }>;
  tips: string[];
};

type ClassPlaybook = {
  bestFor: string;
  strength: string;
  weakness: string;
  early: string;
  mid: string;
  late: string;
  positioning: string;
};

const CLASS_PLAYBOOKS: Record<string, ClassPlaybook> = {
  mage: {
    bestFor: "Back-line Magic carries and status engines",
    strength: "High cast payoff when the fight lasts long enough to dump spells",
    weakness: "Fragile if the front line collapses or dive reaches the back row",
    early: "Keep them alive to the first cast cycle; buy a frontliner before greed upgrades",
    mid: "Rank the Mage and pick relics that match their Burn, Frost, or Crit tags",
    late: "Stack Magic / mana tempo and protect cast windows with shields or Stall",
    positioning: "Back row, angled away from leap / dive approaches when you can",
  },
  mystic: {
    bestFor: "Shield, sustain, and team-wide utility pivots",
    strength: "Turns stable boards into durable engines once ranks and relics land",
    weakness: "Low solo damage — falls behind if you never build a real carry",
    early: "Use them to stabilize shops; do not expect them to clear packs alone",
    mid: "Invest when your damage carry is online and you need uptime or shields",
    late: "Layer Shield / heal relics and keep them casting every fight",
    positioning: "Mid or back row behind a tank, close enough for aura / shield range",
  },
  warrior: {
    bestFor: "Melee tempo, shield loops, and mid-board brawling",
    strength: "Reliable personal combat stats that itemize cleanly",
    weakness: "Can stall out if the run never finds a spike relic or rank path",
    early: "Contest the front-mid line and take ranks that match their kit fantasy",
    mid: "Itemize Attack / Defense / Shields depending on the active",
    late: "Commit to one specialization branch and feed matching relics",
    positioning: "Front-mid; leave one tile of space if splash or adjacent enemies punish clumps",
  },
  duelist: {
    bestFor: "Attack Speed, Rush windows, and late scaling DPS",
    strength: "Snowballs hard once Rush / AS / Crit loops are online",
    weakness: "Needs setup time and dies if forced to tank the opener",
    early: "Survive; buy AS / Rush pieces before forcing them as the only frontliner",
    mid: "Stack the tempo tags on their kit and rank them toward the carry path",
    late: "Lean into Rush or Crit relics and keep fights long enough to scale",
    positioning: "Mid or safe side lane — not first-contact unless the kit is built for it",
  },
  assassin: {
    bestFor: "Execution, Crit finishers, and back-line pressure",
    strength: "Deletes priority targets when Crit and positioning line up",
    weakness: "Whiffs hard on the wrong target order or without Crit support",
    early: "Do not overcommit Shards until you see a clear carry path",
    mid: "Pair with Crit / execute relics and a board that holds the line",
    late: "Itemize Crit and keep them off the opening volley",
    positioning: "Back or far lane so they hit the intended target, not the first tank",
  },
  vanguard: {
    bestFor: "High Max HP front pressure, Rush bruisers, and aura tanks",
    strength: "Absorbs first contact while still contributing damage or Burn",
    weakness: "Eats economy if you rank them without a damage plan behind",
    early: "Park them on the point of first contact and buy HP / Rush pieces",
    mid: "Decide whether they are pure frontline or a secondary carry",
    late: "Stack Max HP / Rush synergies and keep adjacent allies intentional",
    positioning: "True front row on the expected engage tile",
  },
  tank: {
    bestFor: "Formation anchors, Poison / status front lines, and team peels",
    strength: "Buys cast time for the entire board",
    weakness: "Low clear speed — you still need a damage partner",
    early: "Draft them when packs punish fragile openings",
    mid: "Itemize Defense / Max HP / status and hold the line for carries",
    late: "Add retaliate or aura relics once the board is stable",
    positioning: "Front-center or wherever the heaviest pack path lands",
  },
};

const DEFAULT_PLAYBOOK: ClassPlaybook = {
  bestFor: "Flexible board pieces that fill a missing job",
  strength: "Useful whenever their class tags match your relic direction",
  weakness: "Needs a clear job — do not draft without a plan for the next fights",
  early: "Identify their job (tank, damage, or support) before heavy Shard spend",
  mid: "Rank toward the branch that matches your strongest relics",
  late: "Commit to the tags already on their abilities",
  positioning: "Place by job: tanks front, carries back, supports mid-back",
};

function primaryCombatTags(hero: Hero): string[] {
  const combat = new Set([
    "rush",
    "stall",
    "crit",
    "shield",
    "burn",
    "poison",
    "frost",
    "shard",
  ]);
  return hero.tags.filter((tag) => combat.has(tag)).slice(0, 4);
}

function tagLabels(ids: string[]): string[] {
  return ids.map((id) => getTagDefinition(id)?.label || id);
}

function playbookFor(hero: Hero): ClassPlaybook {
  for (const slug of hero.classSlugs) {
    if (CLASS_PLAYBOOKS[slug]) return CLASS_PLAYBOOKS[slug];
  }
  if (hero.classSlug && CLASS_PLAYBOOKS[hero.classSlug]) {
    return CLASS_PLAYBOOKS[hero.classSlug];
  }
  return DEFAULT_PLAYBOOK;
}

function refineWithTags(playbook: ClassPlaybook, tags: string[]): ClassPlaybook {
  const labels = tagLabels(tags);
  if (labels.length === 0) return playbook;

  const focus = labels.slice(0, 2).join(" / ");
  return {
    ...playbook,
    bestFor: `${playbook.bestFor} (lean ${focus})`,
    mid: `${playbook.mid} Prioritize ${focus} relics when the shop offers them.`,
  };
}

function abilityNoteFor(ability: GameAbility): string {
  const tags = ability.tags || [];
  const labels = tagLabels(tags).slice(0, 3);

  if (tags.includes("rush")) {
    return "Play around Rush windows: pair Rush relics and do not expect burst before the threshold.";
  }
  if (tags.includes("stall")) {
    return "Values Stall tempo — stall-trigger relics and a board that lives into mid-fight pay off.";
  }
  if (tags.includes("shield")) {
    return "Shield loops are the point: itemize to cast often and add Shield synergy relics.";
  }
  if (tags.includes("crit")) {
    return "Crit is the multiplier — lean Crit relics/items once the baseline kit is online.";
  }
  if (tags.includes("burn") || tags.includes("poison") || tags.includes("frost")) {
    return `Status engine: stack ${labels.join(" / ") || "DoT"} and keep enemies in the zone long enough to cook.`;
  }
  if (labels.length > 0) {
    return `Lean into ${labels.join(" / ")} — itemize the stats this ability already scales with.`;
  }
  return "Treat the numbers as a scaling loop: feed the stats and tags this ability already uses.";
}

function specNoteFor(spec: HeroSpecialization, hero: Hero): string {
  if (spec.description) {
    return `Take when you want this run to follow “${spec.name}” instead of the other Rank B branches.`;
  }
  return `Optional Rank B path for ${hero.name} — pick it when the shop already supports that fantasy.`;
}

function relicReasonFor(hero: Hero, relic: Relic): string {
  const overlap = relic.tags.filter((tag) => hero.tags.includes(tag) || hero.classSlugs.includes(tag));
  const labels = tagLabels(overlap).slice(0, 3);
  if (labels.length > 0) {
    return `Matches ${hero.name}'s ${labels.join(" / ")} tags.`;
  }
  if (hero.classSlugs.some((slug) => relic.tags.includes(slug))) {
    return `Aligned with ${hero.class || "this hero's"} class keyword pool.`;
  }
  return `Strong general synergy piece for ${hero.name}'s kit direction.`;
}

function loadHeroGuideOverride(slug: string): HeroGuideOverride | null {
  const filePath = path.join(
    process.cwd(),
    "content",
    "meta",
    "hero-guides",
    `${slug}.json`,
  );
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as HeroGuideOverride;
    return raw && typeof raw === "object" ? raw : null;
  } catch {
    return null;
  }
}

export function buildHeroGuide(
  hero: Hero,
  synergyRelics: Relic[],
): HeroGuideModel {
  const override = loadHeroGuideOverride(hero.slug);
  const tags = primaryCombatTags(hero);
  const playbook = refineWithTags(playbookFor(hero), tags);
  const classLabel = hero.class || hero.classSlugs.join(" / ") || "Flexible";

  const abilityNotes: Record<string, string> = {};
  if (hero.activeAbility) {
    abilityNotes[hero.activeAbility.name] = abilityNoteFor(hero.activeAbility);
  }
  for (const passive of hero.passiveAbilities) {
    abilityNotes[passive.name] = abilityNoteFor(passive);
  }

  const specNotes: Record<string, string> = {};
  for (const spec of hero.specializations) {
    specNotes[spec.name] = specNoteFor(spec, hero);
  }

  const relicReasons: Record<string, string> = {};
  for (const relic of synergyRelics.slice(0, 3)) {
    relicReasons[relic.slug] = relicReasonFor(hero, relic);
  }

  const tagPhrase =
    tagLabels(tags).slice(0, 3).join(", ") || classLabel.toLowerCase();
  const relicNames = synergyRelics
    .slice(0, 3)
    .map((relic) => relic.name)
    .join(", ");

  const faq = [
    {
      question: `Is ${hero.name} good in Guildrun?`,
      answer: `${hero.name} is a solid pickup when the shop supports their job. As a ${classLabel} (${hero.role || playbook.bestFor}), they shine in ${playbook.bestFor.toLowerCase()}. Skip or bench them if you cannot cover their weakness: ${playbook.weakness.charAt(0).toLowerCase()}${playbook.weakness.slice(1)}`,
    },
    {
      question: `What class is ${hero.name}?`,
      answer: `${hero.name} is ${classLabel}${hero.classSlugs.length > 1 ? ` (${hero.classSlugs.join(" + ")})` : ""}. ${hero.role ? `Role focus: ${hero.role}.` : ""}`,
    },
    {
      question: `What relics work with ${hero.name}?`,
      answer: relicNames
        ? `Start with pieces that hit ${tagPhrase}. Strong overlaps on this page include ${relicNames}. Open each relic for the full effect text.`
        : `Look for relics tagged ${tagPhrase} and anything that accelerates their active cast or survival.`,
    },
    {
      question: `How do you play ${hero.name}?`,
      answer: `Early: ${playbook.early} Mid: ${playbook.mid} Late: ${playbook.late} Positioning: ${playbook.positioning}`,
    },
  ];

  const auto: HeroGuideModel = {
    source: "auto",
    roleLabel: hero.role || playbook.bestFor,
    bestFor: playbook.bestFor,
    strength: playbook.strength,
    weakness: playbook.weakness,
    howToPlay: {
      early: playbook.early,
      mid: playbook.mid,
      late: playbook.late,
      positioning: playbook.positioning,
    },
    abilityNotes,
    specNotes,
    relicReasons,
    faq,
    tips: [],
  };

  if (!override) return auto;

  return {
    source: "hybrid",
    roleLabel: override.roleLabel?.trim() || auto.roleLabel,
    bestFor: override.bestFor?.trim() || auto.bestFor,
    strength: override.strength?.trim() || auto.strength,
    weakness: override.weakness?.trim() || auto.weakness,
    howToPlay: {
      early: override.howToPlay?.early?.trim() || auto.howToPlay.early,
      mid: override.howToPlay?.mid?.trim() || auto.howToPlay.mid,
      late: override.howToPlay?.late?.trim() || auto.howToPlay.late,
      positioning:
        override.howToPlay?.positioning?.trim() || auto.howToPlay.positioning,
    },
    abilityNotes: { ...auto.abilityNotes, ...override.abilityNotes },
    specNotes: { ...auto.specNotes, ...override.specNotes },
    relicReasons: { ...auto.relicReasons, ...override.relicReasons },
    faq:
      override.faq && override.faq.length > 0
        ? override.faq
        : auto.faq,
    tips: override.tips?.length ? override.tips : auto.tips,
  };
}
