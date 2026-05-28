"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, saveProfile } from "@/lib/storage";
import {
  DEFAULT_USER_PROFILE,
  type UserProfile,
  type UserLevel,
  type Goal,
  type Interest,
  type LearningMethod,
} from "@/lib/types";

const LEVELS: { value: UserLevel; label: string }[] = [
  { value: "absolute_beginner", label: "Mới bắt đầu hoàn toàn" },
  { value: "beginner_plus", label: "Beginner+ (biết pinyin, vài câu cơ bản)" },
  { value: "hsk1", label: "HSK 1" },
  { value: "hsk2", label: "HSK 2" },
  { value: "hsk3", label: "HSK 3" },
  { value: "intermediate", label: "Trung cấp" },
  { value: "advanced", label: "Cao cấp" },
];

const INTERESTS: Interest[] = [
  "business",
  "finance",
  "crypto",
  "AI",
  "current_news",
  "WeChat",
  "meetings",
  "travel",
  "food",
];
const GOALS: Goal[] = ["daily_communication", "business_chinese", "exam_hsk", "travel", "media"];
const METHODS: LearningMethod[] = [
  "role_play",
  "practical_use",
  "minimal_theory",
  "flashcards",
  "reading",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const toggle = <K extends "interests" | "goals" | "learningMethod">(key: K, value: string) => {
    setProfile((p) => {
      const arr = new Set<string>(p[key] as readonly string[]);
      if (arr.has(value)) arr.delete(value);
      else arr.add(value);
      return { ...p, [key]: Array.from(arr) as UserProfile[K] };
    });
  };

  const save = () => {
    saveProfile({ ...profile, createdAt: profile.createdAt || new Date().toISOString() });
    router.push("/");
  };

  return (
    <section className="px-6 py-section">
      <header className="mb-8">
        <div className="label-uppercase text-muted">Onboarding</div>
        <h1 className="text-4xl font-bold mt-2">Profile học tập</h1>
        <p className="text-sm font-light text-muted mt-2">
          Chỉnh nhanh để AI gợi ý bài học phù hợp.
        </p>
      </header>

      <div className="border border-hairline bg-canvas p-6 space-y-5">
        <Field label="Tên hiển thị">
          <input
            className="text-input"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </Field>

        <Field label="Trình độ hiện tại">
          <select
            className="text-input"
            value={profile.currentLevel}
            onChange={(e) => setProfile({ ...profile, currentLevel: e.target.value as UserLevel })}
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Thời gian học mỗi ngày">
          <input
            className="text-input"
            value={profile.dailyStudyTime}
            onChange={(e) => setProfile({ ...profile, dailyStudyTime: e.target.value })}
          />
        </Field>

        <Field label="Mục tiêu">
          <ChipGroup options={GOALS} selected={profile.goals} onToggle={(v) => toggle("goals", v)} />
        </Field>

        <Field label="Sở thích / chủ đề">
          <ChipGroup
            options={INTERESTS}
            selected={profile.interests}
            onToggle={(v) => toggle("interests", v)}
          />
        </Field>

        <Field label="Phương pháp ưa thích">
          <ChipGroup
            options={METHODS}
            selected={profile.learningMethod}
            onToggle={(v) => toggle("learningMethod", v)}
          />
        </Field>
      </div>

      <div className="flex justify-end mt-8">
        <button onClick={save} className="btn-primary">
          LƯU VÀ VỀ DASHBOARD
        </button>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-uppercase text-muted block mb-2">{label}</label>
      {children}
    </div>
  );
}

function ChipGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={on ? "chip chip-active" : "chip"}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
