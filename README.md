# Chinese Tutor Vân Trang

Web app học tiếng Trung dành riêng cho Vân Trang: 15–20 phút mỗi ngày, role-play, du lịch / phim cổ trang & hiện đại / mạng xã hội (Xiaohongshu / Douyin / Weibo) / đọc báo / chat gia đình + bạn bè trên WeChat. KHÔNG có business / MOU / finance / crypto / AI productivity.

Stack: **Next.js 14 (App Router) + TypeScript + Tailwind**. Chạy local-first bằng `localStorage`; OpenAI là tùy chọn (không có key vẫn dùng được toàn bộ với mock). TTS (phát âm tiếng Trung) dùng **Web Speech API** có sẵn trong browser — không cần network, không tốn phí.

---

## Setup

```bash
cd chinese-tutor-vantrang
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). App chạy được ngay, không cần env.

### Optional: OpenAI

Khi chưa có key, `/api/ai/correct`, `/api/ai/lesson`, `/api/ai/roleplay` trả về **mock response** (đủ để click hết flow). Khi muốn chấm thật:

```bash
cp .env.example .env.local
# rồi điền:
# OPENAI_API_KEY=sk-...
# OPENAI_MODEL=gpt-4o-mini   (mặc định)
```

### Optional: Supabase (sau MVP)

Schema sẵn ở `supabase/schema.sql`. Khi muốn migrate khỏi localStorage:

1. Tạo Supabase project, chạy file SQL trên trong SQL editor.
2. Điền `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` vào `.env.local`.
3. `npm install @supabase/supabase-js`.
4. Mở `lib/supabase.ts`, thay placeholder bằng `createClient(...)`.
5. Thay dần các call trong `lib/storage.ts` thành Supabase queries (giữ localStorage làm fallback nếu env trống).

---

## Cấu trúc

```
app/
  page.tsx                 Dashboard
  onboarding/page.tsx
  lesson/[day]/page.tsx    Chi tiết bài học (Vocab / Patterns / Dialogue / Role-play / Quiz)
  flashcards/page.tsx
  roleplay/page.tsx        Chat role-play với AI + correction inline
  mistakes/page.tsx        Mistake log + đánh dấu thuộc
  progress/page.tsx
  api/ai/correct/route.ts  POST { sentence, context }
  api/ai/lesson/route.ts   POST { day, topic }
  api/ai/roleplay/route.ts POST { scenarioContext, history, userMessage }

components/
  DashboardCard, Flashcard, LessonVocabulary, SentencePatternList (+ DialogueBlock),
  RoleplayChat, CorrectionPanel, MiniQuiz, ProgressSummary, NavBar

lib/
  types.ts        Core TypeScript types
  prompts.ts      System + correction + lesson + roleplay prompts
  ai.ts           OpenAI client + JSON guard + mock fallback
  lessonData.ts   Lesson lookup helpers
  storage.ts      localStorage layer (profile, flashcards, mistakes, quiz, progress)
  supabase.ts     Placeholder client

data/
  week1Lessons.ts        7 bài Tuần 1, seeded
  seedFlashcards.ts      Build flashcards từ vocab Tuần 1
  roleplayScenarios.ts   Scenario từ bài + 4 scenario phụ

supabase/schema.sql
```

---

## Core learning loop

1. Dashboard → bấm **Today's lesson**
2. Học Vocab → Patterns → Dialogue → Role-play → **Mini Quiz**
3. Quiz xong → bài tự đánh dấu hoàn thành, streak +1
4. Vào **Role-play** → submit câu tiếng Trung → AI chấm → lưu vào **Mistake log**
5. Hôm sau lên dashboard thấy bài tiếp theo, mistakes cần ôn

---

## Acceptance checklist (đã pass)

- [x] `npm install && npm run dev` chạy không lỗi route, không lỗi import
- [x] Dashboard load không cần DB
- [x] Week 1 (7 bài) hiển thị đầy đủ
- [x] Lesson detail render Vocab / Patterns / Dialogue / Role-play / Quiz
- [x] Flashcards flip + status (new / learning / familiar / mastered)
- [x] Roleplay nhận input, gửi `/api/ai/correct` + `/api/ai/roleplay`
- [x] Correction API trả về structured JSON, có mock fallback khi chưa có key
- [x] Mistake log lưu localStorage, đánh dấu mastered
- [x] Progress hiển thị metrics cơ bản + quiz history
- [x] Code TypeScript strict, không hard-code API key

---

## Next steps (theo lộ trình)

- **Ngày 2:** UI polish, test full loop trong browser
- **Ngày 3:** Cắm `OPENAI_API_KEY`, kiểm tra correction thật
- **Ngày 4:** Migrate localStorage → Supabase
- **Ngày 5:** Thêm Week 2–4 (xem prompts trong tài liệu spec)
- **Ngày 6:** Voice recording (browser MediaRecorder + Whisper)
- **Ngày 7:** Dùng app 1 tuần, sửa theo lỗi thực tế

---

## Scripts

```bash
npm run dev         # next dev
npm run build       # next build
npm run start       # next start (prod)
npm run typecheck   # tsc --noEmit
```
