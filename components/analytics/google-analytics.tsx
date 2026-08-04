import Script from "next/script";
import { siteConfig } from "@/config/site.config";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";

const gaId = siteConfig.googleAnalyticsId;

/**
 * Consent Mode v2 defaults must run before the Google tag config.
 * Prior choice is restored from localStorage so returning visitors stay opted.
 */
export function GoogleAnalytics() {
  if (!gaId) return null;

  return (
    <>
      <Script id="google-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted',
            wait_for_update: 500
          });
          try {
            var raw = localStorage.getItem('${CONSENT_STORAGE_KEY}');
            if (raw) {
              var c = JSON.parse(raw);
              gtag('consent', 'update', {
                analytics_storage: c.analytics ? 'granted' : 'denied',
                ad_storage: c.advertising ? 'granted' : 'denied',
                ad_user_data: c.advertising ? 'granted' : 'denied',
                ad_personalization: c.advertising ? 'granted' : 'denied'
              });
            }
          } catch (e) {}
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
