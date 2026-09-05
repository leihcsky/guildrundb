import Link from "next/link";
import type { UpdatePost } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UpdateCard({ post }: { post: UpdatePost }) {
  return (
    <Link href={`/updates/${post.slug}`} className="block h-full">
      <Card className="h-full">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(post.publishedAt)}
            </span>
          </div>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {post.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
