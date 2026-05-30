"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RoleplayChat } from "@/components/RoleplayChat";
import { TopicImage } from "@/components/TopicImage";
import { topicVisuals } from "@/data/visuals";
import { findScenario, getAllRoleplayScenarios } from "@/data/roleplayScenarios";

const STARTER_SCENARIOS = [
  { emoji: "🏨", label: "Nhận phòng khách sạn", visual: topicVisuals.hotel },
  { emoji: "🍜", label: "Gọi món nhà hàng", visual: topicVisuals.restaurant },
  { emoji: "🧭", label: "Hỏi đường", visual: topicVisuals.metro },
  { emoji: "🛍️", label: "Mua sắm", visual: topicVisuals.shopping },
  { emoji: "🆘", label: "Khẩn cấp", visual: topicVisuals.emergency },
];

/** Static, instantly-rendered fallback shown while the interactive
 *  scenario picker hydrates. No spinner — Vân Trang sees the title,
 *  a short intro, and the scenario cards right away. */
function RoleplayFallback() {
  return (
    <section className="px-6 py-section">
      <header className="mb-8">
        <div className="label-uppercase text-muted">Hội thoại</div>
        <h1 className="text-4xl font-bold mt-2">Luyện hội thoại</h1>
        <p className="text-sm font-light text-muted mt-2 max-w-prose">
          Chọn một tình huống đời thường, rồi tập nói/nhắn tin bằng tiếng Trung. AI sẽ đóng vai
          và sửa câu cho bạn.
        </p>
      </header>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-hairline border border-hairline">
        {STARTER_SCENARIOS.map((s) => (
          <li key={s.label} className="bg-canvas overflow-hidden">
            <TopicImage visual={s.visual} heightClass="h-24" />
            <div className="p-4 flex items-center gap-2">
              <span className="text-lg leading-none" aria-hidden="true">
                {s.emoji}
              </span>
              <span className="text-[13px] font-bold tracking-[0.3px]">{s.label}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs font-light text-muted">Đang chuẩn bị tình huống…</p>
    </section>
  );
}

export default function RoleplayPage() {
  return (
    <Suspense fallback={<RoleplayFallback />}>
      <RoleplayInner />
    </Suspense>
  );
}

function RoleplayInner() {
  const search = useSearchParams();
  const initialId = search?.get("scenario") || "";
  const all = getAllRoleplayScenarios();
  const [scenarioId, setScenarioId] = useState<string>(initialId || all[0]?.id || "");
  const scenario = findScenario(scenarioId) || all[0];

  if (!scenario) {
    return (
      <section className="px-6 py-section text-center">
        <p className="text-base font-light text-muted">
          Chưa có tình huống nào.{" "}
          <Link href="/" className="btn-text-link">
            VỀ TRANG CHỦ
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="px-6 py-section">
      <header className="mb-8">
        <div className="label-uppercase text-muted">Hội thoại</div>
        <h1 className="text-4xl font-bold mt-2">Luyện hội thoại</h1>
      </header>

      <div className="border border-hairline bg-canvas p-4 mb-8">
        <label htmlFor="scenario-select" className="label-uppercase text-muted block mb-2">
          Chọn tình huống
        </label>
        <select
          id="scenario-select"
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
          className="text-input"
        >
          {all.map((s) => (
            <option key={s.id} value={s.id}>
              [{s.difficulty}] {s.titleVi}
            </option>
          ))}
        </select>
      </div>

      <RoleplayChat key={scenario.id} scenario={scenario} />
    </section>
  );
}
