import Link from "next/link";
import type { GameAbility } from "@/types";
import { EntityImage } from "@/components/shared/entity-image";
import { Badge } from "@/components/ui/badge";

export function AbilityRow({ ability }: { ability: GameAbility }) {
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
      </div>
    </div>
  );
}

export function AbilityList({ abilities }: { abilities: GameAbility[] }) {
  if (abilities.length === 0) return null;
  return (
    <ul className="grid gap-3">
      {abilities.map((ability) => (
        <li key={`${ability.kind}-${ability.id}`}>
          <AbilityRow ability={ability} />
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
