import type { Metadata } from "next";
import { GuideCard } from "@/components/guides/guide-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
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
        title="Guides"
        description="Practical Demo tips for drafting, shops, positioning, and clearing hard content."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </>
  );
}
