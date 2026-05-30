"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Flashcard } from "@/components/Flashcard";
import { buildSeedFlashcards } from "@/data/seedFlashcards";
import { domainPacks } from "@/data/domainPacks";
import {
  getFlashcards,
  updateFlashcardStatus,
  upsertFlashcards,
  upsertVocabAsFlashcards,
} from "@/lib/storage";
import type { FlashcardState, ReviewStatus } from "@/lib/types";

const FILTERS: Array<{ value: "all" | ReviewStatus; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "new", label: "Mới" },
  { value: "learning", label: "Đang học" },
  { value: "familiar", label: "Quen" },
  { value: "mastered", label: "Thuộc" },
];

export default function FlashcardsPage() {
  const [cards, setCards] = useState<FlashcardState[]>([]);
  const [filter, setFilter] = useState<"all" | ReviewStatus>("all");
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [imageFirst, setImageFirst] = useState(false);

  // Phase 1.7: do NOT auto-seed — empty state lets user choose.
  useEffect(() => {
    setCards(getFlashcards());
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? cards : cards.filter((c) => c.reviewStatus === filter)),
    [cards, filter],
  );

  useEffect(() => {
    setIdx(0);
  }, [filter]);

  const current = filtered[idx];

  const setStatus = (status: ReviewStatus) => {
    if (!current) return;
    const updated = updateFlashcardStatus(current.id, status);
    setCards(updated);
    if (idx + 1 < filtered.length) setIdx(idx + 1);
  };

  const seedWeek1 = () => {
    const merged = upsertFlashcards(buildSeedFlashcards());
    const added = merged.length - cards.length;
    setCards(merged);
    setFeedback(
      added > 0
        ? `✓ Đã lưu ${added} thẻ. (Tổng ${merged.length} thẻ.)`
        : "Tất cả thẻ tuần 1 đã có trong Flashcards.",
    );
  };

  const seedFromPack = (packId: string) => {
    const pack = domainPacks.find((p) => p.id === packId);
    if (!pack) return;
    const { added, total, cards: updated } = upsertVocabAsFlashcards(pack.vocabulary, {
      tagPrefix: pack.id,
      sourceTag: `domain-${pack.id}`,
    });
    setCards(updated);
    setFeedback(
      added > 0
        ? `✓ Đã lưu ${added} thẻ từ "${pack.title}". (Tổng ${total} thẻ.)`
        : `Tất cả thẻ "${pack.title}" đã có trong Flashcards.`,
    );
  };

  const counts = useMemo(() => {
    const map: Record<ReviewStatus, number> = { new: 0, learning: 0, familiar: 0, mastered: 0 };
    for (const c of cards) map[c.reviewStatus] += 1;
    return map;
  }, [cards]);

  const isAbsoluteEmpty = cards.length === 0;

  return (
    <section className="px-6 py-section">
      <header className="mb-8">
        <div className="label-uppercase text-muted">Flashcards</div>
        <h1 className="text-4xl font-bold mt-2">Ôn từ vựng</h1>
        <p className="text-sm font-light text-muted mt-2">
          Tổng {cards.length} thẻ • Thuộc {counts.mastered} • Đang học {counts.learning} • Mới{" "}
          {counts.new}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-xs font-normal text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={imageFirst}
              onChange={(e) => setImageFirst(e.target.checked)}
            />
            <span className="label-uppercase">
              {imageFirst ? "Image-first ON" : "Image-first OFF"}
            </span>
          </label>
          <span className="text-[11px] font-light text-muted">
            (Ẩn nghĩa tiếng Việt cho đến khi bấm "Hiện nghĩa")
          </span>
        </div>
      </header>

      {feedback ? (
        <div
          className="mb-6 border border-emerald-200 bg-emerald-50 text-emerald-800 px-4 py-3 text-sm font-light"
          role="status"
        >
          {feedback}
        </div>
      ) : null}

      {/*
        Empty-state CTA. Shown when either:
        - the whole flashcard store is empty, OR
        - the user landed via a stale client that cleared but never re-seeded.
        Belt-and-braces: also render under "Không có thẻ trong bộ lọc này" so
        the seed buttons are reachable from any browser state.
      */}
      {isAbsoluteEmpty ? (
        <EmptyStateCTA
          onSeedWeek1={seedWeek1}
          onSeedTravel={() => seedFromPack("pack-travel")}
          onSeedDramaModern={() => seedFromPack("pack-drama-modern")}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-0 border-b border-hairline mb-8">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`mr-6 ${
                  filter === f.value ? "category-tab category-tab-active" : "category-tab"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="space-y-6">
              <div className="border border-hairline bg-canvas p-8 text-center text-sm font-light text-muted">
                Không có thẻ nào trong bộ lọc <strong>{filter}</strong>. Thử filter khác, hoặc
                nạp thêm vocab dưới đây.
              </div>
              <EmptyStateCTA
                onSeedWeek1={seedWeek1}
                onSeedTravel={() => seedFromPack("pack-travel")}
                onSeedDramaModern={() => seedFromPack("pack-drama-modern")}
              />
            </div>
          ) : current ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="label-uppercase text-muted">
                  {idx + 1} / {filtered.length}
                </span>
              </div>
              <Flashcard card={current} onSetStatus={setStatus} imageFirst={imageFirst} />
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setIdx(Math.max(0, idx - 1))}
                  className="btn-secondary"
                  disabled={idx === 0}
                >
                  ← TRƯỚC
                </button>
                <button
                  type="button"
                  onClick={() => setIdx(Math.min(filtered.length - 1, idx + 1))}
                  className="btn-primary"
                  disabled={idx + 1 >= filtered.length}
                >
                  TIẾP →
                </button>
              </div>
            </>
          ) : null}
        </>
      )}
    </section>
  );
}

function EmptyStateCTA({
  onSeedWeek1,
  onSeedTravel,
  onSeedDramaModern,
}: {
  onSeedWeek1: () => void;
  onSeedTravel: () => void;
  onSeedDramaModern?: () => void;
}) {
  return (
    <div className="border border-hairline bg-canvas p-8 sm:p-10 space-y-4">
      <div className="label-uppercase text-bmw-blue">Bắt đầu</div>
      <h2 className="text-2xl font-bold leading-snug">Bạn chưa có thẻ nào trong Flashcards.</h2>
      <p className="text-sm font-light text-body max-w-prose">
        Nạp một bộ thẻ mẫu để bắt đầu luyện. Bạn có thể thêm vocab từ Real Feed, các Chủ đề
        (du lịch, ăn uống, mua sắm, phim cổ trang & hiện đại, mạng xã hội) bất kỳ lúc nào.
      </p>
      <div className="pt-3 flex flex-wrap gap-3">
        <button type="button" onClick={onSeedWeek1} className="btn-primary">
          NẠP FLASHCARDS MẪU TUẦN 1
        </button>
        <button type="button" onClick={onSeedTravel} className="btn-secondary">
          NẠP TỪ DU LỊCH ✈️
        </button>
        {onSeedDramaModern ? (
          <button type="button" onClick={onSeedDramaModern} className="btn-secondary">
            NẠP TỪ PHIM HIỆN ĐẠI 💕
          </button>
        ) : null}
        <Link href="/real-feed" className="btn-text-link">
          MỞ KHÁM PHÁ
        </Link>
      </div>
    </div>
  );
}
