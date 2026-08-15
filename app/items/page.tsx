import type { Metadata } from "next";
import Link from "next/link";
import { ItemsBrowser } from "@/components/items/items-browser";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { HubIntro } from "@/components/shared/hub-intro";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site.config";
import { getItems } from "@/lib/data";
import { breadcrumbJsonLd, buildListMetadata } from "@/lib/seo";

export const metadata: Metadata = buildListMetadata("items", "/items");

export default function ItemsPage() {
  const items = getItems();
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Items", path: "/items" },
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
          { label: "Items" },
        ]}
      />
      <PageHeader
        title="Guildrun Items"
        description="Between-fight gear reference — stats, triggers, and keyword filters."
      />
      <HubIntro>
        <p>
          Items fill the gaps relics leave open: raw stats, combat triggers, and
          situational tools. Filter by combat or class keywords when a shop row looks
          familiar but you cannot remember whether it is an early engine piece or a
          late luxury buy.
        </p>
        <p>
          Treat item pages as lookup cards. For &quot;what should this hero buy first?&quot;
          prefer the item order inside a <Link href="/builds">build</Link> or the shop
          notes on a <Link href="/heroes">hero</Link> guide. Coverage follows{" "}
          {siteConfig.gameVersion}; unfinished sheet stubs are filtered out of this list.
        </p>
      </HubIntro>
      <ItemsBrowser items={items} />
    </>
  );
}
