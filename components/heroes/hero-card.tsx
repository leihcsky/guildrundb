import Link from "next/link";
import type { Hero } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityImage } from "@/components/shared/entity-image";

export function HeroCard({ hero }: { hero: Hero }) {
  return (
    <Link href={`/heroes/${hero.slug}`} className="block h-full">
      <Card className="h-full">
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <EntityImage src={hero.image} alt={hero.name} size={64} />
          <div className="min-w-0">
            <CardTitle className="truncate">{hero.name}</CardTitle>
            {(hero.classSlugs.length > 0 || hero.role) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {hero.classSlugs.length > 0 ? (
                  <Badge variant="secondary">{hero.class}</Badge>
                ) : hero.class ? (
                  <Badge variant="secondary">{hero.class}</Badge>
                ) : null}
                {hero.role ? <Badge variant="outline">{hero.role}</Badge> : null}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">{hero.overview}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
