"use client";

import { useState } from "react";
import Image from "next/image";
import type { HeroRankArt } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function HeroRankGallery({
  heroName,
  ranks,
}: {
  heroName: string;
  ranks: HeroRankArt[];
}) {
  const available = ranks.filter((rank) => rank.hasImage);
  const initial = available[0]?.rank ?? ranks[0]?.rank ?? "C";
  const [active, setActive] = useState(initial);
  const current = ranks.find((rank) => rank.rank === active) ?? ranks[0];

  if (!current || available.length === 0) return null;

  return (
    <section id="ranks" className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="font-display text-2xl font-semibold">Ranks C → S</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Draft a duplicate or use an eligible campfire event to rank up. Art
          below shows each rank portrait for {heroName}.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {ranks.map((rank) => (
          <button
            key={rank.rank}
            type="button"
            disabled={!rank.hasImage}
            onClick={() => setActive(rank.rank)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              active === rank.rank
                ? "border-primary bg-primary text-primary-foreground"
                : rank.hasImage
                  ? "border-border bg-card hover:bg-accent"
                  : "cursor-not-allowed border-border/50 text-muted-foreground opacity-50",
            )}
          >
            {rank.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 rounded-xl border border-border bg-card p-4 sm:grid-cols-[minmax(0,280px)_1fr] sm:p-6">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-lg border border-border bg-surface-elevated">
          <Image
            src={current.image}
            alt={`${heroName} at ${current.label}`}
            fill
            className="object-contain"
            sizes="280px"
            unoptimized
          />
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl font-semibold">{current.label}</h3>
            <Badge variant="outline">{current.rank}</Badge>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {current.summary}
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">C</strong> — start with the
              active ability and base kit.
            </li>
            <li>
              <strong className="text-foreground">B</strong> — lock one of three
              specialization paths.
            </li>
            <li>
              <strong className="text-foreground">A / S</strong> — take the rank
              stat package, then draft class modifiers.
            </li>
          </ol>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ranks.map((rank) => (
          <button
            key={`thumb-${rank.rank}`}
            type="button"
            disabled={!rank.hasImage}
            onClick={() => setActive(rank.rank)}
            className={cn(
              "overflow-hidden rounded-lg border bg-surface-elevated text-left transition-colors",
              active === rank.rank
                ? "border-primary"
                : "border-border hover:border-primary/40",
              !rank.hasImage && "opacity-40",
            )}
          >
            <div className="relative aspect-[3/4] w-full">
              {rank.hasImage ? (
                <Image
                  src={rank.image}
                  alt=""
                  fill
                  className="object-contain p-1"
                  sizes="120px"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No art
                </div>
              )}
            </div>
            <p className="border-t border-border px-2 py-1.5 text-center text-xs font-medium">
              {rank.rank}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
