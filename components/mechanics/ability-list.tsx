import Link from "next/link";
import type { GameAbility } from "@/types";
import { EntityImage } from "@/components/shared/entity-image";
import { Badge } from "@/components/ui/badge";

export function AbilityRow({
  ability,
  note,
}: {
  ability: GameAbility;
  note?: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-card p-4">
      <EntityImage src={ability.image} alt={ability.name} size={48} />
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">{ability.name}</h3>
          <Badge variant="outline" className="capitalize">
            {ability.kind}
          </Badge>
        </div>
        <p className="whitespace-pre-line text-sm text-muted-foreground">
          {ability.description || "Description pending."}
        </p>
        {note ? (
          <p className="border-t border-border/70 pt-2 text-sm text-foreground/90">
            <span className="font-medium">In practice: </span>
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function AbilityList({
  abilities,
  notes,
}: {
  abilities: GameAbility[];
  notes?: Record<string, string>;
}) {
  if (abilities.length === 0) return null;
  return (
    <ul className="grid gap-3">
      {abilities.map((ability) => (
        <li key={`${ability.kind}-${ability.id}`}>
          <AbilityRow ability={ability} note={notes?.[ability.name]} />
        </li>
      ))}
    </ul>
  );
}

export function AbilityListFooterLink() {
  return (
    <p className="text-sm text-muted-foreground">
      Ability ownership per hero lands in a later data pass.{" "}
      <Link href="/keywords" className="text-primary hover:underline">
        Browse keywords
      </Link>{" "}
      to explore related effects.
    </p>
  );
}
