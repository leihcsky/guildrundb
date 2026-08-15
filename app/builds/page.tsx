import type { Metadata } from "next";
import Link from "next/link";
import { BuildCard } from "@/components/builds/build-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { HubIntro } from "@/components/shared/hub-intro";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site.config";
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
        title="Guildrun Builds"
        description="Curated team comps — when to pick them, what to buy, how to place them."
      />
      <HubIntro>
        <p>
          Builds on Guildrun Hub are hand-written decision packages, not auto-generated
          loadouts. Open one when you want a concrete answer: which heroes to draft,
          which relic lines to chase, how to spend early Shards, and where units stand
          on the board.
        </p>
        <p>
          Prefer a build over raw database browsing when you are learning a carry or
          resetting after a failed run. Cross-check strength on the{" "}
          <Link href="/tier-list">tier list</Link>, then deepen mechanics with{" "}
          <Link href="/guides">guides</Link>. All comps below target{" "}
          {siteConfig.gameVersion}.
        </p>
      </HubIntro>
      <div className="grid gap-4 md:grid-cols-2">
        {builds.map((build) => (
          <BuildCard key={build.slug} build={build} />
        ))}
      </div>
    </>
  );
}
