import { siteConfig } from "@/config/site.config";
import type { Metadata } from "next";

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

/**
 * Absolute URL aligned with `trailingSlash: true`.
 * Page paths always end with `/`; file assets (images, icons) do not.
 */
export function absoluteUrl(path = "/") {
  const base = siteConfig.url.replace(/\/+$/, "");
  let normalized = path.startsWith("/") ? path : `/${path}`;

  if (normalized === "/") {
    return `${base}/`;
  }

  const pathOnly = normalized.split(/[?#]/)[0] ?? normalized;
  const isAsset = /\.[a-zA-Z0-9]+$/.test(pathOnly);
  if (isAsset) {
    return `${base}${normalized}`;
  }

  normalized = `${normalized.replace(/\/+$/, "")}/`;
  return `${base}${normalized}`;
}

export function getSiteIcons(): Metadata["icons"] {
  const { branding } = siteConfig;

  return {
    icon: [
      { url: branding.favicon, type: "image/svg+xml" },
      { url: branding.logoMark, type: "image/svg+xml", sizes: "32x32" },
    ],
    apple: [{ url: branding.appleTouchIcon, sizes: "180x180" }],
    shortcut: branding.favicon,
  };
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image
    ? absoluteUrl(image)
    : absoluteUrl(siteConfig.branding.ogImage);
  const fullTitle =
    title === siteConfig.name ||
    title.includes(`| ${siteConfig.name}`) ||
    title.startsWith(`${siteConfig.name} `) ||
    title.startsWith(`${siteConfig.name}—`) ||
    title.startsWith(`${siteConfig.name} -`)
      ? title
      : `${title} | ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function buildHomeMetadata(): Metadata {
  return buildMetadata({
    title: siteConfig.seo.homeTitle,
    description: siteConfig.seo.homeDescription,
    path: "/",
  });
}

type ListPageKey = keyof typeof siteConfig.seo.lists;

export function buildListMetadata(
  listKey: ListPageKey,
  path: `/${string}`,
): Metadata {
  const page = siteConfig.seo.lists[listKey];
  return buildMetadata({
    title: page.title,
    description: page.description,
    path,
  });
}

export type EntitySeoKind =
  | "hero"
  | "relic"
  | "item"
  | "class"
  | "build"
  | "keyword"
  | "guide";

function joinTitleSignal(parts: Array<string | undefined | null>): string {
  return parts
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean)
    .join(" · ");
}

/**
 * Entity titles favor searchable name + a short differentiating signal.
 * Heroes keep `Guildrun {name}` for query match; other kinds lead with the entity name.
 */
export function buildGameEntityMetadata(input: {
  name: string;
  kind: EntitySeoKind;
  description: string;
  path: string;
  image?: string;
  /** Differentiator after an em dash, e.g. "Mystic · Requiem Barrage" */
  signal?: string | Array<string | undefined | null>;
}): Metadata {
  const signal =
    typeof input.signal === "string"
      ? input.signal.trim()
      : joinTitleSignal(input.signal ?? []);

  let title: string;
  switch (input.kind) {
    case "hero":
      title = signal
        ? `${siteConfig.game} ${input.name} — ${signal}`
        : `${siteConfig.game} ${input.name}`;
      break;
    case "guide":
      title = input.name;
      break;
    case "build":
      title = signal ? `${input.name} — ${signal}` : input.name;
      break;
    case "keyword":
      title = signal ? `${input.name} — ${signal}` : `${input.name} keyword`;
      break;
    default:
      title = signal ? `${input.name} — ${signal}` : input.name;
      break;
  }

  return buildMetadata({
    title,
    description: input.description,
    path: input.path,
    image: input.image,
  });
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function entityJsonLd(input: {
  type: "Thing" | "Article" | "Game";
  name: string;
  description: string;
  path: string;
  image?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": input.type,
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
  };
}
