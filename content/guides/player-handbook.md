---
title: "Guildrun Player Handbook — Positioning, Targeting & Combat Rules"
description: "A Demo 0.5.7 player handbook for Guildrun combat: first contact, formation jobs, cast windows, adjacency, and how to place so auto-battle stops deleting your carry."
updatedAt: 2026-09-05
tags:
  - handbook
  - positioning
  - combat
  - targeting
  - strategy
  - beginner
---

Combat in Guildrun is automatic. That does not mean placement is optional. Between fights you choose the board geometry; during the fight the game resolves pathing, targeting, casts, and keyword windows without you. This **Player Handbook** is the reference for that layer on Demo **0.5.7**.

Use it when:

- a carry dies in the opening seconds,
- a Mage never finishes a channel,
- an aura / neighbor buff never appears,
- or you keep blaming “DPS” after every wipe.

For the full run loop, start with [Getting Started](/guides/getting-started). For post-fight diagnosis, use [Why did I wipe?](/guides/fight-loss-checklist). For how to spend after you know the problem, use [Shop order](/guides/shop-order-shards).

## What this handbook is (and is not)

**It is:** a decision manual for formation, first contact, cast windows, and board language.

**It is not:** a hero tier list, a relic dump, or a claim that one placement always wins. Shop seed, enemy range, and your engine (Rush vs Stall) still move the correct answer.

If a tooltip mentions **Adjacent**, open [Adjacent positioning](/guides/adjacent-positioning) for the neighbor-specific catalog.

## The only question combat asks

After every fight, ask:

> Did the **right hero** take the **first meaningful hit**, and did my **win condition** get a window to work?

Everything else — Rank spikes, Uniques, crit items — is secondary if that answer is no.

## Formation jobs (name them before you place)

Do not place by “who looks cool in front.” Place by **job**:

| Job | Typical classes | What they must do |
| --- | --- | --- |
| **Wall** | [Tank](/classes/tank), [Vanguard](/classes/vanguard), durable [Warrior](/classes/warrior) | Eat first contact; fail the plan if they die instantly with no peel behind them. |
| **Carry** | [Duelist](/classes/duelist), [Mage](/classes/mage), backline [Assassin](/classes/assassin) | Deal the damage / channel that wins the fight *if they live*. |
| **Enabler** | [Mystic](/classes/mystic), control / shield supports | Keep the wall up or keep the fight on your clock (Shield, Stall, peel). |
| **Flex** | Dual-class or economy pieces | Answer the matchup (extra Frost, Burn, second wall, Shard loop). |

A board with three carries and no wall is not aggressive — it is unfinished. Browse [Heroes](/heroes) when you are unsure which job a name actually fills.

## First contact: the free win you keep giving away

Most early wipes are **opener geometry**, not missing legendaries.

### Put a real body on the entry hex

Melee packs walk toward reachable heroes. If your only [Nyx](/heroes/nyx), [Irini](/heroes/irini), or [Aria](/heroes/aria) sits on the dive tile, the opener deletes the win condition before ranks matter.

**Default:**

- Wall front-center (or on the lane the pack actually enters).
- Carry mid/back, off the first step.
- Fragile Mystics never solo the front row.

### Soft targets attract trouble

Even when a tank is present, a squishy on an exposed corner can still eat pathing priority if they are closer or more “attractive” to the AI than the wall. After a loss, watch **who took the first hit**, not who had the highest Attack.

**Pass condition:** a disposable or dedicated frontliner absorbs the opening volley, and your carry is still acting when the pack thins.

## Rows, pockets, and “dive tiles”

Think in three bands:

1. **Front** — walls and contact bruisers.
2. **Pocket / second row** — secondary melee, some Duelists, heroes who need to be close but not first.
3. **Back** — long-range Assassins, Mystics, channel Mages.

**Dive tiles** are hexes enemies leap to or path through first. Do not park your only healer or channel Mage there “because it looked centered.”

