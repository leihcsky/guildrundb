import type { Metadata } from "next";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { HubIntro } from "@/components/shared/hub-intro";
import { PageHeader } from "@/components/shared/page-header";
import { UpdateCard } from "@/components/updates/update-card";
import { siteConfig } from "@/config/site.config";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getUpdates } from "@/lib/updates";

export const metadata: Metadata = buildMetadata({
  title: "Guildrun Hub Updates",
  description: `Patch notes, meta changelogs, and site updates for ${siteConfig.name} — Demo coverage, tier-list changes, and editorial improvements.`,
  path: "/updates",
});

export default function UpdatesPage() {
  const posts = getUpdates();
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Updates", path: "/updates" },
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
          { label: "Updates" },
        ]}
      />
      <PageHeader
        title="Updates"
        description="Demo coverage notes, meta changelogs, and hub improvements."
      />
      <HubIntro>
        <p>
          This log tracks what changed on Guildrun Hub and how it affects Demo
          play advice. Use it to see which patch the database reflects and when
          the tier list or guides moved.
        </p>
      </HubIntro>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No updates published yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <UpdateCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
