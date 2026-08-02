import Link from "next/link";
import type { AdjacentRelatedEntry } from "@/lib/adjacent";
import { Badge } from "@/components/ui/badge";

const KIND_LABEL: Record<AdjacentRelatedEntry["kind"], string> = {
  relic: "Relic",
  item: "Item",
  "hero-ability": "Ability",
  "rank-mod": "Rank mod",
};

export function AdjacentEntryList({
  entries,
}: {
  entries: AdjacentRelatedEntry[];
}) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No matching entries yet.</p>
    );
  }

  return (
    <ul className="space-y-4">
      {entries.map((entry) => {
        const body = (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-foreground">{entry.name}</span>
              <Badge variant="outline">{KIND_LABEL[entry.kind]}</Badge>
              {entry.meta ? (
                <span className="text-xs text-muted-foreground">{entry.meta}</span>
              ) : null}
            </div>
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              {entry.description}
            </p>
          </div>
        );

        return (
          <li
            key={entry.id}
            className="rounded-lg border border-border/80 bg-background/40 px-4 py-3"
          >
            {entry.href ? (
              <Link
                href={entry.href}
                className="block transition-colors hover:border-foreground/20"
              >
                {body}
              </Link>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ul>
  );
}
