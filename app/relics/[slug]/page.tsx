import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EntityImage } from "@/components/shared/entity-image";
import { HeroCard } from "@/components/heroes/hero-card";
import { RelicCard } from "@/components/relics/relic-card";
import { BuildCard } from "@/components/builds/build-card";
import {
  getRelicBySlug,
  getRelics,
  getSynergyRelics,
  resolveBuildsBySlugs,
  resolveHeroesBySlugs,
  resolveRelicsBySlugs,
} from "@/lib/data";
import { TagList } from "@/components/mechanics/tag-list";
import { getTagDefinition } from "@/lib/tags";
import { breadcrumbJsonLd, buildGameEntityMetadata, entityJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getRelics().map((relic) => ({ slug: relic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const relic = getRelicBySlug(slug);
  if (!relic) return {};

  const tagLabel = relic.tags
    .map((id) => getTagDefinition(id)?.label)
    .find(Boolean);

  return buildGameEntityMetadata({
    name: relic.name,
    kind: "relic",
    signal: [relic.rarity, tagLabel],
    description: relic.effect,
    path: `/relics/${relic.slug}`,
    image: relic.image,
  });
}

export default async function RelicDetailPage({ params }: Props) {
  const { slug } = await params;
  const relic = getRelicBySlug(slug);
  if (!relic) notFound();

  const bestHeroes = resolveHeroesBySlugs(relic.bestHeroes ?? []);
  const bestBuilds = resolveBuildsBySlugs(relic.bestBuilds ?? []);
  const related = resolveRelicsBySlugs(relic.relatedRelics ?? []);
  const synergies = related.length > 0 ? related : getSynergyRelics(relic, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Relics", path: "/relics" },
              { name: relic.name, path: `/relics/${relic.slug}` },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            entityJsonLd({
              type: "Thing",
              name: relic.name,
              description: relic.effect,
              path: `/relics/${relic.slug}`,
              image: relic.image,
              dateModified: relic.updatedAt,
            }),
          ),
        }}
      />

      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Relics", href: "/relics" },
          { label: relic.name },
        ]}
      />

      <section className="mb-10 flex flex-col gap-6 sm:flex-row">
        <EntityImage src={relic.image} alt={relic.name} size={120} />
        <div className="space-y-3">
          <h1 className="font-display text-4xl font-bold">{relic.name}</h1>
          {(relic.rarity || relic.type) && (
            <div className="flex flex-wrap gap-2">
              {relic.rarity ? <Badge>{relic.rarity}</Badge> : null}
              {relic.type ? <Badge variant="outline">{relic.type}</Badge> : null}
            </div>
          )}
          <p className="max-w-2xl whitespace-pre-line text-muted-foreground">
            {relic.effect || "Effect data pending."}
          </p>
          <TagList tags={relic.tags} />
          {relic.unlock ? (
            <p className="text-sm text-muted-foreground">Unlock: {relic.unlock}</p>
          ) : null}
        </div>
      </section>

      <div className="grid gap-10">
        {bestHeroes.length > 0 ? (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">Best Heroes</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bestHeroes.map((hero) => (
                <HeroCard key={hero.slug} hero={hero} />
              ))}
            </div>
          </section>
        ) : null}

        {bestBuilds.length > 0 ? (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">Best Builds</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {bestBuilds.map((build) => (
                <BuildCard key={build.slug} build={build} />
              ))}
            </div>
          </section>
        ) : null}

        {synergies.length > 0 ? (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">Synergies</h2>
            <p className="text-sm text-muted-foreground">
              Relics that share combat tags with this one — useful pairing candidates.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {synergies.map((item) => (
                <RelicCard key={item.slug} relic={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
