import { GuideCard } from "@/components/guides/guide-card";
import type { Guide } from "@/types";

type Props = {
  guides: Guide[];
  title?: string;
  description?: string;
  className?: string;
};

export function RelatedGuides({
  guides,
  title = "Keep reading",
  description = "Two more guides that pair well with this one.",
  className = "mt-12 space-y-4 border-t border-border pt-8",
}: Props) {
  if (guides.length === 0) return null;

  return (
    <section className={className}>
      <div>
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </section>
  );
}
