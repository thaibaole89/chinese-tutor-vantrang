import Image from "next/image";
import type { VisualLearningPurpose, VisualSpec } from "@/lib/types";
import { LearningIllustration } from "./LearningIllustration";

interface Props {
  spec: VisualSpec;
  /** Compact = used on cards; full = used on lesson detail. */
  density?: "compact" | "full";
  className?: string;
}

/** Same named-gradient set as VisualCard, kept local so this component
 *  can render standalone without forcing import of VisualCard. */
const GRADIENT: Record<string, string> = {
  cool: "bg-gradient-to-br from-slate-100 via-sky-50 to-white",
  warm: "bg-gradient-to-br from-amber-50 via-orange-50 to-white",
  mono: "bg-gradient-to-br from-ink-100 to-white",
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

const PURPOSE_LABEL: Record<VisualLearningPurpose, string> = {
  context: "Ngữ cảnh sử dụng",
  memory: "Ghi nhớ",
  register: "So sánh văn phong",
  dialogue: "Tình huống thoại",
};

const PURPOSE_TONE: Record<VisualLearningPurpose, string> = {
  context: "bg-sky-50 text-sky-800 border-sky-200",
  memory: "bg-amber-50 text-amber-900 border-amber-200",
  register: "bg-rose-50 text-rose-800 border-rose-200",
  dialogue: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

export function LearningVisual({ spec, density = "full", className = "" }: Props) {
  const gradient = GRADIENT[spec.gradient || "mono"] || GRADIENT.mono;
  const purpose = spec.learningPurpose;
  const heroEmojiSize = density === "compact" ? "text-6xl" : "text-7xl sm:text-8xl";
  const heroAspect = density === "compact" ? "aspect-[16/9]" : "aspect-[16/9] sm:aspect-[21/9]";

  return (
    <figure
      className={`bg-canvas border border-hairline overflow-hidden ${className}`}
      aria-label={spec.altVi}
    >
      {/* Hero band — emoji cluster + key-object chips overlay */}
      <div
        className={`relative ${heroAspect} ${gradient} flex flex-col items-center justify-center px-6`}
        role="img"
        aria-label={spec.altVi}
        data-illustration-prompt={spec.illustrationPrompt || undefined}
      >
        {spec.imageSrc ? (
          // 1) Best — actual local image, when commissioned later.
          <Image
            src={spec.imageSrc}
            alt={spec.altVi}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : spec.sceneType ? (
          // 2) Premium — hand-composed CSS/SVG scene from LearningIllustration.
          <LearningIllustration
            scene={spec.sceneType}
            altVi={spec.altVi}
            labels={spec.keyObjects?.slice(0, 4)}
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          // 3) Fallback — emoji + key-object chips on gradient.
          <>
            {spec.emoji ? (
              <span
                aria-hidden="true"
                className={`${heroEmojiSize} leading-none drop-shadow-sm select-none`}
              >
                {spec.emoji}
              </span>
            ) : null}
            {spec.keyObjects && spec.keyObjects.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5 justify-center max-w-[90%]">
                {spec.keyObjects.slice(0, 6).map((obj) => (
                  <span
                    key={obj}
                    className="inline-flex items-center bg-white/85 text-ink-900 text-[11px] font-medium tracking-[0.3px] px-2 py-0.5 border border-ink-100 backdrop-blur-sm"
                  >
                    {obj}
                  </span>
                ))}
              </div>
            ) : null}
          </>
        )}

        {/* Purpose tag, top-left */}
        {purpose ? (
          <span
            className={`absolute top-3 left-3 inline-flex items-center text-[10px] font-bold uppercase tracking-[1.2px] border px-2 py-1 ${PURPOSE_TONE[purpose]}`}
          >
            {PURPOSE_LABEL[purpose]}
          </span>
        ) : null}

        {/* Caption strip, bottom */}
        {spec.captionVi ? (
          <figcaption className="absolute bottom-0 inset-x-0 bg-white/80 text-ink-900 text-xs font-medium tracking-[0.3px] px-3 py-2 backdrop-blur-sm">
            {spec.captionVi}
          </figcaption>
        ) : null}
      </div>

      {/* Body — only render when there's actual learning metadata. */}
      {density === "full" && (spec.sceneDescriptionVi || spec.visualQuestionVi) ? (
        <div className="p-5 sm:p-6 space-y-3 bg-canvas">
          {spec.sceneDescriptionVi ? (
            <p className="text-sm font-light text-body leading-relaxed">
              <span className="label-uppercase text-muted mr-2">Cảnh</span>
              {spec.sceneDescriptionVi}
            </p>
          ) : null}
          {spec.visualQuestionVi ? (
            <div className="border-t border-hairline pt-3">
              <span className="label-uppercase text-bmw-blue">Câu hỏi quan sát</span>
              <p className="mt-1 text-base font-bold text-ink-900">
                ❓ {spec.visualQuestionVi}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </figure>
  );
}
