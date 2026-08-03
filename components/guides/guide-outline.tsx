import type { GuideOutlineItem } from "@/lib/guide-nav";

export function GuideOutline({ items }: { items: GuideOutlineItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="rounded-lg border border-border bg-card/60 p-4"
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        On this page
      </p>
      <ol className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
