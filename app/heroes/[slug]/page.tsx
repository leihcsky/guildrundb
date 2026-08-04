import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AbilityList } from "@/components/mechanics/ability-list";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EntityImage } from "@/components/shared/entity-image";
import { HeroCard } from "@/components/heroes/hero-card";
import {
  HeroDecisionSummary,
  HeroGuideFaq,
  HeroHowToPlay,
} from "@/components/heroes/hero-guide-sections";
import { HeroRankGallery } from "@/components/heroes/hero-rank-gallery";
import { HeroTierRanking } from "@/components/tier-list/hero-tier-ranking";
import { RelicCard } from "@/components/relics/relic-card";
import { ItemCard } from "@/components/items/item-card";
import { BuildCard } from "@/components/builds/build-card";
import { MechanicCard } from "@/components/mechanics/mechanic-card";
import { TagList } from "@/components/mechanics/tag-list";
import { siteConfig } from "@/config/site.config";
import {
  getFeaturedMechanics,
  getHeroBySlug,
  getHeroClassBySlug,
  getHeroes,
  getHeroSynergyRelics,
  resolveBuildsBySlugs,
  resolveHeroesBySlugs,
  resolveItemsBySlugs,
  resolveRelicsBySlugs,
} from "@/lib/data";
import { buildHeroGuide } from "@/lib/hero-guide";
import { getHeroTierEntry } from "@/lib/tier-list";
import {
  breadcrumbJsonLd,
  buildGameEntityMetadata,
  entityJsonLd,
  faqJsonLd,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

const STAT_LABELS: Record<string, string> = {
  maxHealth: "Max HP",
  maxMana: "Max Mana",
  startingMana: "Starting Mana",
  manaRegen: "Mana Regen",
  manaLockTime: "Mana Lock (s)",
  defense: "Defense",
  attack: "Attack",
  magic: "Magic",
  attackSpeed: "Attack Speed",
  baseAttackSpeed: "Base Attack Speed",
  baseAttackDamage: "Base Attack Damage",
  crit: "Crit",
  moveSpeed: "Move Speed",
  attackRange: "Attack Range",
};

function formatStatLabel(key: string) {
  return (
    STAT_LABELS[key] ||
    key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase())
  );
}

function formatStatValue(value: number | string) {
  if (typeof value === "number") {
    if (Number.isInteger(value)) return String(value);
    return String(parseFloat(value.toFixed(3)));
  }
  return value;
}

