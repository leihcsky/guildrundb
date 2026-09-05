import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const paths = [
  {
    title: "Learn combat & growth",
    description:
      "Player Handbook for positioning, then Growth Route for Rank C→S and when to expand.",
    href: "/guides/player-handbook",
    cta: "Open player handbook",
  },
  {
    title: "Pick a meta build",
    description:
      "Ranked team comps with heroes, items, and relics — start on the tier list, then open a full build.",
    href: "/tier-list",
    cta: "Open tier list",
  },
  {
    title: "Look something up",
    description:
      "Hero kits, relic effects, items, and combat keywords when a shop offer needs a quick check.",
    href: "/heroes",
    cta: "Browse heroes",
  },
] as const;

export function StartHere() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">Start here</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Three paths depending on whether you need to learn, copy a plan, or look
          up a shop row.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {paths.map((item, index) => (
          <Link key={item.href} href={item.href} className="block h-full">
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardHeader className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Path {index + 1}
                </p>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <p className="pt-1 text-sm font-medium text-foreground">
                  {item.cta} →
                </p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
