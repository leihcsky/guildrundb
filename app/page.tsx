import Link from "next/link";
import { HeroSearch } from "@/components/home/hero-search";
import { DecisionPaths } from "@/components/home/decision-paths";
import { QuickNav } from "@/components/home/quick-nav";
import { DataStats } from "@/components/home/data-stats";
import { AboutCoverage } from "@/components/home/about-coverage";
import { HomeFaq } from "@/components/home/home-faq";
import { HeroCard } from "@/components/heroes/hero-card";
import { RelicCard } from "@/components/relics/relic-card";
import { MechanicCard } from "@/components/mechanics/mechanic-card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site.config";
import {
  getDataStats,
  getFeaturedHeroes,
  getFeaturedMechanics,
  getFeaturedRelics,
  getHeroes,
} from "@/lib/data";
import { faqJsonLd } from "@/lib/seo";

export default function HomePage() {
  const heroes = getHeroes().map(({ slug, name, class: heroClass, role }) => ({
    slug,
    name,
    class: heroClass,
    role,
  }));
  const dataStats = getDataStats();
  const featuredHeroes = getFeaturedHeroes(6);
  const featuredRelics = getFeaturedRelics(6);
  const featuredMechanics = getFeaturedMechanics(6);

  const faqSchema = faqJsonLd([...siteConfig.faq]);

  return (
    <div className="space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="relative overflow-hidden rounded-2xl border border-border bg-surface/70 px-6 py-16 text-center animate-fade-up">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.18),transparent_55%)]" />
        <div className="relative space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary">{siteConfig.gameVersion}</Badge>
            <Badge variant="outline">Unofficial Fan Wiki</Badge>
          </div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {siteConfig.seo.homeTitle}
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {siteConfig.name}
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Plan Guildrun runs with a searchable database — compare heroes, inspect
            relic and item effects, and follow keywords to related synergies.
          </p>
          <HeroSearch heroes={heroes} />
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/heroes"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse Heroes
            </Link>
            <Link
              href="/guides"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              Read Guides
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Database Coverage</h2>
            <p className="text-sm text-muted-foreground">
              Live record counts from {siteConfig.gameVersion} game data.
            </p>
          </div>
        </div>
        <DataStats stats={dataStats} />
      </section>

      <AboutCoverage />

      <section className="space-y-6">
        <h2 className="font-display text-2xl font-semibold">Start with a decision</h2>
        <DecisionPaths />
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold">Featured Heroes</h2>
          <Link href="/heroes" className="text-sm text-primary hover:underline">
            View all {dataStats.find((s) => s.label === "Heroes")?.count ?? ""}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredHeroes.map((hero) => (
            <HeroCard key={hero.slug} hero={hero} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold">Featured Relics</h2>
          <Link href="/relics" className="text-sm text-primary hover:underline">
            View all {dataStats.find((s) => s.label === "Relics")?.count ?? ""}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredRelics.map((relic) => (
            <RelicCard key={relic.slug} relic={relic} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold">Popular Keywords</h2>
          <Link href="/keywords" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredMechanics.map((mechanic) => (
            <MechanicCard key={mechanic.id} mechanic={mechanic} />
          ))}
        </div>
      </section>

      <HomeFaq />

      <section className="space-y-6">
        <h2 className="font-display text-2xl font-semibold">Quick Navigation</h2>
        <QuickNav />
      </section>
    </div>
  );
}
