import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideOutline } from "@/components/guides/guide-outline";
import { RelatedGuides } from "@/components/guides/related-guides";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { getGuideBySlug, getGuides, renderMarkdown } from "@/lib/data";
import {
  extractGuideOutline,
  getRelatedGuides,
  injectHeadingIds,
} from "@/lib/guide-nav";
import { breadcrumbJsonLd, buildGameEntityMetadata, entityJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

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

  const outline = extractGuideOutline(guide.content);
  const html = injectHeadingIds(await renderMarkdown(guide.content), outline);
  const related = getRelatedGuides(getGuides(), guide.slug, 2);

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

      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="min-w-0">
          <header className="mb-8 space-y-3">
            <h1 className="font-display text-4xl font-bold">{guide.title}</h1>
            <p className="text-muted-foreground">{guide.description}</p>
            <p className="text-sm text-muted-foreground">
              Updated {formatDate(guide.updatedAt)}
            </p>
          </header>

          {outline.length > 0 ? (
            <div className="mb-8 lg:hidden">
              <GuideOutline items={outline} />
            </div>
          ) : null}

          <div
            className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <RelatedGuides guides={related} />
        </article>

        {outline.length > 0 ? (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <GuideOutline items={outline} />
            </div>
          </aside>
        ) : null}
      </div>
    </>
  );
}
