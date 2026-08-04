import Link from "next/link";
import { EntityImage } from "@/components/shared/entity-image";
import { Badge } from "@/components/ui/badge";
import type { HeroTierGrade, ResolvedTierListEntry } from "@/types";
import { cn } from "@/lib/utils";

const TIER_STYLES: Record<HeroTierGrade, string> = {
  S: "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  A: "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  B: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  C: "border-border bg-muted/60 text-muted-foreground",
  D: "border-border/80 bg-muted/40 text-muted-foreground",
};

export function TierBadge({
  tier,
  className,
}: {
  tier: HeroTierGrade;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide",
        TIER_STYLES[tier],
        className,
      )}
    >
      {tier} Tier
    </span>
  );
}

export function TierHeroCard({ entry }: { entry: ResolvedTierListEntry }) {
  const { hero, recommendedBuild } = entry;

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border bg-card/60 p-4 sm:flex-row sm:items-start">
      <Link
        href={`/heroes/${hero.slug}`}
        className="shrink-0 transition-opacity hover:opacity-90"
      >
        <EntityImage
          src={hero.portraitImage || hero.image}
          alt={hero.name}
          size={72}
        />
      </Link>

      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/heroes/${hero.slug}`}
                className="font-display text-lg font-semibold text-foreground hover:underline"
              >
                {hero.name}
              </Link>
              <TierBadge tier={entry.tier} />
              <span className="text-xs text-muted-foreground">
                Rank #{entry.rank}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {entry.role}
              <span className="mx-1.5 text-border">·</span>
              {hero.class}
            </p>
          </div>
        </div>

        <p className="text-sm text-foreground">{entry.summary}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Strengths
            </p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-muted-foreground">
              {entry.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Weaknesses
            </p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-muted-foreground">
              {entry.weaknesses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {entry.bestModes.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-muted-foreground">Best for:</span>
            {entry.bestModes.map((mode) => (
              <Badge key={mode} variant="outline">
                {mode}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
          <Link
            href={`/heroes/${hero.slug}`}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            View hero
          </Link>
          {recommendedBuild ? (
            <Link
              href={`/builds/${recommendedBuild.slug}`}
              className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              {recommendedBuild.title}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
