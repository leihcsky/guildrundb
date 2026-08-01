import type { Metadata } from "next";
import { ClassCard } from "@/components/classes/class-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
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
        title="Classes"
        description="Each class brings a core stat fantasy and a short list of signature keywords."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {classes.map((heroClass) => (
          <ClassCard key={heroClass.slug} heroClass={heroClass} />
        ))}
      </div>
    </>
  );
}
