import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { resolveTagMeta } from "@/lib/tags";
import { cn } from "@/lib/utils";

export function TagList({
  tags,
  className,
  limit,
  linkable = true,
}: {
  tags: string[];
  className?: string;
  limit?: number;
  /** Set false when rendered inside another link (e.g. cards). */
  linkable?: boolean;
}) {
  const list = (limit ? tags.slice(0, limit) : tags).filter(Boolean);
  if (list.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {list.map((tag) => {
        const meta = resolveTagMeta(tag);
        const badge = (
          <Badge
            variant="outline"
            className={linkable ? "hover:border-primary hover:text-primary" : undefined}
          >
            {meta.label}
          </Badge>
        );

        if (!linkable) {
          return <span key={tag}>{badge}</span>;
        }

        return (
          <Link key={tag} href={`/keywords/${tag}`}>
            {badge}
          </Link>
        );
      })}
    </div>
  );
}
