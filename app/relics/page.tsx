import type { Metadata } from "next";
import Link from "next/link";
import { RelicsBrowser } from "@/components/relics/relics-browser";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { HubIntro } from "@/components/shared/hub-intro";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site.config";
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
        title="Guildrun Relics"
        description="Lookup sheet for shop offers — effects, rarity, and keyword links."
      />
      <HubIntro>
        <p>
          Relics are the main mid-run power spikes in Guildrun. This index is built for
          fast shop decisions: filter by rarity when you are comparing an Epic offer to
          a Common engine piece, or filter by keyword when your board already leans
          Rush, Crit, Shield, or a class tag.
        </p>
        <p>
          Detail pages are reference cards for the printed effect and related tags.
          They are not full strategy essays — for packages that explain{" "}
          <em>when to take a relic line</em>, use a{" "}
          <Link href="/builds">curated build</Link> or a{" "}
          <Link href="/guides">guide</Link>. Dataset: {siteConfig.gameVersion}.
        </p>
      </HubIntro>
      <RelicsBrowser relics={relics} />
    </>
  );
}
