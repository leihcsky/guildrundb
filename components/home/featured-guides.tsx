import Link from "next/link";
import { GuideCard } from "@/components/guides/guide-card";
import { getGuides } from "@/lib/data";
import { getFeaturedGuides } from "@/lib/guide-nav";

export function FeaturedGuides() {
  const guides = getFeaturedGuides(getGuides(), 6);
  if (guides.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold">Featured Guides</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Practical Demo strategy — drafting, shops, tempo, and clearing hard
            content.
          </p>
        </div>
        <Link href="/guides" className="text-sm text-primary hover:underline">
          All guides
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </section>
  );
}
