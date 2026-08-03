import type { Metadata } from "next";
import { AdjacentEntryList } from "@/components/guides/adjacent-entry-list";
import { GuideOutline } from "@/components/guides/guide-outline";
import { RelatedGuides } from "@/components/guides/related-guides";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { siteConfig } from "@/config/site.config";
import { ADJACENT_GUIDE, getAdjacentRelatedContent } from "@/lib/adjacent";
import { getGuides } from "@/lib/data";
import { getRelatedGuides } from "@/lib/guide-nav";
import {
  breadcrumbJsonLd,
  buildGameEntityMetadata,
  entityJsonLd,
} from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = buildGameEntityMetadata({
  name: ADJACENT_GUIDE.title,
  kind: "guide",
  description: ADJACENT_GUIDE.description,
  path: `/guides/${ADJACENT_GUIDE.slug}`,
});

const GROUP_COPY = {
  "ally-buff": {
    id: "ally-buffs",
    title: "Ally adjacency — buffs and shields",
    intro:
      "These effects care about heroes standing next to each other: start-of-combat shields, Max HP, or healing that lands on neighbors.",
  },
  "enemy-pressure": {
    id: "enemy-pressure",
    title: "Enemy adjacency — auras and cleave",
    intro:
      "Frontline kits that punish units standing next to the owner: aura damage, retaliate splash, or stun on adjacent enemies.",
  },
  "pair-formation": {
    id: "exactly-one-neighbor",
    title: "Exactly one neighbor",
    intro:
      "Rank modifiers that only fire when a hero is adjacent to exactly one other hero. Park a clean duo — a third neighbor turns the buff off.",
  },
  "positional-trigger": {
    id: "positional-triggers",
    title: "Positional triggers and splash",
    intro:
      "Effects that use adjacency as a condition or splash rule: hits around a target, heals allies next to a DoT victim, or refreshes when an adjacent enemy drops low.",
  },
} as const;

export default function AdjacentPositioningGuidePage() {
  const { byGroup, counts } = getAdjacentRelatedContent();
  const related = getRelatedGuides(getGuides(), ADJACENT_GUIDE.slug, 2);
  const outline = [
    {
      id: "what-adjacent-means",
      title: 'What "Adjacent" means',
      level: 2 as const,
    },
    { id: "how-to-play", title: "How to play around it", level: 2 as const },
    ...(Object.keys(GROUP_COPY) as Array<keyof typeof GROUP_COPY>).map(
      (group) => ({
        id: GROUP_COPY[group].id,
        title: GROUP_COPY[group].title,
        level: 2 as const,
      }),
    ),
  ];

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

      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="min-w-0 space-y-10">
          <header className="space-y-3">
            <h1 className="font-display text-4xl font-bold">
              {ADJACENT_GUIDE.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {ADJACENT_GUIDE.description}
            </p>
            <p className="text-sm text-muted-foreground">
              Updated {formatDate(ADJACENT_GUIDE.updatedAt)} ·{" "}
              {siteConfig.gameVersion} dataset · {counts.total} related entries
              scanned from content
            </p>
          </header>

          <div className="lg:hidden">
            <GuideOutline items={outline} />
          </div>

          <section id="what-adjacent-means" className="scroll-mt-24 space-y-3">
            <h2 className="font-display text-2xl font-semibold">
              What “Adjacent” means
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                In Guildrun,{" "}
                <strong className="text-foreground">Adjacent</strong> is a
                formation keyword: an effect cares about units standing in
                neighboring board tiles. You will see it on relics, items, hero
                actives/passives, and rank modifiers.
              </p>
              <p>
                Practically it answers three placement questions: Who stands next
                to my frontliner? Who shares a tile edge with a DoT target? Did I
                accidentally give a “exactly one neighbor” rank mod a third
                friend?
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

          <section id="how-to-play" className="scroll-mt-24 space-y-3">
            <h2 className="font-display text-2xl font-semibold">
              How to play around it
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                <strong className="text-foreground">Frontline auras</strong>:
                park the aura carrier where enemies (or allies) will actually
                stand next to them — empty side lanes waste the text.
              </li>
              <li>
                <strong className="text-foreground">Exactly-one neighbor</strong>{" "}
                ranks: leave a deliberate gap. A third adjacent ally turns the
                buff off.
              </li>
              <li>
                <strong className="text-foreground">Splash on target</strong>{" "}
                (Dragon breath passives): adjacency is relative to the{" "}
                <em>attack target</em>, not your formation — enemy packing still
                matters.
              </li>
            </ul>
          </section>

          {(Object.keys(GROUP_COPY) as Array<keyof typeof GROUP_COPY>).map(
            (group) => (
              <section
                key={group}
                id={GROUP_COPY[group].id}
                className="scroll-mt-24 space-y-4"
              >
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-semibold">
                    {GROUP_COPY[group].title}
                    <span className="ml-2 text-base font-normal text-muted-foreground">
                      ({counts[group]})
                    </span>
                  </h2>
                  <p className="text-muted-foreground">
                    {GROUP_COPY[group].intro}
                  </p>
                </div>
                <AdjacentEntryList entries={byGroup[group]} />
              </section>
            ),
          )}

          <RelatedGuides guides={related} />
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <GuideOutline items={outline} />
          </div>
        </aside>
      </div>
    </>
  );
}
