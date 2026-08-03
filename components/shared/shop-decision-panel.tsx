import type { ShopDecisionNotes } from "@/lib/shop-notes";

export function ShopDecisionPanel({
  notes,
  entityLabel,
}: {
  notes: ShopDecisionNotes;
  entityLabel: "relic" | "item";
}) {
  const rows = [
    { label: "Best for", value: notes.bestFor },
    { label: "Skip when", value: notes.skipWhen },
    { label: "Shop note", value: notes.shopNote },
  ];

  return (
    <section
      id="shop-notes"
      className="scroll-mt-24 space-y-3 rounded-lg border border-border bg-card/60 p-5"
    >
      <div>
        <h2 className="font-display text-xl font-semibold">Shop decision</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          When this {entityLabel} shows up — buy, hold, or skip.
        </p>
      </div>
      <dl className="grid gap-3">
        {rows.map((row) => (
          <div key={row.label} className="space-y-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {row.label}
            </dt>
            <dd className="text-sm text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
