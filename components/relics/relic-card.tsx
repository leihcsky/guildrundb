import Link from "next/link";
import type { Relic } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityImage } from "@/components/shared/entity-image";
import { TagList } from "@/components/mechanics/tag-list";

export function RelicCard({
  relic,
  note,
}: {
  relic: Relic;
  /** Optional synergy reason shown under the effect (kept inside the card to avoid h-full overlap). */
  note?: string;
}) {
  return (
    <Link href={`/relics/${relic.slug}`} className="block h-full">
      <Card className="flex h-full flex-col">
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <EntityImage src={relic.image} alt={relic.name} size={56} />
          <div className="min-w-0">
            <CardTitle className="truncate">{relic.name}</CardTitle>
            {(relic.rarity || relic.type) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {relic.rarity ? <Badge>{relic.rarity}</Badge> : null}
                {relic.type ? <Badge variant="outline">{relic.type}</Badge> : null}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col space-y-3">
          <p className="line-clamp-2 whitespace-pre-line text-sm text-muted-foreground">
            {relic.effect || "Effect data pending."}
          </p>
          <TagList tags={relic.tags} limit={3} linkable={false} />
          {note ? (
            <p className="mt-auto border-t border-border/70 pt-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">Why: </span>
              {note}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
