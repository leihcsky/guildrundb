"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyGtagConsent,
  DEFAULT_CONSENT,
  readStoredConsent,
  writeStoredConsent,
  type ConsentPreferences,
} from "@/lib/consent";
import { ConsentBanner } from "@/components/consent/consent-banner";

type ConsentContextValue = {
  preferences: ConsentPreferences | null;
  /** True after we know whether a stored choice exists (avoids banner flash). */
  ready: boolean;
  openPreferences: () => void;
  savePreferences: (prefs: Pick<ConsentPreferences, "analytics" | "advertising">) => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return ctx;
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [ready, setReady] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored) {
      setPreferences(stored);
      applyGtagConsent(stored);
      setPanelOpen(false);
    } else {
      setPreferences(null);
      setPanelOpen(true);
    }
    setReady(true);
  }, []);

  const persist = useCallback(
    (next: Pick<ConsentPreferences, "analytics" | "advertising">) => {
      const full: ConsentPreferences = {
        ...next,
        updatedAt: new Date().toISOString(),
      };
      writeStoredConsent(full);
      applyGtagConsent(full);
      setPreferences(full);
      setPanelOpen(false);
    },
    [],
  );

  const value = useMemo<ConsentContextValue>(
    () => ({
      preferences,
      ready,
      openPreferences: () => setPanelOpen(true),
      savePreferences: persist,
      acceptAll: () => persist({ analytics: true, advertising: true }),
      rejectNonEssential: () =>
        persist({ analytics: false, advertising: false }),
    }),
    [preferences, ready, persist],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {ready ? (
        <ConsentBanner
          open={panelOpen || preferences === null}
          preferences={preferences ?? DEFAULT_CONSENT}
          onAcceptAll={value.acceptAll}
          onRejectNonEssential={value.rejectNonEssential}
          onSave={value.savePreferences}
          onClose={() => {
            if (preferences) setPanelOpen(false);
          }}
        />
      ) : null}
    </ConsentContext.Provider>
  );
}
