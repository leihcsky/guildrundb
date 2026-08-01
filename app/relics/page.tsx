import type { Metadata } from "next";
import { RelicsBrowser } from "@/components/relics/relics-browser";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
import { getRelics } from "@/lib/data";
import { breadcrumbJsonLd, buildListMetadata } from "@/lib/seo";

export const metadata: Metadata = buildListMetadata("relics", "/relics");

export default function RelicsPage() {
  const relics = getRelics();
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Relics", path: "/relics" },
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
          { label: "Relics" },
        ]}
      />
      <PageHeader
        title="Relics"
        description="Filter relics by rarity and combat keywords, then open a dossier for effects and synergies."
      />
      <RelicsBrowser relics={relics} />
    </>
  );
}
