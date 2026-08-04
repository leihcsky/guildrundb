import Link from "next/link";
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button";
import { siteConfig } from "@/config/site.config";
import { SiteLogo } from "@/components/brand/site-logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 sm:col-span-2 lg:col-span-2">
          <SiteLogo />
          <p className="max-w-md text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
          <p className="text-xs text-muted-foreground">
            Data coverage: {siteConfig.gameVersion}
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Explore</p>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            {siteConfig.footer.explore.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Legal</p>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            {siteConfig.footer.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <CookieSettingsButton className="text-left transition-colors hover:text-foreground" />
          </nav>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Unofficial fan site — not affiliated with
            Leyline or {siteConfig.game}.
          </p>
          <p>
            <Link href="/copyright" className="hover:text-foreground">
              Trademark & copyright notice
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
