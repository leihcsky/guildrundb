import { cn } from "@/lib/utils";

/**
 * Multi-paragraph intro for list/hub pages. Keeps the first screen from
 * reading as a pure card wall (AdSense / quality sampling).
 */
export function HubIntro({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base",
        "[&_a]:font-medium [&_a]:text-foreground [&_a]:underline-offset-4 hover:[&_a]:underline",
        "[&_em]:text-foreground/90",
        className,
      )}
    >
      {children}
    </div>
  );
}
