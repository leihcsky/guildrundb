import Link from "next/link";
import { cn } from "@/lib/utils";

export function LegalProse({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-8 text-muted-foreground [&_a]:text-primary [&_a]:hover:underline [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:mt-1 [&_p]:leading-relaxed [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function LegalNav({ current }: { current: string }) {
  const links = [
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Copyright", href: "/copyright" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="mb-8 flex flex-wrap gap-2 text-sm">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-md border border-border px-3 py-1.5 transition-colors hover:bg-accent",
            current === link.href
              ? "border-primary/40 bg-accent text-foreground"
              : "text-muted-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
