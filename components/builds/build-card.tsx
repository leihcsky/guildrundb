import Link from "next/link";
import type { Build } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function BuildCard({ build }: { build: Build }) {
  return (
    <Link href={`/builds/${build.slug}`} className="block h-full">
      <Card className="h-full">
        <CardHeader>
          <div className="mb-2 flex flex-wrap gap-2">
            {build.patch ? (
              <Badge variant="secondary" className="text-xs">
                {build.patch}
              </Badge>
            ) : null}
            {build.featured ? (
              <Badge variant="outline" className="text-xs">
                Featured
              </Badge>
            ) : null}
          </div>
          <CardTitle>{build.title}</CardTitle>
          <CardDescription className="line-clamp-3">{build.overview}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {build.goal ? (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Pick when: </span>
              {build.goal}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            {build.heroes.length} core
            {build.flexHeroes?.length ? ` · ${build.flexHeroes.length} flex` : ""}
            {" · "}
            {build.relics.length} relics · {build.items.length} items
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
