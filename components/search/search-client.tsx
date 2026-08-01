"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { SearchResult } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";

export function SearchClient({
  initialQuery = "",
  initialResults,
}: {
  initialQuery?: string;
  initialResults: SearchResult[];
}) {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return initialResults.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.meta?.toLowerCase().includes(q) ?? false),
    );
  }, [initialResults, query]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search heroes, relics, items, builds, keywords..."
          className="h-12 pl-10"
          autoFocus
        />
      </div>

      {!query.trim() ? (
        <EmptyState
          title="Start typing to search"
          description="Unified search across heroes, relics, items, builds, and keywords."
        />
      ) : results.length === 0 ? (
        <EmptyState title="No results" description={`Nothing matched “${query}".`} />
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {results.map((result) => (
            <li key={`${result.type}-${result.slug}`}>
              <Link
                href={result.href}
                className="flex flex-col gap-2 px-4 py-4 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{result.name}</p>
                    <Badge variant="outline" className="capitalize">
                      {result.type}
                    </Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {result.description}
                  </p>
                </div>
                {result.meta ? (
                  <p className="shrink-0 text-xs text-muted-foreground">{result.meta}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
