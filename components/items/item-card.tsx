import Link from "next/link";
import type { Item } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityImage } from "@/components/shared/entity-image";
import { TagList } from "@/components/mechanics/tag-list";

function hasMeaningfulType(type: string | undefined) {
  const value = type?.trim();
  if (!value) return false;
  return value.toLowerCase() !== "item";
}

export function ItemCard({ item }: { item: Item }) {
  const showType = hasMeaningfulType(item.type);

  return (
    <Link href={`/items/${item.slug}`} className="block h-full">
      <Card className="h-full">
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <EntityImage src={item.image} alt={item.name} size={56} />
          <div className="min-w-0">
            <CardTitle className="truncate">{item.name}</CardTitle>
            {showType ? (
              <div className="mt-2">
                <Badge variant="secondary">{item.type}</Badge>
              </div>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="line-clamp-2 whitespace-pre-line text-sm text-muted-foreground">
            {item.stats || "No effect text yet."}
          </p>
          <TagList tags={item.tags} limit={3} linkable={false} />
        </CardContent>
      </Card>
    </Link>
  );
}
