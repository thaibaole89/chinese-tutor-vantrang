"use client";

import { useState } from "react";
import Link from "next/link";
import type { RealFeedItem, ZhTriplet } from "@/lib/types";
import { SpeakButton } from "./SpeakButton";
import { LessonVocabulary } from "./LessonVocabulary";
import { SentencePatternList } from "./SentencePatternList";
import { LearningVisual } from "./LearningVisual";
import { upsertVocabAsFlashcards } from "@/lib/storage";
import { usePinyinPreference } from "@/lib/pinyinPreference";

interface Props {
  item: RealFeedItem;
}

type SaveState =
  | { kind: "idle" }
  | { kind: "saved"; added: number; total: number };

export function RealFeedLesson({ item }: Props) {
  const { showPinyin, setShowPinyin } = usePinyinPreference();
  const [showVi, setShowVi] = useState(true);
  const [save, setSave] = useState<SaveState>({ kind: "idle" });

  const handleSaveVocab = () => {
    const { added, total } = upsertVocabAsFlashcards(item.keyVocabulary, {
      tagPrefix: item.id,
      sourceTag: `real-feed-${item.sourceType}`,
    });
    setSave({ kind: "saved", added, total });
  };

  const isSlang =
    item.sourceType === "social" || item.topicTags.includes("slang");

  return (
    <div className="bg-surface-soft border-t border-hairline px-6 py-8 space-y-8">
      {/* 0. Learning visual — scene + question */}
      <div>
        <span className="label-uppercase text-muted block mb-3">Hình học tập</span>
        <LearningVisual spec={item.visual} density="full" />
      </div>

      {/* 0b. "Nhìn hình, nhớ câu" — annotated practice */}
      {item.annotatedPractice ? (
        <div>
          <span className="label-uppercase text-muted block mb-3">Nhìn hình, nhớ câu</span>
          <div className="bg-amber-50/60 border border-amber-200 p-5 space-y-3">
            <div className="flex flex-wrap gap-2">
              {item.annotatedPractice.keyChips.map((c) => (
                <span
                  key={c}
                  className="zh inline-flex items-center bg-white text-ink-900 text-sm font-bold border border-amber-300 px-2.5 py-1 shadow-sm"
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="flex items-start gap-3 pt-2 border-t border-amber-200">
              <div className="flex-1">
                <div className="zh text-lg font-bold leading-snug">
                  {item.annotatedPractice.sentence.zh}
                </div>
                {showPinyin ? (
                  <div className="text-xs font-normal text-muted mt-1 tracking-[0.3px]">
                    {item.annotatedPractice.sentence.pinyin}
                  </div>
                ) : null}
                <div className="text-sm font-light text-body mt-1">
                  {item.annotatedPractice.sentence.vi}
                </div>
              </div>
              <SpeakButton text={item.annotatedPractice.sentence.zh} size="sm" />
            </div>
          </div>
        </div>
      ) : null}

      {/* 1. Original text + pinyin/vi toggle */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="label-uppercase text-muted">Nội dung gốc</span>
          <div className="flex gap-5 text-xs font-normal text-muted">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPinyin}
                onChange={(e) => setShowPinyin(e.target.checked)}
              />
              Pinyin
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showVi}
                onChange={(e) => setShowVi(e.target.checked)}
              />
              Tiếng Việt
            </label>
          </div>
        </div>

        <div className="bg-canvas border border-hairline p-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="zh text-lg sm:text-xl font-bold flex-1 whitespace-pre-line leading-relaxed">
              {item.originalZh}
            </div>
            <SpeakButton text={item.originalZh.replace(/\n/g, "，")} size="md" rate={0.85} />
          </div>
          {showPinyin ? (
            <div className="text-sm font-normal text-muted whitespace-pre-line tracking-[0.3px]">
              {item.pinyin}
            </div>
          ) : null}
          {showVi ? (
            <div className="text-sm font-light text-body whitespace-pre-line border-t border-hairline pt-3">
              {item.translationVi}
            </div>
          ) : null}
        </div>
      </div>

      {/* 2. Spoken / lịch sự versions side-by-side */}
      <div>
        <span className="label-uppercase text-muted block mb-3">
          Cách nói khác nhau theo ngữ cảnh
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-hairline border border-hairline">
          <RegisterCard
            tone="spoken"
            label="Văn nói thân mật"
            badge="Thân mật"
            triplet={item.spokenVersion}
          />
          <RegisterCard
            tone="business"
            label="Văn lịch sự"
            badge="Lịch sự"
            triplet={item.businessSafeVersion}
          />
        </div>
      </div>

      {/* 3a. Slang comparison table — only for social/slang items */}
      {isSlang ? (
        <div>
          <span className="label-uppercase text-muted block mb-3">
            Bảng so sánh — chọn theo đối tượng
          </span>
          <div className="border border-hairline bg-canvas overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-hairline">
              <div className="p-5 bg-rose-50/40">
                <div className="label-uppercase text-rose-700 mb-2">Thân mật / tiếng lóng</div>
                <div className="zh text-lg font-bold leading-snug">{item.originalZh.split("\n")[0]}</div>
              </div>
              <div className="p-5 bg-sky-50/40">
                <div className="label-uppercase text-sky-700 mb-2">Lịch sự</div>
                <div className="zh text-lg font-bold leading-snug">{item.businessSafeVersion.zh}</div>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-soft border-t border-hairline text-xs font-light text-body">
              <span className="label-uppercase text-red-700 mr-2">Không dùng</span>
              tin nhắn cho người lạ lớn tuổi · tình huống trang trọng · viết caption công khai cho thương hiệu
            </div>
          </div>
        </div>
      ) : null}

      {/* 3. When-to-use / when-NOT-to-use callouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-hairline border border-hairline">
        <div className="bg-canvas p-5 border-l-4 border-l-emerald-500">
          <div className="label-uppercase text-emerald-700">✓ Khi nên dùng</div>
          <p className="text-sm font-light text-body mt-2">{item.whenToUseVi}</p>
        </div>
        <div className="bg-canvas p-5 border-l-4 border-l-red-500">
          <div className="label-uppercase text-red-700">✗ Khi không nên dùng</div>
          <p className="text-sm font-light text-body mt-2">{item.whenNotToUseVi}</p>
        </div>
      </div>

      {/* 4. Usage notes */}
      <div>
        <span className="label-uppercase text-muted block mb-3">Ghi chú văn phong</span>
        <div className="bg-canvas border border-hairline p-4 text-sm font-light text-body">
          {item.usageNotesVi}
        </div>
      </div>

      {/* 5. Key vocabulary */}
      <div>
        <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
          <span className="label-uppercase text-muted">Từ vựng chính</span>
          <SaveButton save={save} totalAvailable={item.keyVocabulary.length} onSave={handleSaveVocab} />
        </div>
        <LessonVocabulary items={item.keyVocabulary} />
        {save.kind === "saved" ? <SaveMessage save={save} /> : null}
      </div>

      {/* 6. Sentence patterns */}
      <div>
        <span className="label-uppercase text-muted block mb-3">Mẫu câu</span>
        <SentencePatternList items={item.sentencePatterns} />
      </div>

      {/* 7. Speaking prompts */}
      {item.speakingPrompts && item.speakingPrompts.length ? (
        <div>
          <span className="label-uppercase text-muted block mb-3">Bài tập nói</span>
          <ul className="space-y-2">
            {item.speakingPrompts.map((p, i) => (
              <li
                key={i}
                className="bg-canvas border border-hairline px-4 py-3 text-sm font-light text-body"
              >
                🎙️ {p}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* 8. Discussion prompts */}
      <div>
        <span className="label-uppercase text-muted block mb-3">Câu hỏi thảo luận</span>
        <ul className="space-y-2">
          {item.discussionPrompts.map((q, i) => (
            <li
              key={i}
              className="bg-canvas border border-hairline px-4 py-3 text-sm font-light text-body"
            >
              {q}
            </li>
          ))}
        </ul>
      </div>

      {/* 9. Role-play CTA */}
      <div>
        <span className="label-uppercase text-muted block mb-3">Role-play</span>
        <div className="bg-canvas border border-hairline p-6">
          <div className="zh text-lg font-bold mb-1">{item.roleplayScenario.titleZh}</div>
          <div className="text-base font-bold mb-2">{item.roleplayScenario.titleVi}</div>
          <p className="text-sm font-light text-body mb-3">
            {item.roleplayScenario.contextVi}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.roleplayScenario.targetPhrases.map((p) => (
              <span key={p} className="chip">
                <span className="zh">{p}</span>
              </span>
            ))}
          </div>
          <Link
            href={`/roleplay?scenario=${item.roleplayScenario.id}`}
            className="btn-primary inline-flex"
          >
            BẮT ĐẦU ROLE-PLAY
          </Link>
        </div>
      </div>
    </div>
  );
}

// -------- Sub-components --------

function RegisterCard({
  tone,
  label,
  badge,
  triplet,
}: {
  tone: "spoken" | "business";
  label: string;
  badge: string;
  triplet: ZhTriplet;
}) {
  const { showPinyin } = usePinyinPreference();
  const accent = tone === "spoken" ? "border-l-amber-500" : "border-l-bmw-blue";
  return (
    <div className={`bg-canvas p-5 border-l-4 ${accent}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div>
          <div className="label-uppercase text-muted">{label}</div>
          <div className="text-[11px] font-normal text-muted mt-0.5 tracking-[0.3px]">{badge}</div>
        </div>
        <SpeakButton text={triplet.zh} size="sm" />
      </div>
      <div className="zh text-lg font-bold mt-1 leading-snug">{triplet.zh}</div>
      {showPinyin ? (
        <div className="text-xs font-normal text-muted mt-1 tracking-[0.3px]">{triplet.pinyin}</div>
      ) : null}
      <div className="text-sm font-light text-body mt-1">{triplet.vi}</div>
    </div>
  );
}

function SaveButton({
  save,
  totalAvailable,
  onSave,
}: {
  save: SaveState;
  totalAvailable: number;
  onSave: () => void;
}) {
  if (save.kind === "saved") {
    return (
      <button type="button" onClick={onSave} className="btn-secondary">
        ✓ LƯU LẠI {totalAvailable} TỪ
      </button>
    );
  }
  return (
    <button type="button" onClick={onSave} className="btn-primary">
      LƯU VÀO FLASHCARDS
    </button>
  );
}

function SaveMessage({ save }: { save: { kind: "saved"; added: number; total: number } }) {
  if (save.added === 0) {
    return (
      <div className="mt-3 bg-surface-soft border border-hairline px-4 py-3 text-sm font-light text-muted">
        Tất cả từ ở đây đã có trong Flashcards của bạn.
      </div>
    );
  }
  return (
    <div className="mt-3 bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-light text-emerald-800">
      ✓ Đã lưu {save.added} thẻ mới vào Flashcards (tổng {save.total} thẻ).
    </div>
  );
}
