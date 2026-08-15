import type { Metadata } from "next";
import Link from "next/link";
import { MechanicCard } from "@/components/mechanics/mechanic-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { HubIntro } from "@/components/shared/hub-intro";
import { PageHeader } from "@/components/shared/page-header";
import { getMechanicsIndex } from "@/lib/data";
import { breadcrumbJsonLd, buildListMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildListMetadata("keywords", "/keywords"),
  robots: { index: false, follow: true },
};

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
        title="Combat & Class Keywords"
        description="The same tags printed on relics and abilities — grouped for cross-links."
      />
      <HubIntro>
        <p>
          Keywords are extracted from in-game markup (Rush, Crit, Shield, class names,
          and core stats). Use this hub when a relic or skill description highlights a
          tag and you want every related relic, ability, and class in one place —
          without hunting the full relic index by hand.
        </p>
        <p>
          Keyword pages are connection tools, not full strategy guides. For how a tag
          plays in a real run, open the matching <Link href="/classes">class guide</Link>{" "}
          or a <Link href="/builds">build</Link> that leans on that mechanic.
        </p>
      </HubIntro>

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
