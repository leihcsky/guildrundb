import Link from "next/link";
import { TierBadge } from "@/components/tier-list/tier-hero-card";
import type { ResolvedTierListEntry } from "@/types";

/** Compact tier module for hero detail pages. */
export function HeroTierRanking({ entry }: { entry: ResolvedTierListEntry }) {
  return (
    <section
      id="tier-ranking"
      className="scroll-mt-24 space-y-3 rounded-lg border border-border bg-card/60 p-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="font-display text-xl font-semibold">
          Current Tier Ranking
        </h2>
        <Link
          href="/tier-list"
          className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Full Guildrun tier list
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <TierBadge tier={entry.tier} />
        <span className="text-sm text-muted-foreground">
          Rank #{entry.rank} · {entry.role}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{entry.summary}</p>
      {entry.recommendedBuild ? (
        <p className="text-sm">
          <span className="text-muted-foreground">Recommended build: </span>
          <Link
            href={`/builds/${entry.recommendedBuild.slug}`}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {entry.recommendedBuild.title}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
