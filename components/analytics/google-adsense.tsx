import Script from "next/script";
import { siteConfig } from "@/config/site.config";

const adsClient = siteConfig.googleAdsenseClientId;

/** AdSense loader — Consent Mode (in GoogleAnalytics) controls ad_* signals. */
export function GoogleAdSense() {
  if (!adsClient) return null;

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
