import type { HeroGuideModel } from "@/lib/hero-guide";

export function HeroDecisionSummary({ guide }: { guide: HeroGuideModel }) {
  const rows = [
    { label: "Role", value: guide.roleLabel },
    { label: "Best for", value: guide.bestFor },
    { label: "Strength", value: guide.strength },
    { label: "Weakness", value: guide.weakness },
  ];

  return (
    <section
      id="guide"
      className="scroll-mt-24 space-y-3 rounded-lg border border-border bg-card/60 p-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="font-display text-xl font-semibold">At a glance</h2>
        <span className="text-xs text-muted-foreground">
          {guide.source === "hybrid" ? "Guide notes" : "Auto guide · edit anytime"}
        </span>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
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

export function HeroHowToPlay({ guide }: { guide: HeroGuideModel }) {
  const steps = [
    { label: "Early", value: guide.howToPlay.early },
    { label: "Mid", value: guide.howToPlay.mid },
    { label: "Late", value: guide.howToPlay.late },
    { label: "Positioning", value: guide.howToPlay.positioning },
  ];

  return (
    <section id="how-to-play" className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="font-display text-2xl font-semibold">How to play</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Decision notes for shops and formation — not a copy of the in-game panel.
        </p>
      </div>
      <ol className="grid gap-3 sm:grid-cols-2">
        {steps.map((step) => (
          <li
            key={step.label}
            className="rounded-lg border border-border bg-card p-4"
          >
            <h3 className="text-sm font-semibold text-foreground">{step.label}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.value}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function HeroGuideFaq({ guide }: { guide: HeroGuideModel }) {
  if (guide.faq.length === 0) return null;

  return (
    <section id="faq" className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="font-display text-2xl font-semibold">FAQ</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Common questions when this hero shows up in the shop or draft.
        </p>
      </div>
      <div className="space-y-3">
        {guide.faq.map((item) => (
          <div
            key={item.question}
            className="rounded-lg border border-border bg-card p-4"
          >
            <h3 className="font-medium text-foreground">{item.question}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
