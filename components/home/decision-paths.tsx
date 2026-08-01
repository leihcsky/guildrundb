import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const decisions = [
  {
    title: "I want a hero",
    description: "Browse the roster, classes, abilities, and starter synergies.",
    href: "/heroes",
  },
  {
    title: "I found a relic",
    description: "Search relics, then follow tags to related pieces.",
    href: "/relics",
  },
  {
    title: "I need a starter build",
    description: "Use curated comps while sheet links keep expanding.",
    href: "/builds",
  },
  {
    title: "I care about a keyword",
    description: "Jump into Rush, Crit, Shield, Burn and related relics.",
    href: "/keywords",
  },
] as const;

export function DecisionPaths() {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {decisions.map((item) => (
        <Link key={item.href + item.title} href={item.href} className="block h-full">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </section>
  );
}
