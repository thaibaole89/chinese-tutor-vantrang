"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VoiceSetting } from "@/components/VoiceSetting";
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

// Vân Trang lifestyle options — labels in Vietnamese, raw enum values
// preserved so onboarding stays type-compatible with UserProfile.
// Business/finance/crypto/AI/meetings/exam_hsk intentionally hidden.
const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: "daily_communication", label: "Giao tiếp hằng ngày" },
  { value: "travel", label: "Du lịch Trung Quốc" },
  { value: "media", label: "Xem phim Trung" },
  { value: "social_reading", label: "Đọc mạng xã hội + tin tức cơ bản" },
  { value: "shopping_food", label: "Mua sắm, ăn uống, khách sạn" },
];

const INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: "travel", label: "Du lịch" },
  { value: "food", label: "Ẩm thực" },
  { value: "hotel", label: "Khách sạn" },
  { value: "shopping", label: "Mua sắm" },
  { value: "drama", label: "Drama Trung Quốc" },
  { value: "xiaohongshu", label: "Xiaohongshu" },
  { value: "douyin", label: "Douyin" },
  { value: "weibo", label: "Weibo" },
  { value: "WeChat", label: "WeChat" },
  { value: "current_news", label: "Tin tức đời sống" },
];

const METHOD_OPTIONS: { value: LearningMethod; label: string }[] = [
  { value: "role_play", label: "Đóng vai (role-play)" },
  { value: "practical_use", label: "Dùng thực tế" },
  { value: "minimal_theory", label: "Ít lý thuyết" },
  { value: "flashcards", label: "Flashcards" },
  { value: "reading", label: "Đọc" },
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
        <div className="label-uppercase text-muted">Thiết lập</div>
        <h1 className="text-4xl font-bold mt-2">Hồ sơ học tập</h1>
        <p className="text-sm font-light text-muted mt-2">
          Chỉnh nhanh để app gợi ý bài học phù hợp với Vân Trang.
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
          <ChipGroup
            options={GOAL_OPTIONS}
            selected={profile.goals}
            onToggle={(v) => toggle("goals", v)}
          />
        </Field>

        <Field label="Sở thích / chủ đề">
          <ChipGroup
            options={INTEREST_OPTIONS}
            selected={profile.interests}
            onToggle={(v) => toggle("interests", v)}
          />
        </Field>

        <Field label="Phương pháp ưa thích">
          <ChipGroup
            options={METHOD_OPTIONS}
            selected={profile.learningMethod}
            onToggle={(v) => toggle("learningMethod", v)}
          />
        </Field>

        {/* Chinese TTS voice picker — improves pronunciation playback. */}
        <div className="pt-5 border-t border-hairline">
          <VoiceSetting />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button onClick={save} className="btn-primary">
          LƯU VÀ VỀ TRANG CHỦ
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

function ChipGroup<T extends string>({
  options,
  selected,
  onToggle,
}: {
  options: { value: T; label: string }[];
  selected: readonly string[];
  onToggle: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onToggle(o.value)}
            className={on ? "chip chip-active" : "chip"}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
