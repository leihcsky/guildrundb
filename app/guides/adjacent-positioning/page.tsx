import type { Metadata } from "next";
import Link from "next/link";
import { AdjacentEntryList } from "@/components/guides/adjacent-entry-list";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ADJACENT_GUIDE, getAdjacentRelatedContent } from "@/lib/adjacent";
import {
  breadcrumbJsonLd,
  buildGameEntityMetadata,
  entityJsonLd,
} from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = buildGameEntityMetadata({
  name: ADJACENT_GUIDE.title,
  kind: "guide",
  description: ADJACENT_GUIDE.description,
  path: `/guides/${ADJACENT_GUIDE.slug}`,
});

const GROUP_COPY = {
  "ally-buff": {
    title: "Ally adjacency — buffs and shields",
    intro:
      "These effects care about heroes standing next to each other: start-of-combat shields, Max HP, or healing that lands on neighbors.",
  },
  "enemy-pressure": {
    title: "Enemy adjacency — auras and cleave",
    intro:
      "Frontline kits that punish units standing next to the owner: aura damage, retaliate splash, or stun on adjacent enemies.",
  },
  "pair-formation": {
    title: "Exactly one neighbor",
    intro:
      "Rank modifiers that only fire when a hero is adjacent to exactly one other hero. Park a clean duo — a third neighbor turns the buff off.",
  },
  "positional-trigger": {
    title: "Positional triggers and splash",
    intro:
      "Effects that use adjacency as a condition or splash rule: hits around a target, heals allies next to a DoT victim, or refreshes when an adjacent enemy drops low.",
  },
} as const;

export default function AdjacentPositioningGuidePage() {
  const { byGroup, counts } = getAdjacentRelatedContent();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Guides", path: "/guides" },
              {
                name: ADJACENT_GUIDE.title,
                path: `/guides/${ADJACENT_GUIDE.slug}`,
              },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            entityJsonLd({
              type: "Article",
              name: ADJACENT_GUIDE.title,
              description: ADJACENT_GUIDE.description,
              path: `/guides/${ADJACENT_GUIDE.slug}`,
              dateModified: ADJACENT_GUIDE.updatedAt,
            }),
          ),
        }}
      />

      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: "Adjacent positioning" },
        ]}
      />

      <article className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3">
          <h1 className="font-display text-4xl font-bold">
            {ADJACENT_GUIDE.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {ADJACENT_GUIDE.description}
          </p>
          <p className="text-sm text-muted-foreground">
            Updated {formatDate(ADJACENT_GUIDE.updatedAt)} · {siteConfig.gameVersion}{" "}
            dataset · {counts.total} related entries scanned from content
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">
            What “Adjacent” means
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              In Guildrun, <strong className="text-foreground">Adjacent</strong>{" "}
              is a formation keyword: an effect cares about units standing in
              neighboring board tiles. You will see it on relics, items, hero
              actives/passives, and rank modifiers.
            </p>
            <p>
              Practically it answers three placement questions: Who stands next
              to my frontliner? Who shares a tile edge with a DoT target? Did I
              accidentally give a “exactly one neighbor” rank mod a third friend?
            </p>
            <p>
              Guildrun uses a hex-style board. Treat adjacency as{" "}
              <strong className="text-foreground">
                shared edge / neighboring slot
              </strong>
              . When a rank mod shows placement feedback in-game, trust that
              highlight over any wiki diagram — this page lists which effects
              care, not a pixel-perfect tile map.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">
            How to play around it
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Pair ranks</strong> (Scaling
              Speed / Scaling Attack): keep a clean duo with empty neighbors so
              “exactly one other Hero” stays true.
            </li>
            <li>
              <strong className="text-foreground">Formation auras</strong>{" "}
              (Shield / Bulk Formation, Guardian&apos;s Lantern): clump the
              carry with the holder; isolated backliners get nothing.
            </li>
            <li>
              <strong className="text-foreground">Enemy auras</strong>{" "}
              (Intimidating Aura, Inner Flame, Slam/Bash): put the owner where
              packs path through adjacent tiles; do not hide them on an empty
              wing.
            </li>
            <li>
              <strong className="text-foreground">Splash on target</strong>{" "}
              (Dragon breath passives): adjacency is relative to the{" "}
              <em>attack target</em>, not your formation — enemy packing still
              matters.
            </li>
          </ul>
        </section>

        {(
          Object.keys(GROUP_COPY) as Array<keyof typeof GROUP_COPY>
        ).map((group) => (
          <section key={group} className="space-y-4">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-semibold">
                {GROUP_COPY[group].title}
                <span className="ml-2 text-base font-normal text-muted-foreground">
                  ({counts[group]})
                </span>
              </h2>
              <p className="text-muted-foreground">{GROUP_COPY[group].intro}</p>
            </div>
            <AdjacentEntryList entries={byGroup[group]} />
          </section>
        ))}

        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="font-display text-2xl font-semibold">Keep exploring</h2>
          <p className="text-muted-foreground">
            Adjacent is only one placement lever. For the full run loop, read{" "}
            <Link href="/guides/getting-started" className="underline-offset-2 hover:underline">
              Getting Started
            </Link>
            . Look up individual relics and items in the{" "}
            <Link href="/relics" className="underline-offset-2 hover:underline">
              Relic
            </Link>{" "}
            and{" "}
            <Link href="/items" className="underline-offset-2 hover:underline">
              Item
            </Link>{" "}
            indexes when a shop offer mentions neighbors.
          </p>
        </section>
      </article>
    </>
  );
}
