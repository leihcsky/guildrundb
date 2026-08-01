import Link from "next/link";
import type { Guide } from "@/types";
import { formatDate } from "@/lib/utils";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link href={`/guides/${guide.slug}`} className="block h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{guide.title}</CardTitle>
          <CardDescription className="line-clamp-3">{guide.description}</CardDescription>
          <p className="pt-2 text-xs text-muted-foreground">
            Updated {formatDate(guide.updatedAt)}
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
}
