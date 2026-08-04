export const CONSENT_STORAGE_KEY = "guildrunhub-consent-v1";

export type ConsentPreferences = {
  /** Google Analytics (analytics_storage) */
  analytics: boolean;
  /** Future AdSense / Google ads (ad_storage, ad_user_data, ad_personalization) */
  advertising: boolean;
  updatedAt: string;
};

export const DEFAULT_CONSENT: ConsentPreferences = {
  analytics: false,
  advertising: false,
  updatedAt: "",
};

export function readStoredConsent(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.advertising !== "boolean") {
      return null;
    }
    return {
      analytics: parsed.analytics,
      advertising: parsed.advertising,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return null;
  }
}

export function writeStoredConsent(prefs: ConsentPreferences) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs));
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Push Consent Mode v2 update to gtag (no-op until gtag exists). */
export function applyGtagConsent(prefs: Pick<ConsentPreferences, "analytics" | "advertising">) {
  const grant = (on: boolean) => (on ? "granted" : "denied");
  const payload = {
    analytics_storage: grant(prefs.analytics),
    ad_storage: grant(prefs.advertising),
    ad_user_data: grant(prefs.advertising),
    ad_personalization: grant(prefs.advertising),
  };

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", payload);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["consent", "update", payload]);
}
