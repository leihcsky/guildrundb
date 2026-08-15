import type { Metadata } from "next";
import Link from "next/link";
import { ClassCard } from "@/components/classes/class-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { HubIntro } from "@/components/shared/hub-intro";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site.config";
import { getHeroClasses } from "@/lib/data";
import { breadcrumbJsonLd, buildListMetadata } from "@/lib/seo";

export const metadata: Metadata = buildListMetadata("classes", "/classes");

export default function ClassesPage() {
  const classes = getHeroClasses();
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Classes", path: "/classes" },
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
          { label: "Classes" },
        ]}
      />
      <PageHeader
        title="Guildrun Classes"
        description="Seven role fantasies — how each class wants to spend the shop."
      />
      <HubIntro>
        <p>
          Pick a class page before you lock a hero when you care about{" "}
          <em>role shape</em>: who holds the front, who needs Crit engines, who scales
          with Magic, who sells Shield packages. Each class has a short signature
          keyword list that matches the tags you see on relics and abilities.
        </p>
        <p>
          Inside a class guide you get playstyle notes, shop priorities, signature
          heroes, and FAQ — not just a hero grid. After you choose a fantasy, jump to
          matching <Link href="/heroes">heroes</Link> or a ready{" "}
          <Link href="/builds">build</Link>. Written for {siteConfig.gameVersion}.
        </p>
      </HubIntro>
      <div className="grid gap-4 md:grid-cols-2">
        {classes.map((heroClass) => (
          <ClassCard key={heroClass.slug} heroClass={heroClass} />
        ))}
      </div>
    </>
  );
}
