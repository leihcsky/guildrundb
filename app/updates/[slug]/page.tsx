import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { renderMarkdown } from "@/lib/data";
import {
  breadcrumbJsonLd,
  buildMetadata,
  entityJsonLd,
} from "@/lib/seo";
import { getUpdateBySlug, getUpdates } from "@/lib/updates";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getUpdates().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getUpdateBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/updates/${post.slug}`,
  });
}

export default async function UpdateDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getUpdateBySlug(slug);
  if (!post) notFound();

  const html = await renderMarkdown(post.content);
  const related = getUpdates()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Updates", path: "/updates" },
              { name: post.title, path: `/updates/${post.slug}` },
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
              name: post.title,
              description: post.description,
              path: `/updates/${post.slug}`,
              dateModified: post.publishedAt,
            }),
          ),
        }}
      />

      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Updates", href: "/updates" },
          { label: post.title },
        ]}
      />

      <article className="mx-auto max-w-3xl">
        <header className="mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-sm text-muted-foreground">
              {formatDate(post.publishedAt)}
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold">{post.title}</h1>
          <p className="text-muted-foreground">{post.description}</p>
        </header>

        <div
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {related.length > 0 ? (
          <section className="mt-12 space-y-4 border-t border-border pt-8">
            <h2 className="font-display text-2xl font-semibold">More updates</h2>
            <ul className="space-y-2 text-sm">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/updates/${item.slug}`}
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    {item.title}
                  </Link>
                  <span className="ml-2 text-muted-foreground">
                    {formatDate(item.publishedAt)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}
