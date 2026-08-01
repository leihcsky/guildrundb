"use client";

import { useMemo, useState } from "react";
import type { Hero } from "@/types";
import { HeroCard } from "@/components/heroes/hero-card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { resolveTagMeta } from "@/lib/tags";

type FilterOption = {
  slug: string;
  label: string;
  count: number;
};

const CLASS_ORDER = [
  "assassin",
  "duelist",
  "mage",
  "mystic",
  "tank",
  "vanguard",
  "warrior",
];

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function buildClassOptions(heroes: Hero[]): FilterOption[] {
  const counts = new Map<string, { label: string; count: number }>();

  for (const hero of heroes) {
    const pairs =
      hero.classSlugs.length > 0
        ? hero.classSlugs.map((slug, index) => ({
            slug,
            label:
              hero.class.split(" / ")[index] ||
              slug.charAt(0).toUpperCase() + slug.slice(1),
          }))
        : hero.classSlug
          ? [{ slug: hero.classSlug, label: hero.class || hero.classSlug }]
          : [];

    for (const pair of pairs) {
      const existing = counts.get(pair.slug);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(pair.slug, { label: pair.label, count: 1 });
      }
    }
  }

  return [...counts.entries()]
    .map(([slug, meta]) => ({ slug, label: meta.label, count: meta.count }))
    .sort((a, b) => {
      const ai = CLASS_ORDER.indexOf(a.slug);
      const bi = CLASS_ORDER.indexOf(b.slug);
      if (ai !== -1 || bi !== -1) {
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      }
      return a.label.localeCompare(b.label);
    });
}

function buildKeywordOptions(
  heroes: Hero[],
  classSlugs: Set<string>,
): FilterOption[] {
  const counts = new Map<string, number>();

  for (const hero of heroes) {
    for (const tag of hero.tags) {
      if (classSlugs.has(tag)) continue;
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

export function HeroesBrowser({ heroes }: { heroes: Hero[] }) {
  const classOptions = useMemo(() => buildClassOptions(heroes), [heroes]);
  const classSlugSet = useMemo(
    () => new Set(classOptions.map((item) => item.slug)),
    [classOptions],
  );
  const keywordOptions = useMemo(
    () => buildKeywordOptions(heroes, classSlugSet),
    [heroes, classSlugSet],
  );

  const [query, setQuery] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [sort, setSort] = useState<"az" | "updated">("az");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = selectedClasses.length + selectedKeywords.length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = heroes.filter((hero) => {
      const matchesQuery =
        !q ||
        hero.name.toLowerCase().includes(q) ||
        hero.overview.toLowerCase().includes(q) ||
        hero.class.toLowerCase().includes(q) ||
        hero.role.toLowerCase().includes(q) ||
        hero.tags.some((tag) => tag.includes(q));

      const matchesClass =
        selectedClasses.length === 0 ||
        selectedClasses.some(
          (slug) =>
            hero.classSlugs.includes(slug) || hero.classSlug === slug,
        );

      const matchesKeywords =
        selectedKeywords.length === 0 ||
        selectedKeywords.every((tag) => hero.tags.includes(tag));

      return matchesQuery && matchesClass && matchesKeywords;
    });

    list = [...list].sort((a, b) => {
      if (sort === "updated") {
        return +new Date(b.updatedAt) - +new Date(a.updatedAt);
      }
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [heroes, query, selectedClasses, selectedKeywords, sort]);

  function clearFilters() {
    setSelectedClasses([]);
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
        title="Class"
        options={classOptions}
        selected={selectedClasses}
        onToggle={(slug) => setSelectedClasses((prev) => toggleValue(prev, slug))}
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
          placeholder="Search by name, class, or keyword..."
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
            onClick={() => setSort("updated")}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm",
              sort === "updated"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary",
            )}
          >
            Updated
          </button>
          <p className="text-sm text-muted-foreground">
            {filtered.length} / {heroes.length}
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
              title="No heroes found"
              description="Try clearing filters or searching a different name."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((hero) => (
                <HeroCard key={hero.slug} hero={hero} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
