import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  /** Use full wordmark from branding.logo instead of mark + text */
  wordmark?: boolean;
  showText?: boolean;
};

export function SiteLogo({
  className,
  wordmark = false,
  showText = siteConfig.logo.showText,
}: SiteLogoProps) {
  const useMark = !wordmark && showText;
  const src = wordmark ? siteConfig.branding.logo : siteConfig.branding.logoMark;
  const size = useMark ? siteConfig.logo.markSize : siteConfig.logo.height;

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 transition-opacity hover:opacity-90",
        className,
      )}
      aria-label={`${siteConfig.name} home`}
    >
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        unoptimized
        priority
        className="shrink-0"
        style={wordmark ? { width: siteConfig.logo.width, height: "auto" } : undefined}
      />
      {useMark ? (
        <span className="font-display text-lg font-bold tracking-wide text-primary">
          {siteConfig.shortName}
        </span>
      ) : null}
    </Link>
  );
}
