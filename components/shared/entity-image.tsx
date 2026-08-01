import Image from "next/image";
import { cn } from "@/lib/utils";

const PLACEHOLDER = "/brand/logo-mark.svg";

export function EntityImage({
  src,
  alt,
  className,
  size = 64,
  width,
  height,
  fit = "contain",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  size?: number;
  width?: number;
  height?: number;
  fit?: "contain" | "cover";
}) {
  const safeSrc = src?.trim() ? src : PLACEHOLDER;
  const w = width ?? size;
  const h = height ?? size;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-border bg-surface-elevated",
        className,
      )}
      style={{ width: w, height: h }}
    >
      <Image
        src={safeSrc}
        alt={alt}
        fill
        unoptimized={safeSrc.endsWith(".svg")}
        className={fit === "cover" ? "object-cover" : "object-contain p-1"}
        sizes={`${w}px`}
      />
    </div>
  );
}
