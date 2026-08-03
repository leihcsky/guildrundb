import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { formatDate } from "@/lib/utils";
import { getGuideBySlug, getGuides, renderMarkdown } from "@/lib/data";
import { breadcrumbJsonLd, buildGameEntityMetadata, entityJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getGuides()
    .filter(
      (guide) =>
        guide.slug !== "adjacent-positioning" && guide.slug !== "red-rift",
    )
    .map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return buildGameEntityMetadata({
    name: guide.title,
    kind: "guide",
    description: guide.description,
    path: `/guides/${guide.slug}`,
  });
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const html = await renderMarkdown(guide.content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Guides", path: "/guides" },
              { name: guide.title, path: `/guides/${guide.slug}` },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            entityJsonLd({
              type: "Article",
              name: guide.title,
              description: guide.description,
              path: `/guides/${guide.slug}`,
              dateModified: guide.updatedAt,
            }),
          ),
        }}
      />

      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: guide.title },
        ]}
      />

      <article className="mx-auto max-w-3xl">
        <header className="mb-8 space-y-3">
          <h1 className="font-display text-4xl font-bold">{guide.title}</h1>
          <p className="text-muted-foreground">{guide.description}</p>
          <p className="text-sm text-muted-foreground">
            Updated {formatDate(guide.updatedAt)}
          </p>
        </header>
        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </>
  );
}
