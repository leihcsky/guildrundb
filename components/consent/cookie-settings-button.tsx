"use client";

import { useConsent } from "@/components/consent/consent-provider";

export function CookieSettingsButton({
  className,
}: {
  className?: string;
}) {
  const { openPreferences } = useConsent();

  return (
    <button
      type="button"
      onClick={openPreferences}
      className={className}
    >
      Cookie settings
    </button>
  );
}
