import Link from "next/link";
import { HeroSearch } from "@/components/home/hero-search";
import { StartHere } from "@/components/home/start-here";
import { GrowthRoute } from "@/components/home/growth-route";
import { CoverageStrip } from "@/components/home/coverage-strip";
import { FeaturedGuides } from "@/components/home/featured-guides";
import { LatestUpdates } from "@/components/home/latest-updates";
import { HomeFaq } from "@/components/home/home-faq";
import { QuickNav } from "@/components/home/quick-nav";
import { HeroCard } from "@/components/heroes/hero-card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site.config";
import {
  getDataStats,
  getFeaturedHeroes,
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

  const faqSchema = faqJsonLd([...siteConfig.faq]);

  return (
    <div className="space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="relative overflow-hidden rounded-2xl border border-border bg-surface/70 px-6 py-14 text-center animate-fade-up sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.18),transparent_55%)]" />
        <div className="relative space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary">{siteConfig.gameVersion}</Badge>
            <Badge variant="outline">Guide & Wiki</Badge>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {siteConfig.name}
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Plan Guildrun runs with practical guides, ranked builds, and a searchable{" "}
            {siteConfig.gameVersion} database — learn the loop, pick a comp, then look
            up the shop.
          </p>
          <HeroSearch heroes={heroes} />
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/guides/player-handbook"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start learning
            </Link>
            <Link
              href="/tier-list"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              Open tier list
            </Link>
            <Link
              href="/builds"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              Browse builds
            </Link>
          </div>
        </div>
      </section>

      <StartHere />

      <GrowthRoute />

      <FeaturedGuides />

      <LatestUpdates />

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">Featured heroes</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jump into kits, ranks, and synergies when a shop hero needs context.
            </p>
          </div>
          <Link href="/heroes" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredHeroes.map((hero) => (
            <HeroCard key={hero.slug} hero={hero} />
          ))}
        </div>
      </section>

      <CoverageStrip stats={dataStats} />

      <HomeFaq />

      <section className="space-y-6">
        <h2 className="font-display text-2xl font-semibold">Quick navigation</h2>
        <QuickNav />
      </section>
    </div>
  );
}