export function generateStaticParams() {
  return getHeroes().map((hero) => ({ slug: hero.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hero = getHeroBySlug(slug);
  if (!hero) return {};

  // Keep SEO metadata stable — already indexed in GSC.
  return buildGameEntityMetadata({
    name: hero.name,
    kind: "hero",
    signal: [hero.class, hero.activeAbility?.name || hero.abilities[0]?.name],
    description: hero.overview,
    path: `/heroes/${hero.slug}`,
    image: hero.portraitImage || hero.image,
  });
}

export default async function HeroDetailPage({ params }: Props) {
  const { slug } = await params;
  const hero = getHeroBySlug(slug);
  if (!hero) notFound();

  const relics = resolveRelicsBySlugs(hero.recommendedRelics);
  const items = resolveItemsBySlugs(hero.recommendedItems);
  const builds = resolveBuildsBySlugs(hero.recommendedBuilds);
  const related = resolveHeroesBySlugs(hero.relatedHeroes ?? []);
  const synergyRelics =
    relics.length > 0 ? relics : getHeroSynergyRelics(hero, 6);
  const guide = buildHeroGuide(hero, synergyRelics);
  const tierEntry = getHeroTierEntry(hero.slug);
  const featuredMechanics = getFeaturedMechanics(4);
  const primaryClass = hero.classSlug
    ? getHeroClassBySlug(hero.classSlug)
    : undefined;
  const hasRankArt = hero.ranks.some((rank) => rank.hasImage);
  const hasStats = Object.keys(hero.stats).length > 0;
  const guideTips =
    guide.tips.length > 0 ? guide.tips : hero.tips && hero.tips.length > 0
      ? hero.tips
      : [];

  const pageNav = [
    { id: "overview", label: "Overview" },
    { id: "guide", label: "At a glance" },
    ...(tierEntry ? [{ id: "tier-ranking", label: "Tier" }] : []),
    { id: "how-to-play", label: "How to play" },
    { id: "stats", label: "Stats" },
    ...(hasRankArt ? [{ id: "ranks", label: "Ranks" }] : []),
    ...(hero.activeAbility || hero.passiveAbilities.length > 0
      ? [{ id: "abilities", label: "Abilities" }]
      : []),
    ...(hero.specializations.length > 0
      ? [{ id: "specializations", label: "Specializations" }]
      : []),
    { id: "synergies", label: "Relics" },
    { id: "faq", label: "FAQ" },
  ];

  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Heroes", path: "/heroes" },
    { name: hero.name, path: `/heroes/${hero.slug}` },
  ]);
  const entity = entityJsonLd({
    type: "Thing",
    name: hero.name,
    description: hero.overview,
    path: `/heroes/${hero.slug}`,
    image: hero.portraitImage || hero.image,
    dateModified: hero.updatedAt,
  });
  const faqLd = faqJsonLd(guide.faq);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(entity) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Heroes", href: "/heroes" },
          { label: hero.name },
        ]}
      />

      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">{siteConfig.gameVersion}</Badge>
        <span>Hero guide + database</span>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2 text-sm">
        {pageNav.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rounded-md border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <section
        id="overview"
        className="mb-10 flex scroll-mt-24 flex-col gap-6 sm:flex-row sm:items-start"
      >
        <EntityImage
          src={hero.portraitImage || hero.image}
          alt={hero.name}
          width={200}
          height={260}
          fit="contain"
          className="shrink-0"
        />
        <div className="space-y-3">
          <h1 className="font-display text-4xl font-bold">{hero.name}</h1>
          {(hero.classSlugs.length > 0 || hero.role) && (
            <div className="flex flex-wrap gap-2">
              {hero.classSlugs.map((classSlug) => {
                const heroClass = getHeroClassBySlug(classSlug);
                if (!heroClass) return null;
                return (
                  <Link key={classSlug} href={`/classes/${classSlug}`}>
                    <Badge className="hover:bg-primary/90">{heroClass.name}</Badge>
                  </Link>
                );
              })}
              {hero.activeAbility ? (
                <Badge variant="outline">Ability · {hero.activeAbility.name}</Badge>
              ) : null}
              {hero.role ? <Badge variant="outline">{hero.role}</Badge> : null}
            </div>
          )}
          <p className="max-w-2xl whitespace-pre-line text-muted-foreground">
            {hero.overview}
          </p>
          {hero.tags.length > 0 ? (
            <TagList tags={hero.tags} linkable />
          ) : null}
        </div>
      </section>

      <div className="grid gap-10">
        <HeroDecisionSummary guide={guide} />
        {tierEntry ? <HeroTierRanking entry={tierEntry} /> : null}
        <HeroHowToPlay guide={guide} />

        <section id="stats" className="scroll-mt-24 space-y-3">
          <h2 className="font-display text-2xl font-semibold">Base Stats</h2>
          {hasStats ? (
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Object.entries(hero.stats).map(([key, value]) => (
                <div key={key} className="rounded-lg border border-border bg-card p-4">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    {formatStatLabel(key)}
                  </dt>
                  <dd className="mt-1 text-xl font-semibold">
                    {formatStatValue(value)}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">No base stats yet</p>
              <p className="mt-2">
                Detailed Rank C stats for {hero.name} are not available right now.
                Check back after the next data update — abilities, ranks, and
                synergies below are still ready to browse.
              </p>
            </div>
          )}
        </section>

        {hasRankArt ? (
          <HeroRankGallery heroName={hero.name} ranks={hero.ranks} />
        ) : null}

        {(hero.activeAbility ||
          hero.passiveAbilities.length > 0 ||
          hero.passive) && (
          <section id="abilities" className="scroll-mt-24 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-semibold">Abilities</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Kit text from the Demo dump, plus short notes on how to play around
                each ability.
              </p>
            </div>
            {hero.activeAbility ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Active</h3>
                <AbilityList
                  abilities={[hero.activeAbility]}
                  notes={guide.abilityNotes}
                />
              </div>
            ) : null}
            {hero.passiveAbilities.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Passives</h3>
                <AbilityList
                  abilities={hero.passiveAbilities}
                  notes={guide.abilityNotes}
                />
              </div>
            ) : hero.passive ? (
              <p className="rounded-lg border border-border bg-card p-4 text-muted-foreground">
                {hero.passive}
              </p>
            ) : null}
          </section>
        )}

        {hero.specializations.length > 0 ? (
          <section id="specializations" className="scroll-mt-24 space-y-3">
            <h2 className="font-display text-2xl font-semibold">
              Specializations
            </h2>
            <p className="text-sm text-muted-foreground">
              Rank B paths that reshape how {hero.name} scales through a run.
            </p>
            <ul className="grid gap-3 sm:grid-cols-3">
              {hero.specializations.map((spec) => (
                <li
                  key={spec.id}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-start gap-3">
                    {spec.image ? (
                      <EntityImage src={spec.image} alt="" size={40} />
                    ) : null}
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-medium">{spec.name}</h3>
                      {spec.description ? (
                        <p className="whitespace-pre-line text-sm text-muted-foreground">
                          {spec.description}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Passive description pending.
                        </p>
                      )}
                      {guide.specNotes[spec.name] ? (
                        <p className="border-t border-border/70 pt-2 text-sm text-foreground/90">
                          <span className="font-medium">When to pick: </span>
                          {guide.specNotes[spec.name]}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section id="synergies" className="scroll-mt-24 space-y-4">
          <h2 className="font-display text-2xl font-semibold">
            Best relics & synergies
          </h2>
          <p className="text-sm text-muted-foreground">
            {primaryClass
              ? `Relics that overlap ${primaryClass.name} keywords and ${hero.name}'s ability tags. Top matches include a short “why”.`
              : `Relics aligned with ${hero.name}'s combat tags. Top matches include a short “why”.`}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {synergyRelics.map((relic) => (
              <RelicCard
                key={relic.slug}
                relic={relic}
                note={guide.relicReasons[relic.slug]}
              />
            ))}
          </div>
          {featuredMechanics.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredMechanics.map((mechanic) => (
                <MechanicCard key={mechanic.id} mechanic={mechanic} />
              ))}
            </div>
          ) : null}
        </section>

        {items.length > 0 ? (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">Recommended Items</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ItemCard key={item.slug} item={item} />
              ))}
            </div>
          </section>
        ) : null}

        {builds.length > 0 ? (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">Recommended Builds</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {builds.map((build) => (
                <BuildCard key={build.slug} build={build} />
              ))}
            </div>
          </section>
        ) : null}

        <HeroGuideFaq guide={guide} />

        {guideTips.length > 0 ? (
          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold">Tips</h2>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              {guideTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">Related Heroes</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedHero) => (
                <HeroCard key={relatedHero.slug} hero={relatedHero} />
              ))}
            </div>
          </section>
        ) : null}

        <p className="text-sm text-muted-foreground">
          Looking for something else?{" "}
          <Link href="/search" className="text-primary hover:underline">
            Search the database
          </Link>
          .
        </p>
      </div>
    </>
  );
}
