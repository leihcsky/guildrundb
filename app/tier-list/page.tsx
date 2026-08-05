import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { TierHeroCard } from "@/components/tier-list/tier-hero-card";
import { siteConfig } from "@/config/site.config";
import {
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

const PAGE_TITLE = "Guildrun Tier List — Best Heroes Ranked";
const PAGE_DESCRIPTION =
  "Guildrun tier list for Demo 0.5.3 — S to D hero rankings with roles, strengths, weaknesses, Red Rift notes, and recommended builds. Find the best Guildrun heroes for your shop.";

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/tier-list",
});

export default function TierListPage() {
  const meta = getTierListMeta();
  const byTier = getTierListByTier();
  const grades = getTierGrades();
  const ranked = Object.values(byTier)
    .flat()
    .sort((a, b) => a.rank - b.rank);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    numberOfItems: ranked.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: ranked.map((entry) => ({
      "@type": "ListItem",
      position: entry.rank,
      name: `${entry.hero.name} (${entry.tier} Tier)`,
      url: absoluteUrl(`/heroes/${entry.hero.slug}`),
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
            Guildrun Tier List — Best Heroes Ranked
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
        </header>

        <nav
          aria-label="Jump to tier"
          className="flex flex-wrap gap-2 border-y border-border py-4"
        >
          {grades.map((tier) => (
            <a
              key={tier}
              href={`#tier-${tier.toLowerCase()}`}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {tier} Tier
              <span className="ml-1.5 text-xs opacity-70">
                ({byTier[tier].length})
              </span>
            </a>
          ))}
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
            Best Guildrun heroes at a glance
          </h2>
          <p className="text-sm text-muted-foreground">
            This Guildrun hero tier list is a decision aid: pick a letter, read
            why, then open the hero page for how to play and shop notes. Letter
            grades alone do not win Red Rift — formation and Shard spend still
            matter.
          </p>
        </section>

        {grades.map((tier) => {
          const entries = byTier[tier];
          if (entries.length === 0) return null;
          return (
            <section
              key={tier}
              id={`tier-${tier.toLowerCase()}`}
              className="scroll-mt-24 space-y-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2">
                <h2 className="font-display text-3xl font-bold">{tier} Tier</h2>
                <p className="text-sm text-muted-foreground">
                  {entries.length} hero{entries.length === 1 ? "" : "s"}
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

        <section id="methodology" className="scroll-mt-24 space-y-4">
          <h2 className="font-display text-2xl font-semibold">
            How we rank heroes
          </h2>
          <p className="text-muted-foreground">
            Tier rankings on this Guildrun tier list are editorial judgments for{" "}
            {meta.version}, not an automated win-rate dump. We weigh:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            {meta.methodology.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            Damage output, survivability, build flexibility, synergy potential,
            difficulty to pilot, and Red Rift performance all feed the grade.
            Community feedback and in-Demo testing inform updates when the patch
            shifts.
          </p>
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
            After you shortlist a hero from this tier list, use these pages to
            turn the pick into a run plan:
          </p>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
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
                href="/builds"
                className="text-primary underline-offset-2 hover:underline"
              >
                Curated team builds
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
