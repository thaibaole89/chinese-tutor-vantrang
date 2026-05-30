import type { TopicVisual } from "@/data/visuals";

interface Props {
  visual: TopicVisual | null;
  /** Tailwind height class for the wrapper (e.g. "h-32"). */
  heightClass?: string;
  className?: string;
  /** Eager-load the first hero (above-the-fold). Default lazy. */
  priority?: boolean;
}

/**
 * Lightweight topic illustration. Plain <img> serving a pre-optimized,
 * pre-sized 768×512 webp straight from /public — no Next image-optimization
 * round-trip, so it stays free + fast. Explicit width/height + an aspect
 * box prevent layout shift; object-cover keeps it tidy at any height.
 *
 * Renders nothing when no visual is provided, so callers can drop it in
 * unconditionally without breaking layout on topics without an image.
 */
export function TopicImage({ visual, heightClass = "h-32", className = "", priority = false }: Props) {
  if (!visual) return null;
  return (
    <div className={`relative w-full overflow-hidden bg-surface-soft ${heightClass} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={visual.src}
        alt={visual.alt}
        width={768}
        height={512}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
