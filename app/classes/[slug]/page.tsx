import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClassCard } from "@/components/classes/class-card";
import { HeroCard } from "@/components/heroes/hero-card";
import { TagList } from "@/components/mechanics/tag-list";
import { RelicCard } from "@/components/relics/relic-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EntityImage } from "@/components/shared/entity-image";
import {
  getHeroClassBySlug,
  getHeroClasses,
  getHeroesByClassSlug,
  getRelicsByTag,
} from "@/lib/data";
import { breadcrumbJsonLd, buildGameEntityMetadata, entityJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getHeroClasses().map((heroClass) => ({ slug: heroClass.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const heroClass = getHeroClassBySlug(slug);
  if (!heroClass) return {};

  return buildGameEntityMetadata({
    name: heroClass.name,
    suffix: "class",
    description: heroClass.description,
    path: `/classes/${heroClass.slug}`,
    image: heroClass.image,
  });
}

export default async function ClassDetailPage({ params }: Props) {
  const { slug } = await params;
  const heroClass = getHeroClassBySlug(slug);
  if (!heroClass) notFound();

  const classRelics = getRelicsByTag(heroClass.slug, 12);
  const mechanicRelics = heroClass.mechanics
    .flatMap((tag) => getRelicsByTag(tag, 4))
    .filter(
      (relic, index, list) => list.findIndex((item) => item.slug === relic.slug) === index,
    )
    .slice(0, 12);

  const relics = classRelics.length > 0 ? classRelics : mechanicRelics;
  const otherClasses = getHeroClasses().filter((item) => item.slug !== heroClass.slug);
  const classHeroes = getHeroesByClassSlug(heroClass.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Classes", path: "/classes" },
              { name: heroClass.name, path: `/classes/${heroClass.slug}` },
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
              name: heroClass.name,
              description: heroClass.description,
              path: `/classes/${heroClass.slug}`,
              image: heroClass.image,
            }),
          ),
        }}
      />

      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Classes", href: "/classes" },
          { label: heroClass.name },
        ]}
      />

      <section className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start">
        <EntityImage
          src={heroClass.image}
          alt={heroClass.name}
          size={96}
          className="shrink-0"
        />
        <div className="space-y-3">
          <h1 className="font-display text-4xl font-bold">{heroClass.name}</h1>
          <p className="max-w-3xl whitespace-pre-line text-muted-foreground">
            {heroClass.description}
          </p>
          <TagList tags={heroClass.mechanics} />
        </div>
      </section>

      <div className="grid gap-10">
        {classHeroes.length > 0 ? (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">Heroes</h2>
            <p className="text-sm text-muted-foreground">
              Heroes that start in the {heroClass.name} class (including dual-class picks).
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classHeroes.map((hero) => (
                <HeroCard key={hero.slug} hero={hero} />
              ))}
            </div>
          </section>
        ) : null}

        {relics.length > 0 ? (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">Synergy Relics</h2>
            <p className="text-sm text-muted-foreground">
              Relics that explicitly reference this class or its signature keywords.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relics.map((relic) => (
                <RelicCard key={relic.slug} relic={relic} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Other Classes</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {otherClasses.map((item) => (
              <ClassCard key={item.slug} heroClass={item} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
