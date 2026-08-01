import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EntityImage } from "@/components/shared/entity-image";
import { HeroCard } from "@/components/heroes/hero-card";
import { ItemCard } from "@/components/items/item-card";
import { RelicCard } from "@/components/relics/relic-card";
import { TagList } from "@/components/mechanics/tag-list";
import {
  getItemBySlug,
  getItemRelatedHeroes,
  getItemRelatedRelics,
  getItems,
  getSynergyItems,
  resolveHeroesBySlugs,
} from "@/lib/data";
import { breadcrumbJsonLd, buildGameEntityMetadata, entityJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

function hasMeaningfulType(type: string | undefined) {
  const value = type?.trim();
  if (!value) return false;
  return value.toLowerCase() !== "item";
}

export function generateStaticParams() {
  return getItems().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) return {};

  return buildGameEntityMetadata({
    name: item.name,
    suffix: "item",
    description: item.stats || `Guildrun item: ${item.name}`,
    path: `/items/${item.slug}`,
    image: item.image,
  });
}

export default async function ItemDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) notFound();

  const curatedHeroes = resolveHeroesBySlugs(item.recommendedHeroes ?? []);
  const relatedHeroes =
    curatedHeroes.length > 0 ? curatedHeroes : getItemRelatedHeroes(item, 6);
  const relatedItems = getSynergyItems(item, 6);
  const relatedRelics = getItemRelatedRelics(item, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Items", path: "/items" },
              { name: item.name, path: `/items/${item.slug}` },
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
              name: item.name,
              description: item.stats || `Guildrun item: ${item.name}`,
              path: `/items/${item.slug}`,
              image: item.image,
              dateModified: item.updatedAt,
            }),
          ),
        }}
      />

      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Items", href: "/items" },
          { label: item.name },
        ]}
      />

      <section className="mb-10 flex flex-col gap-6 sm:flex-row">
        <EntityImage src={item.image} alt={item.name} size={120} />
        <div className="space-y-3">
          <h1 className="font-display text-4xl font-bold">{item.name}</h1>
          {hasMeaningfulType(item.type) ? (
            <Badge variant="secondary">{item.type}</Badge>
          ) : null}
          {item.stats ? (
            <p className="max-w-2xl whitespace-pre-line text-muted-foreground">
              {item.stats}
            </p>
          ) : (
            <p className="max-w-2xl text-sm text-muted-foreground">
              No effect text yet for this item. Keywords and related picks below
              still help you explore similar gear.
            </p>
          )}
          {item.tags.length > 0 ? <TagList tags={item.tags} /> : null}
          {item.source ? (
            <p className="text-sm text-muted-foreground">Source: {item.source}</p>
          ) : null}
        </div>
      </section>

      <div className="grid gap-10">
        {relatedHeroes.length > 0 ? (
          <section className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">
                Related Heroes
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Heroes whose class matches tags on this item.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedHeroes.map((hero) => (
                <HeroCard key={hero.slug} hero={hero} />
              ))}
            </div>
          </section>
        ) : null}

        {relatedItems.length > 0 ? (
          <section className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">
                Related Items
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Other items that share combat or class keywords.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedItems.map((related) => (
                <ItemCard key={related.slug} item={related} />
              ))}
            </div>
          </section>
        ) : null}

        {relatedRelics.length > 0 ? (
          <section className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">
                Related Relics
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Relics that lean on the same keywords — useful pairing ideas.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedRelics.map((relic) => (
                <RelicCard key={relic.slug} relic={relic} />
              ))}
            </div>
          </section>
        ) : null}

        {item.tags.length === 0 &&
        relatedHeroes.length === 0 &&
        relatedItems.length === 0 &&
        relatedRelics.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
            This item does not have keyword links yet. Browse the{" "}
            <Link href="/items" className="text-primary hover:underline">
              full item list
            </Link>{" "}
            or check back after the next data update.
          </p>
        ) : null}
      </div>
    </>
  );
}
