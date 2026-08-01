"use client";

import { useMemo, useState } from "react";
import type { Relic } from "@/types";
import { RelicCard } from "@/components/relics/relic-card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { resolveTagMeta } from "@/lib/tags";

type FilterOption = {
  slug: string;
  label: string;
  count: number;
};

const RARITY_ORDER = [
  "Common",
  "Rare",
  "Epic",
  "Legendary",
  "Unique",
  "Enemy",
  "Unknown",
];

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function rarityKey(relic: Relic) {
  return relic.rarity?.trim() || "Unknown";
}

function rarityScore(value: string) {
  const index = RARITY_ORDER.indexOf(value);
  return index === -1 ? 99 : index;
}

function buildRarityOptions(relics: Relic[]): FilterOption[] {
  const counts = new Map<string, number>();
  for (const relic of relics) {
    const key = rarityKey(relic);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, label: slug, count }))
    .sort((a, b) => rarityScore(a.slug) - rarityScore(b.slug));
}

function buildKeywordOptions(relics: Relic[]): FilterOption[] {
  const counts = new Map<string, number>();
  for (const relic of relics) {
    for (const tag of relic.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([slug, count]) => ({
      slug,
      label: resolveTagMeta(slug).label,
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function FilterCheckboxGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">{options.length}</span>
      </div>
      <ul className="space-y-1">
        {options.map((option) => {
          const checked = selected.includes(option.slug);
          return (
            <li key={option.slug}>
              <label
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                  checked
                    ? "bg-primary/15 text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(option.slug)}
                    className="h-3.5 w-3.5 shrink-0 accent-primary"
                  />
                  <span className="truncate">{option.label}</span>
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {option.count}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function RelicsBrowser({ relics }: { relics: Relic[] }) {
  const rarityOptions = useMemo(() => buildRarityOptions(relics), [relics]);
  const keywordOptions = useMemo(() => buildKeywordOptions(relics), [relics]);

  const [query, setQuery] = useState("");
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [sort, setSort] = useState<"az" | "rarity">("az");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = selectedRarities.length + selectedKeywords.length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = relics.filter((relic) => {
      const matchesQuery =
        !q ||
        relic.name.toLowerCase().includes(q) ||
        relic.effect.toLowerCase().includes(q) ||
        relic.tags.some((tag) => tag.includes(q) || resolveTagMeta(tag).label.toLowerCase().includes(q));

      const matchesRarity =
        selectedRarities.length === 0 ||
        selectedRarities.includes(rarityKey(relic));

      const matchesKeywords =
        selectedKeywords.length === 0 ||
        selectedKeywords.every((tag) => relic.tags.includes(tag));

      return matchesQuery && matchesRarity && matchesKeywords;
    });

    list = [...list].sort((a, b) => {
      if (sort === "rarity") {
        return (
          rarityScore(rarityKey(a)) - rarityScore(rarityKey(b)) ||
          a.name.localeCompare(b.name)
        );
      }
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [relics, query, selectedRarities, selectedKeywords, sort]);

  function clearFilters() {
    setSelectedRarities([]);
    setSelectedKeywords([]);
    setQuery("");
  }

  const sidebar = (
    <aside className="space-y-6 rounded-xl border border-border bg-card/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">Filters</p>
        {activeFilterCount > 0 || query ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-primary hover:underline"
          >
            Clear
          </button>
        ) : null}
      </div>

      <FilterCheckboxGroup
        title="Rarity"
        options={rarityOptions}
        selected={selectedRarities}
        onToggle={(slug) =>
          setSelectedRarities((prev) => toggleValue(prev, slug))
        }
      />

      <FilterCheckboxGroup
        title="Keyword"
        options={keywordOptions}
        selected={selectedKeywords}
        onToggle={(slug) =>
          setSelectedKeywords((prev) => toggleValue(prev, slug))
        }
      />
    </aside>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, effect, or keyword..."
          className="sm:max-w-md"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className="rounded-md border border-border px-3 py-2 text-sm lg:hidden"
          >
            {filtersOpen ? "Hide filters" : "Show filters"}
            {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>
          <button
            type="button"
            onClick={() => setSort("az")}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm",
              sort === "az"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary",
            )}
          >
            A-Z
          </button>
          <button
            type="button"
            onClick={() => setSort("rarity")}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm",
              sort === "rarity"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary",
            )}
          >
            Rarity
          </button>
          <p className="text-sm text-muted-foreground">
            {filtered.length} / {relics.length}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className={cn("lg:block", filtersOpen ? "block" : "hidden")}>
          {sidebar}
        </div>

        <div>
          {filtered.length === 0 ? (
            <EmptyState
              title="No relics found"
              description="Try clearing filters or searching a different name."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((relic) => (
                <RelicCard key={relic.slug} relic={relic} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
