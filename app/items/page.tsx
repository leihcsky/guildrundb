import type { Metadata } from "next";
import { ItemsBrowser } from "@/components/items/items-browser";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
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
        title="Items"
        description="Filter gear by combat and class keywords, then open an item for stats and effects."
      />
      <ItemsBrowser items={items} />
    </>
  );
}
