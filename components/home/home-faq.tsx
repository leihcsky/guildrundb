import { siteConfig } from "@/config/site.config";

export function HomeFaq() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Common questions about Guildrun and this database.
        </p>
      </div>
      <div className="divide-y divide-border rounded-xl border border-border">
        {siteConfig.faq.map((item) => (
          <details key={item.question} className="group px-5 py-4">
            <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span
                  aria-hidden
                  className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
