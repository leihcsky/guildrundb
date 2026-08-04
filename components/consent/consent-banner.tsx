"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ConsentPreferences } from "@/lib/consent";

type Props = {
  open: boolean;
  preferences: ConsentPreferences;
  onAcceptAll: () => void;
  onRejectNonEssential: () => void;
  onSave: (prefs: Pick<ConsentPreferences, "analytics" | "advertising">) => void;
  onClose: () => void;
};

export function ConsentBanner({
  open,
  preferences,
  onAcceptAll,
  onRejectNonEssential,
  onSave,
  onClose,
}: Props) {
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(preferences.analytics);
  const [advertising, setAdvertising] = useState(preferences.advertising);

  useEffect(() => {
    if (!open) {
      setCustomize(false);
      return;
    }
    setAnalytics(preferences.analytics);
    setAdvertising(preferences.advertising);
  }, [open, preferences.analytics, preferences.advertising]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
    >
      <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-5 shadow-lg sm:p-6">
        <div className="space-y-3">
          <h2 id="consent-title" className="font-display text-lg font-semibold text-foreground">
            Cookies & privacy
          </h2>
          <p className="text-sm text-muted-foreground">
            We use essential storage for the site to work (for example theme). With your
            OK, we also use Google Analytics and — when ads are enabled — Google
            advertising technologies. You can change this anytime. See our{" "}
            <Link href="/privacy" className="underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {customize ? (
          <div className="mt-4 space-y-3 rounded-md border border-border bg-surface/50 p-4">
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked
                disabled
                className="mt-1"
                aria-label="Essential cookies always on"
              />
              <span>
                <span className="font-medium text-foreground">Essential</span>
                <span className="mt-0.5 block text-muted-foreground">
                  Required for basic site function and remembering this choice. Always on.
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1"
              />
              <span>
                <span className="font-medium text-foreground">Analytics</span>
                <span className="mt-0.5 block text-muted-foreground">
                  Google Analytics helps us understand aggregate traffic (pages, devices,
                  referrals).
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={advertising}
                onChange={(e) => setAdvertising(e.target.checked)}
                className="mt-1"
              />
              <span>
                <span className="font-medium text-foreground">Advertising</span>
                <span className="mt-0.5 block text-muted-foreground">
                  Allows Google ad cookies and related signals when AdSense or similar ads
                  are serving on this site.
                </span>
              </span>
            </label>
          </div>
        ) : null}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          {preferences.updatedAt ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:mr-auto"
            >
              Close
            </button>
          ) : null}
          {!customize ? (
            <button
              type="button"
              onClick={() => setCustomize(true)}
              className="rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              Customize
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSave({ analytics, advertising })}
              className="rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              Save choices
            </button>
          )}
          <button
            type="button"
            onClick={onRejectNonEssential}
            className="rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={onAcceptAll}
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
