import type { Metadata } from "next";
import { HeroesBrowser } from "@/components/heroes/heroes-browser";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
import { getHeroes } from "@/lib/data";
import { breadcrumbJsonLd, buildListMetadata } from "@/lib/seo";

export const metadata: Metadata = buildListMetadata("heroes", "/heroes");

export default function HeroesPage() {
  const heroes = getHeroes();
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Heroes", path: "/heroes" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "Heroes" },
        ]}
      />
      <PageHeader
        title="Heroes"
        description="Filter the roster by class and combat keywords, then open a hero dossier for ranks, abilities, and synergies."
      />
      <HeroesBrowser heroes={heroes} />
    </>
  );
}
