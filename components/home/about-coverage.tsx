import Link from "next/link";
import { siteConfig } from "@/config/site.config";

export function AboutCoverage() {
  return (
    <section className="rounded-2xl border border-border bg-surface/50 p-6 sm:p-8">
      <h2 className="font-display text-2xl font-semibold">About This Database</h2>
      <div className="mt-4 max-w-3xl space-y-4 text-muted-foreground">
        <p>
          {siteConfig.name} is a searchable Guildrun wiki built for quick lookups and
          build decisions — heroes, relics, items, classes, keywords, and curated
          builds in one place.
        </p>
        <p>{siteConfig.dataNotes}</p>
        <p>
          Start with the{" "}
          <Link href="/heroes" className="text-primary hover:underline">
            hero roster
          </Link>
          , compare{" "}
          <Link href="/relics" className="text-primary hover:underline">
            relic
          </Link>{" "}
          and{" "}
          <Link href="/items" className="text-primary hover:underline">
            item
          </Link>{" "}
          effects, or jump into{" "}
          <Link href="/builds" className="text-primary hover:underline">
            starter builds
          </Link>{" "}
          when you need a team direction.
        </p>
      </div>
    </section>
  );
}
