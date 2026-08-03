import { GuideCard } from "@/components/guides/guide-card";
import type { Guide } from "@/types";

export function RelatedGuides({ guides }: { guides: Guide[] }) {
  if (guides.length === 0) return null;

  return (
    <section className="mt-12 space-y-4 border-t border-border pt-8">
      <div>
        <h2 className="font-display text-2xl font-semibold">Keep reading</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Two more guides that pair well with this one.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </section>
  );
}
