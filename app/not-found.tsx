import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Not Found",
  description: "The page you requested could not be found.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="font-display text-4xl font-bold">404</h1>
      <p className="mt-3 text-muted-foreground">This page does not exist.</p>
    </div>
  );
}
