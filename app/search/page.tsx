import type { Metadata } from "next";
import { SearchClient } from "@/components/search/search-client";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
import { getSearchIndex } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search heroes, relics, items, builds, and guides.",
  path: "/search",
});

export default function SearchPage() {
  const index = getSearchIndex();

  return (
    <>
      <Breadcrumb
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "Search" },
        ]}
      />
      <PageHeader
        title="Search"
        description="Unified realtime filter across the database."
      />
      <SearchClient initialResults={index} />
    </>
  );
}
