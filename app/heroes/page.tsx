import type { Metadata } from "next";
import Link from "next/link";
import { HeroesBrowser } from "@/components/heroes/heroes-browser";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { HubIntro } from "@/components/shared/hub-intro";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site.config";
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
        title="Guildrun Heroes"
        description="Full Demo roster with classes, kits, and synergy entry points."
      />
      <HubIntro>
        <p>
          Use this roster when you are deciding <em>who to draft</em>, not when you
          already know the hero and only need a shop plan. Filter by class when you
          want a frontline, burst, or control fantasy; filter by combat keywords when
          a relic offer mentions Rush, Crit, Shield, or Burn and you need a matching
          kit.
        </p>
        <p>
          Each hero page covers ranks, active and passive abilities, specializations,
          and related relics. For &quot;is this hero strong right now?&quot; start on the{" "}
          <Link href="/tier-list">tier list</Link>; for a ready-made team package open{" "}
          <Link href="/builds">builds</Link>. Coverage tracks {siteConfig.gameVersion}.
        </p>
      </HubIntro>
      <HeroesBrowser heroes={heroes} />
    </>
  );
}
