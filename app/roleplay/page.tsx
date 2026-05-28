"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RoleplayChat } from "@/components/RoleplayChat";
import { findScenario, getAllRoleplayScenarios } from "@/data/roleplayScenarios";

export default function RoleplayPage() {
  return (
    <Suspense
      fallback={
        <section className="px-6 py-section text-sm font-light text-muted">Đang tải...</section>
      }
    >
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
          Chưa có scenario nào.{" "}
          <Link href="/" className="btn-text-link">
            VỀ DASHBOARD
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="px-6 py-section">
      <header className="mb-8">
        <div className="label-uppercase text-muted">Role-play</div>
        <h1 className="text-4xl font-bold mt-2">Luyện nói qua tình huống</h1>
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
