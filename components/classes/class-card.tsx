import Link from "next/link";
import type { HeroClassInfo } from "@/types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityImage } from "@/components/shared/entity-image";
import { TagList } from "@/components/mechanics/tag-list";

export function ClassCard({ heroClass }: { heroClass: HeroClassInfo }) {
  return (
    <Link href={`/classes/${heroClass.slug}`} className="block h-full">
      <Card className="h-full">
        <CardHeader className="flex-row items-start gap-3 space-y-0">
          <EntityImage src={heroClass.image} alt={heroClass.name} size={56} />
          <div className="min-w-0 space-y-2">
            <CardTitle>{heroClass.name}</CardTitle>
            <CardDescription className="line-clamp-3">
              {heroClass.description}
            </CardDescription>
            <TagList tags={heroClass.mechanics} limit={4} linkable={false} />
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
