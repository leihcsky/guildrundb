import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { HeroCard } from "@/components/heroes/hero-card";
import { RelicCard } from "@/components/relics/relic-card";
import { ItemCard } from "@/components/items/item-card";
import { TagList } from "@/components/mechanics/tag-list";
import {
  getBuildBySlug,
  getBuilds,
  resolveHeroesBySlugs,
  resolveItemsBySlugs,
  resolveRelicsBySlugs,
} from "@/lib/data";
import {
  buildBuildMetadata,
  buildPageHeading,
  buildSeoDescription,
  buildSeoTitle,
} from "@/lib/build-seo";
import { breadcrumbJsonLd, entityJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getBuilds().map((build) => ({ slug: build.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const build = getBuildBySlug(slug);
  if (!build) return {};

  return buildBuildMetadata(build);
}

export default async function BuildDetailPage({ params }: Props) {
  const { slug } = await params;
  const build = getBuildBySlug(slug);
  if (!build) notFound();

  const heroes = resolveHeroesBySlugs(build.heroes);
  const flexHeroes = resolveHeroesBySlugs(build.flexHeroes ?? []);
  const relics = resolveRelicsBySlugs(build.relics);
  const items = resolveItemsBySlugs(build.items);
  const heading = buildPageHeading(build);
  const seoTitle = buildSeoTitle(build);
  const seoDescription = buildSeoDescription(build);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Builds", path: "/builds" },
              { name: seoTitle, path: `/builds/${build.slug}` },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            entityJsonLd({
              type: "Article",
              name: seoTitle,
              description: seoDescription,
              path: `/builds/${build.slug}`,
              dateModified: build.updatedAt,
            }),
          ),
        }}
      />

      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Builds", href: "/builds" },
          { label: heading },
        ]}
      />

      <header className="mb-10 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {build.patch ? <Badge variant="secondary">{build.patch}</Badge> : null}
          {build.featured ? <Badge variant="outline">Featured</Badge> : null}
        </div>
        <h1 className="font-display text-4xl font-bold">{heading}</h1>
        {heading !== build.title ? (
          <p className="text-lg text-muted-foreground">{build.title}</p>
        ) : null}
        <p className="max-w-3xl text-muted-foreground">{build.overview}</p>
        {build.goal ? (
          <p className="max-w-3xl rounded-lg border border-border bg-card p-4 text-sm">
            <span className="font-medium text-foreground">When to pick it: </span>
            {build.goal}
          </p>
        ) : null}
        {build.keywords && build.keywords.length > 0 ? (
          <TagList tags={build.keywords} />
        ) : null}
      </header>

      <div className="grid gap-10">
        {build.playstyle ? (
          <section className="space-y-2">
            <h2 className="font-display text-2xl font-semibold">How it plays</h2>
            <p className="max-w-3xl text-muted-foreground">{build.playstyle}</p>
          </section>
        ) : null}

        {build.gameplan && build.gameplan.length > 0 ? (
          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold">Gameplan</h2>
            <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
              {build.gameplan.map((step) => (
                <li key={step} className="pl-1">
                  {step}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {build.positioning ? (
          <section className="space-y-2">
            <h2 className="font-display text-2xl font-semibold">Positioning</h2>
            <p className="max-w-3xl text-muted-foreground">{build.positioning}</p>
          </section>
        ) : null}

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Core Heroes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {heroes.map((hero) => (
              <HeroCard key={hero.slug} hero={hero} />
            ))}
          </div>
        </section>

        {flexHeroes.length > 0 ? (
          <section className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">Flex / Substitutes</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use these when a core pick is missing or the shop pushes a different angle.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {flexHeroes.map((hero) => (
                <HeroCard key={hero.slug} hero={hero} />
              ))}
            </div>
          </section>
        ) : null}

        {relics.length > 0 ? (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">Priority Relics</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relics.map((relic) => (
                <RelicCard key={relic.slug} relic={relic} />
              ))}
            </div>
          </section>
        ) : null}

        {items.length > 0 ? (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">Priority Items</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ItemCard key={item.slug} item={item} />
              ))}
            </div>
          </section>
        ) : null}

        {build.tips && build.tips.length > 0 ? (
          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold">Practical tips</h2>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              {build.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {(build.strength?.length || build.weakness?.length) ? (
          <section className="grid gap-4 md:grid-cols-2">
            {build.strength?.length ? (
              <div className="rounded-lg border border-border bg-card p-4">
                <h2 className="font-display text-xl font-semibold">Strengths</h2>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {build.strength.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {build.weakness?.length ? (
              <div className="rounded-lg border border-border bg-card p-4">
                <h2 className="font-display text-xl font-semibold">Weaknesses</h2>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {build.weakness.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

        <p className="text-sm text-muted-foreground">
          Need a name lookup mid-run?{" "}
          <Link href="/search" className="text-primary hover:underline">
            Search the database
          </Link>{" "}
          or open related{" "}
          <Link href="/keywords" className="text-primary hover:underline">
            keywords
          </Link>
          .
        </p>
      </div>
    </>
  );
}
