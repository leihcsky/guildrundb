import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AbilityList } from "@/components/mechanics/ability-list";
import { RelicCard } from "@/components/relics/relic-card";
import { ClassCard } from "@/components/classes/class-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  getAbilitiesByTag,
  getClassesByTag,
  getMechanicById,
  getMechanicsIndex,
  getRelicsByTag,
} from "@/lib/data";
import { breadcrumbJsonLd, buildGameEntityMetadata, entityJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return getMechanicsIndex().map((keyword) => ({ tag: keyword.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const keyword = getMechanicById(tag);
  if (!keyword) return {};

  return {
    ...buildGameEntityMetadata({
      name: keyword.label,
      kind: "keyword",
      signal: [keyword.category],
      description: keyword.summary,
      path: `/keywords/${keyword.id}`,
    }),
    robots: { index: false, follow: true },
  };
}

export default async function KeywordDetailPage({ params }: Props) {
  const { tag } = await params;
  const keyword = getMechanicById(tag);
  if (!keyword) notFound();

  const relics = getRelicsByTag(keyword.id, 18);
  const abilities = getAbilitiesByTag(keyword.id, 12);
  const classes = getClassesByTag(keyword.id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Keywords", path: "/keywords" },
              { name: keyword.label, path: `/keywords/${keyword.id}` },
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
              name: keyword.label,
              description: keyword.summary,
              path: `/keywords/${keyword.id}`,
            }),
          ),
        }}
      />

      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Keywords", href: "/keywords" },
          { label: keyword.label },
        ]}
      />

      <header className="mb-10 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-4xl font-bold">{keyword.label}</h1>
          <Badge variant="secondary" className="capitalize">
            {keyword.category}
          </Badge>
        </div>
        <p className="max-w-3xl text-muted-foreground">{keyword.summary}</p>
        <p className="text-sm text-muted-foreground">
          {keyword.relicCount} relics · {keyword.abilityCount} abilities
          {keyword.classSlug ? (
            <>
              {" · "}
              <Link
                href={`/classes/${keyword.classSlug}`}
                className="text-primary hover:underline"
              >
                View {keyword.label} class
              </Link>
            </>
          ) : null}
        </p>
      </header>

      <div className="grid gap-10">
        {classes.length > 0 ? (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">Related Classes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {classes.map((heroClass) => (
                <ClassCard key={heroClass.slug} heroClass={heroClass} />
              ))}
            </div>
          </section>
        ) : null}

        {relics.length > 0 ? (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">Related Relics</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relics.map((relic) => (
                <RelicCard key={relic.slug} relic={relic} />
              ))}
            </div>
          </section>
        ) : null}

        {abilities.length > 0 ? (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">Related Abilities</h2>
            <AbilityList abilities={abilities} />
          </section>
        ) : null}
      </div>
    </>
  );
}
