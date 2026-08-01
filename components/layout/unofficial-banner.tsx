import Link from "next/link";
import { siteConfig } from "@/config/site.config";

/** Persistent fan-site disclosure — not a game-client chrome strip. */
export function UnofficialBanner() {
  const { unofficialBanner } = siteConfig;

  return (
    <div className="border-b border-border/70 bg-muted/40 text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-1.5 text-center text-xs sm:text-sm">
        <span>{unofficialBanner.text}</span>
        <span className="hidden text-border sm:inline" aria-hidden>
          ·
        </span>
        <Link
          href={unofficialBanner.href}
          className="underline-offset-2 hover:text-foreground hover:underline"
        >
          {unofficialBanner.linkLabel}
        </Link>
      </div>
    </div>
  );
}
