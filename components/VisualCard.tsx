import Image from "next/image";
import type { VisualSpec } from "@/lib/types";

interface Props {
  spec: VisualSpec;
  aspect?: "16/9" | "4/3" | "1/1";
  rounded?: boolean;
  className?: string;
}

/**
 * Named gradients used across the app. Hand-tuned soft palettes —
 * never garish. Keep additions here, not inline in pages.
 */
const GRADIENT: Record<string, string> = {
  // Generic light
  cool: "bg-gradient-to-br from-slate-100 via-sky-50 to-white",
  warm: "bg-gradient-to-br from-amber-50 via-orange-50 to-white",
  mono: "bg-gradient-to-br from-ink-100 to-white",
  // Brand / semantic
  business: "bg-gradient-to-br from-slate-100 via-blue-50 to-white",
  fintech_dark: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white",
  airport: "bg-gradient-to-br from-sky-100 via-cyan-50 to-white",
  hospitality: "bg-gradient-to-br from-amber-100 via-orange-50 to-white",
  tech: "bg-gradient-to-br from-indigo-100 via-violet-50 to-white",
  wechat: "bg-gradient-to-br from-emerald-100 via-green-50 to-white",
  crypto: "bg-gradient-to-br from-slate-100 via-violet-50 to-white",
  news: "bg-gradient-to-br from-stone-100 via-amber-50 to-white",
  music: "bg-gradient-to-br from-purple-100 via-fuchsia-50 to-white",
  social: "bg-gradient-to-br from-rose-100 via-pink-50 to-white",
};

function gradientClass(name?: string): string {
  if (!name) return GRADIENT.mono;
  return GRADIENT[name] || GRADIENT.mono;
}

const ASPECT: Record<NonNullable<Props["aspect"]>, string> = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

export function VisualCard({ spec, aspect = "16/9", rounded = true, className = "" }: Props) {
  const base = `${ASPECT[aspect]} relative overflow-hidden flex items-center justify-center ${
    rounded ? "" : ""
  } ${className}`;

  // Local image — render with alt and fill behaviour.
  if (spec.type === "local_image" && spec.imageSrc) {
    return (
      <div className={base} role="img" aria-label={spec.altVi}>
        <Image
          src={spec.imageSrc}
          alt={spec.altVi}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {spec.captionVi ? (
          <figcaption className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-xs font-light px-3 py-2 backdrop-blur-sm">
            {spec.captionVi}
          </figcaption>
        ) : null}
      </div>
    );
  }

  // Emoji / illustration_prompt / gradient_card — all render as gradient + optional emoji.
  // illustrationPrompt is hidden in data-* for future swap to imageSrc.
  return (
    <div
      className={`${base} ${gradientClass(spec.gradient)}`}
      role="img"
      aria-label={spec.altVi}
      data-illustration-prompt={spec.illustrationPrompt || undefined}
    >
      {spec.emoji ? (
        <span
          aria-hidden="true"
          className="text-7xl sm:text-8xl drop-shadow-sm select-none leading-none"
        >
          {spec.emoji}
        </span>
      ) : null}
      {spec.captionVi ? (
        <figcaption className="absolute bottom-0 inset-x-0 bg-white/60 text-ink-900 text-[11px] font-medium tracking-[0.3px] px-3 py-2 backdrop-blur-sm">
          {spec.captionVi}
        </figcaption>
      ) : null}
    </div>
  );
}
