import Link from "next/link";
import { UpdateCard } from "@/components/updates/update-card";
import { getLatestUpdates } from "@/lib/updates";

export function LatestUpdates({ limit = 3 }: { limit?: number }) {
  const posts = getLatestUpdates(limit);
  if (posts.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold">Latest updates</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Demo coverage notes, meta changelogs, and hub improvements.
          </p>
        </div>
        <Link href="/updates" className="text-sm text-primary hover:underline">
          All updates
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <UpdateCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
