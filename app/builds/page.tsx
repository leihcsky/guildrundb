import type { Metadata } from "next";
import { BuildCard } from "@/components/builds/build-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
import { getBuilds } from "@/lib/data";
import { breadcrumbJsonLd, buildListMetadata } from "@/lib/seo";

export const metadata: Metadata = buildListMetadata("builds", "/builds");

export default function BuildsPage() {
  const builds = getBuilds();
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Builds", path: "/builds" },
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
          { label: "Builds" },
        ]}
      />
      <PageHeader
        title="Builds"
        description="Practical comps for Demo 0.5.3 — when to pick them, how to place them, and what to buy."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {builds.map((build) => (
          <BuildCard key={build.slug} build={build} />
        ))}
      </div>
    </>
  );
}
