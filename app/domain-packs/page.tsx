"use client";

import { useState } from "react";
import Link from "next/link";
import { domainPacks } from "@/data/domainPacks";
import { LessonVocabulary } from "@/components/LessonVocabulary";
import { SentencePatternList } from "@/components/SentencePatternList";
import { SpeakButton } from "@/components/SpeakButton";
import { VisualCard } from "@/components/VisualCard";
import { TopicImage } from "@/components/TopicImage";
import { visualForPack } from "@/data/visuals";
import { upsertVocabAsFlashcards } from "@/lib/storage";

type SaveResult = { added: number; total: number };

export default function DomainPacksPage() {
  const [openId, setOpenId] = useState<string | null>(domainPacks[0]?.id || null);
  const [savedMap, setSavedMap] = useState<Record<string, SaveResult>>({});

  const handleSaveVocab = (packId: string) => {
    const pack = domainPacks.find((p) => p.id === packId);
    if (!pack) return;
    const { added, total } = upsertVocabAsFlashcards(pack.vocabulary, {
      tagPrefix: pack.id,
      sourceTag: `domain-${pack.id}`,
    });
    setSavedMap((m) => ({ ...m, [packId]: { added, total } }));
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-ink-900 text-white">
        <div className="px-6 py-section">
          <div className="label-uppercase text-on-dark-soft">Chủ đề</div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold leading-[1.05]">
            Gói học theo chủ đề
          </h1>
          <p className="mt-3 max-w-2xl text-base font-light text-on-dark-soft">
            5 gói học theo nhu cầu của Vân Trang: du lịch Trung Quốc, phim cổ trang, phim hiện
            đại, mạng xã hội Trung Quốc, đọc tin tức. Mỗi pack gồm từ vựng, mẫu câu, role-play
            và WeChat drills.
          </p>
        </div>
      </section>

      {/* Pack visual selector grid */}
      <section className="px-6 pt-section">
        <ul className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-hairline border border-hairline mb-10">
          {domainPacks.map((p) => {
            const active = openId === p.id;
            return (
              <li key={p.id} className="bg-canvas">
                <button
                  type="button"
                  onClick={() => setOpenId(p.id)}
                  className={`block w-full text-left transition ${
                    active ? "ring-2 ring-inset ring-ink-900" : "hover:bg-surface-soft"
                  }`}
                  aria-pressed={active}
                >
                  {p.visual ? (
                    <VisualCard spec={p.visual} aspect="16/9" />
                  ) : (
                    <div className="aspect-[16/9] bg-surface-card flex items-center justify-center">
                      <span className="text-4xl" aria-hidden="true">📁</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="zh text-base font-bold leading-tight">{p.titleZh}</div>
                    <div className="text-sm font-bold mt-1">{p.title}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="px-6 pb-section">
        {domainPacks
          .filter((p) => p.id === openId)
          .map((pack) => {
            const saved = savedMap[pack.id];
            return (
              <div key={pack.id} className="space-y-10">
                <header className="border border-hairline bg-canvas overflow-hidden">
                  {/* Photo-style topic header if available; else the CSS scene. */}
                  {visualForPack(pack.id) ? (
                    <TopicImage visual={visualForPack(pack.id)} heightClass="h-40 sm:h-48" />
                  ) : pack.visual ? (
                    <VisualCard spec={pack.visual} aspect="16/9" />
                  ) : null}
                  <div className="p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="zh text-3xl font-bold flex-1">{pack.titleZh}</div>
                      <SpeakButton text={pack.titleZh} size="md" />
                    </div>
                    <div className="text-xl font-bold">{pack.title}</div>
                    <p className="text-sm font-light text-body">{pack.description}</p>
                    <div className="pt-4 border-t border-hairline flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSaveVocab(pack.id)}
                        className={saved ? "btn-secondary" : "btn-primary"}
                      >
                        {saved
                          ? `✓ LƯU LẠI ${pack.vocabulary.length} TỪ`
                          : `LƯU ${pack.vocabulary.length} TỪ VÀO FLASHCARDS`}
                      </button>
                      <span className="text-xs font-light text-muted">
                        {pack.vocabulary.length} từ · {pack.sentencePatterns.length} mẫu câu ·{" "}
                        {pack.roleplayScenarios.length} scenarios
                        {pack.wechatDrills && pack.wechatDrills.length > 0
                          ? ` · ${pack.wechatDrills.length} WeChat drills`
                          : ""}
                      </span>
                    </div>
                    {saved ? (
                      saved.added === 0 ? (
                        <div className="mt-1 bg-surface-soft border border-hairline px-4 py-3 text-sm font-light text-muted">
                          Tất cả {pack.vocabulary.length} từ trong pack đã có sẵn trong Flashcards.
                        </div>
                      ) : (
                        <div className="mt-1 bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-light text-emerald-800">
                          ✓ Đã lưu {saved.added} thẻ mới vào Flashcards (tổng {saved.total} thẻ).
                        </div>
                      )
                    ) : null}
                  </div>
                </header>

                <div>
                  <h2 className="label-uppercase text-muted mb-3">Từ vựng</h2>
                  <LessonVocabulary items={pack.vocabulary} />
                </div>

                <div>
                  <h2 className="label-uppercase text-muted mb-3">Mẫu câu</h2>
                  <SentencePatternList items={pack.sentencePatterns} />
                </div>

                <div>
                  <h2 className="label-uppercase text-muted mb-3">Role-play scenarios</h2>
                  <ul className="space-y-px bg-hairline border border-hairline">
                    {pack.roleplayScenarios.map((s) => (
                      <li key={s.id} className="bg-canvas p-5">
                        <div className="flex items-start gap-3">
                          <div className="zh text-lg font-bold flex-1">{s.titleZh}</div>
                          <SpeakButton text={s.titleZh} size="sm" />
                        </div>
                        <div className="text-base font-bold mt-1">{s.titleVi}</div>
                        <p className="text-sm font-light text-body mt-2">{s.contextVi}</p>
                        <div className="text-xs font-light text-muted mt-2 tracking-[0.3px]">
                          AI: {s.aiRole} • You: {s.userRole}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {s.targetPhrases.map((p) => (
                            <span key={p} className="chip">
                              <span className="zh">{p}</span>
                            </span>
                          ))}
                        </div>
                        <div className="mt-4">
                          <Link
                            href={`/roleplay?scenario=${s.id}`}
                            className="btn-primary inline-flex"
                          >
                            BẮT ĐẦU
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
      </section>
    </>
  );
}
