import { WeChatCoach } from "@/components/WeChatCoach";

export default function WeChatCoachPage() {
  return (
    <>
      <section className="bg-ink-900 text-white">
        <div className="px-6 py-section">
          <div className="label-uppercase text-on-dark-soft">Chat Coach</div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold leading-[1.05]">
            Viết tin WeChat trong 3 tông
          </h1>
          <p className="mt-3 max-w-2xl text-base font-light text-on-dark-soft">
            Gõ ý bạn muốn nói (tiếng Việt hoặc Trung thô). AI viết lại 3 phiên bản:
            <strong> casual</strong> (bạn thân / fan-group), <strong>warm</strong> (gia đình,
            người quen), <strong>respectful</strong> (lịch sự với người lạ / lớn tuổi) — kèm
            pinyin, ghi chú văn phong, và gợi ý câu tiếp.
          </p>
        </div>
      </section>

      <section className="px-6 py-section">
        <WeChatCoach />
      </section>
    </>
  );
}
