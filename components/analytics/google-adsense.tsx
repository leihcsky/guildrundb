"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site.config";

const adsClient = siteConfig.googleAdsenseClientId;

/**
 * Routes that must NOT load AdSense. These are templated / thin / utility
 * pages (relic & item database, keyword landing pages, on-site search) plus
 * legal/utility pages. Keeping ads off low-value inventory is required for
 * AdSense policy compliance (ADS-PUB-11).
 */
const DENY_PREFIXES = [
  "/relics",
  "/items",
  "/keywords",
  "/search",
  "/privacy",
  "/terms",
  "/copyright",
  "/contact",
];

/**
 * Sections with substantial, editorially reviewed content that may serve ads.
 */
const ALLOW_PREFIXES = [
  "/guides",
  "/builds",
  "/heroes",
  "/classes",
  "/tier-list",
  "/about",
];

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function adsAllowed(pathname: string | null): boolean {
  if (!pathname) return false;
  if (matchesPrefix(pathname, DENY_PREFIXES)) return false;
  if (pathname === "/") return true;
  return matchesPrefix(pathname, ALLOW_PREFIXES);
}

/** AdSense loader — Consent Mode (in GoogleAnalytics) controls ad_* signals. */
export function GoogleAdSense() {
  const pathname = usePathname();

  if (!adsClient) return null;
  if (!adsAllowed(pathname)) return null;

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
