import type { Guide } from "@/types";

export type GuideOutlineItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

/** Preferred “read next” pairs for the decision-series guides. */
const CURATED_RELATED: Record<string, string[]> = {
  "fight-loss-checklist": ["shop-order-shards", "rush-vs-stall"],
  "shop-order-shards": ["reading-relic-offers", "rush-vs-stall"],
  "reading-relic-offers": ["rush-vs-stall", "shop-order-shards"],
  "rush-vs-stall": ["shop-order-shards", "fight-loss-checklist"],
  "getting-started": ["rush-vs-stall", "fight-loss-checklist"],
  "red-rift": ["fight-loss-checklist", "rush-vs-stall"],
  "adjacent-positioning": ["rush-vs-stall", "fight-loss-checklist"],
};

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function stripMdInline(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();
}

/**
 * Build a clickable outline from top-level markdown sections (`##` only).
 * `###` stays in the article but is omitted from the outline to keep it short.
 */
export function extractGuideOutline(markdown: string): GuideOutlineItem[] {
  const items: GuideOutlineItem[] = [];
  const used = new Map<string, number>();

  for (const line of markdown.split(/\r?\n/)) {
    const match = /^(#{2})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const title = stripMdInline(match[2]);
    if (!title) continue;

    let id = slugifyHeading(title);
    const count = used.get(id) ?? 0;
    used.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;

    items.push({ id, title, level: 2 });
  }

  return items;
}

/** Add matching `id` attributes to h2 tags that appear in the outline (## only). */
export function injectHeadingIds(html: string, outline: GuideOutlineItem[]) {
  if (outline.length === 0) return html;

  let index = 0;
  return html.replace(/<h2(\s[^>]*)?>/gi, (open, attrs = "") => {
    const item = outline[index];
    if (!item) return open;
    index += 1;
    if (/\sid=/i.test(attrs)) return open;
    return `<h2 id="${item.id}"${attrs}>`;
  });
}

export function getRelatedGuides(
  guides: Guide[],
  currentSlug: string,
  limit = 2,
): Guide[] {
  const all = guides.filter((guide) => guide.slug !== currentSlug);
  if (all.length === 0) return [];

  const picked: Guide[] = [];
  const seen = new Set<string>();

  for (const slug of CURATED_RELATED[currentSlug] ?? []) {
    const guide = all.find((item) => item.slug === slug);
    if (!guide || seen.has(guide.slug)) continue;
    picked.push(guide);
    seen.add(guide.slug);
    if (picked.length >= limit) return picked;
  }

  const current = guides.find((guide) => guide.slug === currentSlug);
  const currentTags = new Set(current?.tags ?? []);

  const scored = all
    .filter((guide) => !seen.has(guide.slug))
    .map((guide) => {
      const overlap = (guide.tags ?? []).filter((tag) => currentTags.has(tag))
        .length;
      return { guide, overlap };
    })
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return +new Date(b.guide.updatedAt) - +new Date(a.guide.updatedAt);
    });

  for (const row of scored) {
    picked.push(row.guide);
    if (picked.length >= limit) break;
  }

  return picked.slice(0, limit);
}
