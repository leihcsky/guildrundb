import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Opening",
    body: "Mostly Rank C · one clear job per slot.",
    href: "/guides/growth-route",
  },
  {
    step: "02",
    title: "First spike",
    body: "Specialize the hero that wins the next fight.",
    href: "/guides/growth-route",
  },
  {
    step: "03",
    title: "Expansion",
    body: "Add a new job — not a fourth copy of the same role.",
    href: "/guides/growth-route",
  },
  {
    step: "04",
    title: "Engine",
    body: "Draft a relic/modifier line that fires every fight.",
    href: "/guides/growth-route",
  },
  {
    step: "05",
    title: "Final shape",
    body: "Finish the carry; last slot answers the matchup.",
    href: "/guides/growth-route",
  },
] as const;

export function GrowthRoute() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">Growth route</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            From opening board to final shape — Rank C→S, expansion, and when to
            finish the carry.
          </p>
        </div>
        <Link
          href="/guides/growth-route"
          className="text-sm text-primary hover:underline"
        >
          Open growth route guide
        </Link>
      </div>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((item) => (
          <li key={item.step}>
            <Link
              href={item.href}
              className="flex h-full flex-col gap-2 rounded-lg border border-border bg-card/50 p-4 transition-colors hover:border-primary/40 hover:bg-accent/20"
            >
              <span className="font-display text-sm font-semibold text-primary">
                {item.step}
              </span>
              <span className="font-medium text-foreground">{item.title}</span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {item.body}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
