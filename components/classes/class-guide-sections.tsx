import type { ClassGuide } from "@/lib/class-guide";

export function ClassDecisionSummary({ guide }: { guide: ClassGuide }) {
  const rows = [
    { label: "Role", value: guide.roleLabel },
    { label: "Strength", value: guide.strength },
    { label: "Weakness", value: guide.weakness },
  ];

  return (
    <section
      id="at-a-glance"
      className="scroll-mt-24 space-y-3 rounded-lg border border-border bg-card/60 p-5"
    >
      <h2 className="font-display text-xl font-semibold">At a glance</h2>
      <dl className="grid gap-3 sm:grid-cols-3">
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

export function ClassHowToPlay({ guide }: { guide: ClassGuide }) {
  const steps = [
    { label: "Drafting", value: guide.howToPlay.draft },
    { label: "Shop priorities", value: guide.howToPlay.shop },
    { label: "Positioning", value: guide.howToPlay.positioning },
  ];

  return (
    <section id="how-to-play" className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="font-display text-2xl font-semibold">
          How to play this class
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Draft, shop, and formation notes for building around the class.
        </p>
      </div>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((step) => (
          <li
            key={step.label}
            className="rounded-lg border border-border bg-card p-4"
          >
            <h3 className="text-sm font-semibold text-foreground">
              {step.label}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.value}</p>
          </li>
        ))}
      </ol>

      {guide.shopPriorities && guide.shopPriorities.length > 0 ? (
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground">
            What to buy first
          </h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {guide.shopPriorities.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export function ClassSignatureHeroes({ guide }: { guide: ClassGuide }) {
  if (!guide.signatureHeroes || guide.signatureHeroes.length === 0) return null;

  return (
    <section id="signature-heroes" className="scroll-mt-24 space-y-3">
      <h2 className="font-display text-2xl font-semibold">Signature picks</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {guide.signatureHeroes.map((hero) => (
          <li
            key={hero.name}
            className="rounded-lg border border-border bg-card p-4"
          >
            <h3 className="font-medium text-foreground">{hero.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{hero.why}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ClassGuideFaq({ guide }: { guide: ClassGuide }) {
  if (guide.faq.length === 0) return null;

  return (
    <section id="faq" className="scroll-mt-24 space-y-4">
      <h2 className="font-display text-2xl font-semibold">FAQ</h2>
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

export function ClassGuideTips({ guide }: { guide: ClassGuide }) {
  if (!guide.tips || guide.tips.length === 0) return null;

  return (
    <section id="tips" className="scroll-mt-24 space-y-3">
      <h2 className="font-display text-2xl font-semibold">Tips</h2>
      <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
        {guide.tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </section>
  );
}