After a wipe, move **one** piece before you open the shop. If the same hero dies first three fights in a row, stop buying damage for them until placement and a wall are fixed — same rule as the [fight-loss checklist](/guides/fight-loss-checklist).

## Cast windows (Mages, Mystics, long channels)

Automatic combat still has timing:

- Mana has to arrive.
- The pack has to stand in the beam / field / cone.
- The caster has to be alive for the full channel.

### Placement checks for casters

- [Aria](/heroes/aria)-style beams: aim down the lane packs actually occupy; re-angle after losses before rerolling relics.
- Field / zone Mystics ([Pollen](/heroes/pollen), [Gustav](/heroes/gustav)): put the zone where bodies fight, not empty back corners.
- Supports ([Grace](/heroes/grace), [Fiona](/heroes/fiona)): survive long enough to cast — they are not frontline replacements.

### Shop checks that look like “placement”

If the caster never fires, sometimes the fix is Mana Regen or Rush/Stall tempo — but **never** buy that while they still die on contact. Alive first, then uptime.

## Facing, cones, and “the pack stood beside the plan”

Some kits care about **facing** or frontal geometry (Fault Line–style walls, cones, beams). Symptoms:

- Stun / smash never lands.
- AoE hits one stray instead of the clump.
- You “had the relic” but the replay shows empty air.

**Fixes:**

- Rotate the wall so the pack walks into the cone, not past it.
- Clump enemies with a real frontline instead of kiting yourself into a diagonal mess.
- For beam carries, treat geometry as a skill check equal to itemization — see [Aria Stall Mage](/builds/aria-stall-mage) notes.

## Adjacency without rewriting the adjacent guide

Many Shields, auras, and “exactly one neighbor” modifiers only work if hex neighbors are intentional.

**Quick rules:**

- Pair aura carriers with the ally who should receive the buff.
- Leave gaps when enemy cleave / splash punishes blobs.
- Do not expect adjacent text to work on a lonely island hero.

Deep catalog: [Adjacent positioning](/guides/adjacent-positioning).

## Rush vs Stall is also a placement problem

Tempo engines assume a fight length:

- **Rush** boards want clean early kills and living Duelists — a dead Nyx is a dead clock. See [Rush vs Stall](/guides/rush-vs-stall).
- **Stall** boards want the pack to stay on the map — if your wall evaporates, Stall payoffs never cook.

Placement that lets the wrong hero die first breaks both clocks. Fix geometry before you buy a second Acceleration or Deceleration Unique.

## A 30-second pre-fight checklist

1. Who is the **wall** on first contact?
2. Who is the **carry**, and are they off the dive tile?
3. Does any aura / adjacent line have a **real neighbor**?
4. If I have a beam / cone / field, does the pack **stand in it**?
5. If this is a Rush board, can my Rush pieces **live** long enough to trigger?
6. If this is a Stall board, can the fight **last** long enough to matter?

If you cannot answer (1) and (2), do not open the shop yet — move hexes first.

## Common handbook failures

- Three glass carries, zero wall.
- Healer alone on the entry hex.
- Channel Mage aimed at empty space.
- Adjacent relic on a solo island.
- Buying Crit items for a carry who dies before the first auto.
- Changing placement, ranks, *and* relics after one loss (learn nothing).

Change **one** variable per fight when practicing: usually placement.

## How to use Guildrun Hub with this handbook

- Hero pages: kit range, actives, and whether the fantasy is wall / carry / enabler.
- [Classes](/classes): role shape before you lock a draft.
- [Builds](/builds) / [Tier List](/tier-list): example formations that already name jobs.
- [Keywords](/keywords): when a relic assumes Rush, Stall, Shield, or Crit every combat.

## Closing

Guildrun’s combat layer is unfair only if you treat auto-battle as “no decisions.” Your decisions are **who stands where** and **who is allowed to eat the opener**. Master that, and ranks and relics start looking like multipliers instead of lottery tickets.

Next reads: [Growth route (Rank C→S)](/guides/growth-route) for how the board should grow between fights, and [Getting Started](/guides/getting-started) if you still need the full Demo loop.
