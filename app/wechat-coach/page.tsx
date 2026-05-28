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
            <strong> Casual / thân mật</strong> (bạn, drama fan group),
            <strong> Polite / lịch sự</strong> (lễ tân, lái xe, người bán hàng),
            <strong> Soft natural / tự nhiên mềm</strong> (Weibo comment, Xiaohongshu reply).
            Dùng cho hỏi khách sạn / nhà hàng / đường / chat bạn / comment phim.
          </p>
        </div>
      </section>

      <section className="px-6 py-section">
        <WeChatCoach />
      </section>
    </>
  );
}
