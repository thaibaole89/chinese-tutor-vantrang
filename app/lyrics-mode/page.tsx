import { LyricsMode } from "@/components/LyricsMode";

export default function LyricsModePage() {
  return (
    <>
      <section className="bg-ink-900 text-white">
        <div className="px-6 py-section">
          <div className="label-uppercase text-on-dark-soft">Lyrics Mode</div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold leading-[1.05]">
            Học tiếng Trung qua lyrics bạn tự dán
          </h1>
          <p className="mt-3 max-w-2xl text-base font-light text-on-dark-soft">
            Dán đoạn lyrics tiếng Trung bạn muốn study. App sẽ phân tích từng dòng: pinyin,
            nghĩa, key phrases, có dùng được trong nói hằng ngày không, và bản spoken
            equivalent nếu cần. <strong>App không scrape, không tải, không bundle lyrics có
            bản quyền — bạn dán đoạn của bạn.</strong>
          </p>
        </div>
      </section>

      <section className="px-6 py-section">
        <LyricsMode />
      </section>
    </>
  );
}
