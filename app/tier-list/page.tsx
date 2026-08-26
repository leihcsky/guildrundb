import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { TierBuildCard } from "@/components/tier-list/tier-build-card";
import { TierHeroCard } from "@/components/tier-list/tier-hero-card";
import { siteConfig } from "@/config/site.config";
import {
  getBuildTierByTier,
  getBuildTierEntries,
  getTierGrades,
  getTierListByTier,
  getTierListMeta,
} from "@/lib/tier-list";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
} from "@/lib/seo";
import { formatDate } from "@/lib/utils";

const PAGE_TITLE = "Guildrun Tier List — Best Builds (Demo 0.5.6)";
const PAGE_DESCRIPTION =
  "Guildrun tier list for Demo 0.5.6 — S to B team builds with hero, item, and relic loadouts, plus a secondary hero power ranking. Find the best Guildrun comps for climb and Red Rift.";

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/tier-list",
});

export default function TierListPage() {
  const meta = getTierListMeta();
  const buildByTier = getBuildTierByTier();
  const heroByTier = getTierListByTier();
  const grades = getTierGrades();
  const buildEntries = getBuildTierEntries();

  const buildTiersWithEntries = grades.filter(
    (tier) => buildByTier[tier].length > 0,
  );
  const heroTiersWithEntries = grades.filter(
    (tier) => heroByTier[tier].length > 0,
  );

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    numberOfItems: buildEntries.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: buildEntries.map((entry) => ({
      "@type": "ListItem",
      position: entry.rank,
      name: `${entry.build.title} (${entry.tier} Tier)`,
      url: absoluteUrl(`/builds/${entry.build.slug}`),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Guildrun Tier List", path: "/tier-list" },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(meta.faq)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd),
        }}
      />

      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Tier List" },
        ]}
      />

      <article className="mx-auto max-w-4xl space-y-12">
        <header className="space-y-4">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Guildrun Tier List — Best Builds
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">{meta.intro}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Version:</span>{" "}
              {meta.version}
            </p>
            <p>
              <span className="font-medium text-foreground">Last updated:</span>{" "}
              {formatDate(meta.updatedAt)}
            </p>
            <p>
              <span className="font-medium text-foreground">Patch label:</span>{" "}
              {siteConfig.gameVersion}
            </p>
          </div>
          {meta.changelog ? (
            <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Changelog: </span>
              {meta.changelog}
            </p>
          ) : null}
        </header>

        <nav
          aria-label="Jump to section"
          className="flex flex-wrap gap-2 border-y border-border py-4"
        >
          {buildTiersWithEntries.map((tier) => (
            <a
              key={`build-${tier}`}
              href={`#build-tier-${tier.toLowerCase()}`}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {tier} Builds
              <span className="ml-1.5 text-xs opacity-70">
                ({buildByTier[tier].length})
              </span>
            </a>
          ))}
          <a
            href="#hero-rankings"
            className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Hero rankings
          </a>
          <a
            href="#methodology"
            className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            How we rank
          </a>
          <a
            href="#faq"
            className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            FAQ
          </a>
        </nav>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">
            Best Guildrun builds right now
          </h2>
          <p className="text-sm text-muted-foreground">
            Start here when you want a runnable plan: each card is a full team
            package with core heroes, key items, and relics. Letter grades score
            the <em>comp</em>, not a single unit. Open the build page for shop
            order, positioning, and flex options.
          </p>
        </section>

        {buildTiersWithEntries.map((tier) => {
          const entries = buildByTier[tier];
          return (
            <section
              key={`build-${tier}`}
              id={`build-tier-${tier.toLowerCase()}`}
              className="scroll-mt-24 space-y-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2">
                <h2 className="font-display text-3xl font-bold">
                  {tier} Tier Builds
                </h2>
                <p className="text-sm text-muted-foreground">
                  {entries.length} build{entries.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="grid gap-4">
                {entries.map((entry) => (
                  <TierBuildCard key={entry.buildSlug} entry={entry} />
                ))}
              </div>
            </section>
          );
        })}

        <section id="hero-rankings" className="scroll-mt-24 space-y-6">
          <div className="space-y-3">
            <h2 className="font-display text-2xl font-semibold">
              Hero power rankings
            </h2>
            <p className="text-sm text-muted-foreground">
              Use this section when the shop offers a hero and you need a quick
              grade. Pair the letter with a build card above — a strong hero still
              needs a real wall, relic plan, and formation.
            </p>
          </div>

          <nav aria-label="Jump to hero tier" className="flex flex-wrap gap-2">
            {heroTiersWithEntries.map((tier) => (
              <a
                key={`hero-nav-${tier}`}
                href={`#hero-tier-${tier.toLowerCase()}`}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {tier} Heroes
                <span className="ml-1.5 text-xs opacity-70">
                  ({heroByTier[tier].length})
                </span>
              </a>
            ))}
          </nav>

          {heroTiersWithEntries.map((tier) => {
            const entries = heroByTier[tier];
            return (
              <section
                key={`hero-${tier}`}
                id={`hero-tier-${tier.toLowerCase()}`}
                className="scroll-mt-24 space-y-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2">
                  <h3 className="font-display text-2xl font-bold">
                    {tier} Tier Heroes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {entries.length} hero{entries.length === 1 ? "" : "es"}
                  </p>
                </div>
                <div className="grid gap-4">
                  {entries.map((entry) => (
                    <TierHeroCard key={entry.heroSlug} entry={entry} />
                  ))}
                </div>
              </section>
            );
          })}
        </section>

        <section id="methodology" className="scroll-mt-24 space-y-4">
          <h2 className="font-display text-2xl font-semibold">
            How we rank builds and heroes
          </h2>
          <p className="text-muted-foreground">
            Rankings on this Guildrun tier list are editorial judgments for{" "}
            {meta.version}, not an automated win-rate dump. We weigh:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            {meta.methodology.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="faq" className="scroll-mt-24 space-y-4">
          <h2 className="font-display text-2xl font-semibold">
            Guildrun tier list FAQ
          </h2>
          <div className="space-y-3">
            {meta.faq.map((item) => (
              <div
                key={item.question}
                className="rounded-lg border border-border bg-card p-4"
              >
                <h3 className="font-medium text-foreground">{item.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="font-display text-2xl font-semibold">
            Related guides & tools
          </h2>
          <p className="text-muted-foreground">
            After you shortlist a build or hero, use these pages to turn the pick
            into a run plan:
          </p>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            <li>
              <Link
                href="/builds"
                className="text-primary underline-offset-2 hover:underline"
              >
                All curated team builds
              </Link>
            </li>
            <li>
              <Link
                href="/guides/red-rift"
                className="text-primary underline-offset-2 hover:underline"
              >
                Red Rift unlock & clear guide
              </Link>
            </li>
            <li>
              <Link
                href="/guides/getting-started"
                className="text-primary underline-offset-2 hover:underline"
              >
                Getting started (beginner loop)
              </Link>
            </li>
            <li>
              <Link
                href="/guides/fight-loss-checklist"
                className="text-primary underline-offset-2 hover:underline"
              >
                Why did I wipe? Checklist
              </Link>
            </li>
            <li>
              <Link
                href="/guides/shop-order-shards"
                className="text-primary underline-offset-2 hover:underline"
              >
                Shop order: Rank vs Relic vs Item
              </Link>
            </li>
            <li>
              <Link
                href="/heroes"
                className="text-primary underline-offset-2 hover:underline"
              >
                Full hero roster
              </Link>
            </li>
          </ul>
        </section>
      </article>
    </>
  );
}
