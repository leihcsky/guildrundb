import Link from "next/link";
import type { DataStatEntry } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DataStats({ stats }: { stats: DataStatEntry[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {stats.map((stat) => (
        <Link key={stat.label} href={stat.href} className="block h-full">
          <Card className="h-full transition-colors hover:border-primary/40 hover:bg-accent/30">
            <CardHeader className="space-y-1 p-4 pb-2">
              <p className="font-display text-2xl font-bold text-primary">
                {stat.count.toLocaleString()}
              </p>
              <CardTitle className="text-sm font-semibold">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
