import Link from "next/link";
import { EntityImage } from "@/components/shared/entity-image";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/tier-list/tier-hero-card";
import type { ResolvedBuildTierEntry } from "@/types";

function IconRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function TierBuildCard({ entry }: { entry: ResolvedBuildTierEntry }) {
  const { build, heroes, items, relics } = entry;
  const previewItems = items.slice(0, 6);
  const previewRelics = relics.slice(0, 8);

  return (
    <article className="space-y-4 rounded-lg border border-border bg-card/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/builds/${build.slug}`}
              className="font-display text-xl font-semibold text-foreground hover:underline"
            >
              {build.title}
            </Link>
            <TierBadge tier={entry.tier} />
            <span className="text-xs text-muted-foreground">
              Build #{entry.rank}
            </span>
          </div>
          {build.patch ? (
            <p className="text-xs text-muted-foreground">{build.patch}</p>
          ) : null}
        </div>
        <Link
          href={`/builds/${build.slug}`}
          className="shrink-0 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          Open full build
        </Link>
      </div>

      <p className="text-sm text-foreground">{entry.summary}</p>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Why this tier: </span>
        {entry.whyTier}
      </p>

      {entry.bestFor.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Best for:</span>
          {entry.bestFor.map((mode) => (
            <Badge key={mode} variant="outline">
              {mode}
            </Badge>
          ))}
        </div>
      ) : null}

      <IconRow label="Core heroes">
        {heroes.map((hero) => (
          <Link
            key={hero.slug}
            href={`/heroes/${hero.slug}`}
            className="group flex w-14 flex-col items-center gap-1"
            title={hero.name}
          >
            <EntityImage
              src={hero.portraitImage || hero.image}
              alt={hero.name}
              size={48}
            />
            <span className="w-full truncate text-center text-[11px] text-muted-foreground group-hover:text-foreground">
              {hero.name}
            </span>
          </Link>
        ))}
      </IconRow>

      {previewItems.length > 0 ? (
        <IconRow label="Core items">
          {previewItems.map((item) => (
            <Link
              key={item.slug}
              href={`/items/${item.slug}`}
              className="group flex w-12 flex-col items-center gap-1"
              title={item.name}
            >
              <EntityImage src={item.image} alt={item.name} size={40} />
              <span className="w-full truncate text-center text-[10px] text-muted-foreground group-hover:text-foreground">
                {item.name}
              </span>
            </Link>
          ))}
          {items.length > previewItems.length ? (
            <span className="self-center text-xs text-muted-foreground">
              +{items.length - previewItems.length}
            </span>
          ) : null}
        </IconRow>
      ) : null}

      {previewRelics.length > 0 ? (
        <IconRow label="Key relics">
          {previewRelics.map((relic) => (
            <Link
              key={relic.slug}
              href={`/relics/${relic.slug}`}
              className="group flex w-12 flex-col items-center gap-1"
              title={relic.name}
            >
              <EntityImage src={relic.image} alt={relic.name} size={40} />
              <span className="w-full truncate text-center text-[10px] text-muted-foreground group-hover:text-foreground">
                {relic.name}
              </span>
            </Link>
          ))}
          {relics.length > previewRelics.length ? (
            <span className="self-center text-xs text-muted-foreground">
              +{relics.length - previewRelics.length}
            </span>
          ) : null}
        </IconRow>
      ) : null}

      {build.goal ? (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Pick when: </span>
          {build.goal}
        </p>
      ) : null}
    </article>
  );
}
