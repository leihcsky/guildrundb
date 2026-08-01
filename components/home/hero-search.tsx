"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Hero } from "@/types";

export function HeroSearch({ heroes }: { heroes: Pick<Hero, "slug" | "name" | "class" | "role">[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return heroes
      .filter(
        (hero) =>
          hero.name.toLowerCase().includes(q) ||
          hero.class.toLowerCase().includes(q) ||
          hero.role.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [heroes, query]);

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Hero..."
          className="h-12 pl-10"
          aria-label="Search heroes"
        />
      </div>
      {results.length > 0 ? (
        <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          {results.map((hero) => (
            <li key={hero.slug}>
              <Link
                href={`/heroes/${hero.slug}`}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-accent"
              >
                <span className="font-medium">{hero.name}</span>
                <span className="text-muted-foreground">
                  {hero.class} · {hero.role}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
