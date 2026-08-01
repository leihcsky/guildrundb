import Link from "next/link";
import type { MechanicIndexEntry } from "@/types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MechanicCard({ mechanic }: { mechanic: MechanicIndexEntry }) {
  return (
    <Link href={`/keywords/${mechanic.id}`} className="block h-full">
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>{mechanic.label}</CardTitle>
            <Badge variant="secondary" className="capitalize">
              {mechanic.category}
            </Badge>
          </div>
          <CardDescription className="line-clamp-3">{mechanic.summary}</CardDescription>
          <p className="pt-2 text-xs text-muted-foreground">
            {mechanic.relicCount} relics · {mechanic.abilityCount} abilities
            {mechanic.classCount > 0 ? ` · ${mechanic.classCount} classes` : ""}
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
}
