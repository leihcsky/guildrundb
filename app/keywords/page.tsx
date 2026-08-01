import type { Metadata } from "next";
import { MechanicCard } from "@/components/mechanics/mechanic-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
import { getMechanicsIndex } from "@/lib/data";
import { breadcrumbJsonLd, buildListMetadata } from "@/lib/seo";

export const metadata: Metadata = buildListMetadata("keywords", "/keywords");

export default function KeywordsPage() {
  const keywords = getMechanicsIndex();
  const combat = keywords.filter((item) => item.category === "combat");
  const classes = keywords.filter((item) => item.category === "class");
  const stats = keywords.filter((item) => item.category === "stat");

  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Keywords", path: "/keywords" },
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
          { label: "Keywords" },
        ]}
      />
      <PageHeader
        title="Keywords"
        description="Combat and class tags from in-game relic and ability text — the same keywords you see on hero skills and relic descriptions."
      />

      <div className="space-y-12">
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Combat</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {combat.map((keyword) => (
              <MechanicCard key={keyword.id} mechanic={keyword} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Classes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((keyword) => (
              <MechanicCard key={keyword.id} mechanic={keyword} />
            ))}
          </div>
        </section>

        {stats.length > 0 ? (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">Stats</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((keyword) => (
                <MechanicCard key={keyword.id} mechanic={keyword} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
