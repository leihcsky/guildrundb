import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/guides/guide-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { HubIntro } from "@/components/shared/hub-intro";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site.config";
import { getGuides } from "@/lib/data";
import { breadcrumbJsonLd, buildListMetadata } from "@/lib/seo";

export const metadata: Metadata = buildListMetadata("guides", "/guides");

export default function GuidesPage() {
  const guides = getGuides();
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
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
          { label: "Guides" },
        ]}
      />
      <PageHeader
        title="Guildrun Guides"
        description="Strategy essays for drafting, shops, positioning, and hard nodes."
      />
      <HubIntro>
        <p>
          Guides answer <em>how to think</em> between fights: economy curves, formation
          rules, Rush versus Stall timing, and boss or node-specific plans. They
          complement the database — use relics and items to verify a shop row, then
          return here when the decision is about tempo or risk.
        </p>
        <p>
          If you already know the carry you want, a{" "}
          <Link href="/builds">build page</Link> is usually faster. If you are still
          learning the roster, skim guides first, then check the{" "}
          <Link href="/tier-list">tier list</Link>. Articles below are written for{" "}
          {siteConfig.gameVersion} and updated when Demo balance shifts enough to
          change the advice.
        </p>
      </HubIntro>
      <div className="grid gap-4 md:grid-cols-2">
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </>
  );
}
