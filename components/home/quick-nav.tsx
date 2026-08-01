import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickNav() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {siteConfig.quickNav.map((item) => (
        <Link key={item.href} href={item.href} className="block">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{item.label}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </section>
  );
}
