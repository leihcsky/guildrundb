import Link from "next/link";
import type { DataStatEntry } from "@/lib/data";
import { siteConfig } from "@/config/site.config";

const PRIMARY_LABELS = new Set([
  "Heroes",
  "Relics",
  "Items",
  "Builds",
  "Guides",
  "Classes",
]);

export function CoverageStrip({ stats }: { stats: DataStatEntry[] }) {
  const primary = stats.filter((stat) => PRIMARY_LABELS.has(stat.label));

  return (
    <section className="rounded-xl border border-border bg-surface/40 px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {siteConfig.gameVersion} coverage
          </span>
          {" — "}
          searchable records for shop decisions. Thin detail pages stay lookup-only.
        </p>
        <Link href="/about" className="shrink-0 text-sm text-primary hover:underline">
          About this hub
        </Link>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {primary.map((stat) => (
          <li key={stat.label}>
            <Link
              href={stat.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="font-semibold text-foreground">
                {stat.count.toLocaleString()}
              </span>{" "}
              {stat.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
