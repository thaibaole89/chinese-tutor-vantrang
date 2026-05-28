import type { SceneType } from "@/lib/types";

/**
 * Hand-composed CSS+SVG learning scenes. No external images, no real
 * logos, no readable text inside the artwork. Premium muted colors,
 * consistent style. Each scene is 16:9 with absolutely-positioned
 * primitive shapes (rect / circle / arc / triangle).
 *
 * Pass `labels` to render up to 4 semantic chips at the bottom — the
 * only place Chinese text appears inside the illustration.
 */

interface Props {
  scene: SceneType;
  altVi: string;
  labels?: string[];
  className?: string;
}

export function LearningIllustration({ scene, altVi, labels, className = "" }: Props) {
  return (
    <div
      role="img"
      aria-label={altVi}
      className={`relative aspect-[16/9] overflow-hidden ${className}`}
    >
      {renderScene(scene)}

      {/* Bottom-centre semantic chips — only Chinese text inside the art. */}
      {labels && labels.length > 0 ? (
        <div className="absolute bottom-3 inset-x-3 flex flex-wrap gap-1.5 justify-center pointer-events-none">
          {labels.slice(0, 4).map((l) => (
            <span
              key={l}
              className="zh inline-flex items-center bg-white/90 text-ink-900 text-[11px] font-bold tracking-[0.3px] px-2 py-1 border border-ink-200 shadow-sm backdrop-blur-sm"
            >
              {l}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function renderScene(scene: SceneType): JSX.Element {
  switch (scene) {
    case "ai_office":
      return <SceneAiOffice />;
    case "market_competition":
      return <SceneMarketCompetition />;
    case "wechat_meeting":
      return <SceneWechatMeeting />;
    case "crypto_risk":
      return <SceneCryptoRisk />;
    case "dutyfree_customer":
      return <SceneDutyFreeCustomer />;
    case "hotel_pricing":
      return <SceneHotelPricing />;
    case "airport_traffic":
      return <SceneAirportTraffic />;
    case "slang_register":
      return <SceneSlangRegister />;
    case "trust_reliability":
      return <SceneTrustReliability />;
    case "music_rhythm":
      return <SceneMusicRhythm />;
    case "business_negotiation":
      return <SceneBusinessNegotiation />;
    case "crypto_exchange":
      return <SceneCryptoExchange />;
    case "airport_retail":
      return <SceneAirportRetail />;
    case "hotel_operations":
      return <SceneHotelOperations />;
    case "ai_productivity":
      return <SceneAiProductivity />;
  }
}

// ============================================================
// Background helper
// ============================================================

function Bg({ tone, children }: { tone: string; children?: React.ReactNode }) {
  return (
    <div className={`absolute inset-0 ${tone}`} aria-hidden="true">
      {children}
    </div>
  );
}

// ============================================================
// 1. AI office — desk, laptop, glowing AI orb, sticky note, plant
// ============================================================
function SceneAiOffice() {
  return (
    <>
      <Bg tone="bg-gradient-to-br from-indigo-100 via-violet-50 to-white" />
      {/* desk surface line */}
      <div className="absolute bottom-[26%] left-0 right-0 h-px bg-ink-300/40" aria-hidden="true" />
      {/* monitor / laptop base */}
      <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[42%] h-[3%] bg-slate-300 rounded-sm" aria-hidden="true" />
      <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[42%] h-[28%] bg-slate-800 rounded-md border border-slate-900" aria-hidden="true">
        <div className="absolute inset-2 bg-slate-700 rounded-sm" />
        {/* code lines */}
        <div className="absolute inset-x-3 top-3 space-y-1.5">
          <div className="h-1 w-[40%] bg-indigo-400/70" />
          <div className="h-1 w-[60%] bg-indigo-400/40" />
          <div className="h-1 w-[30%] bg-indigo-400/60" />
        </div>
      </div>
      {/* AI orb glowing above laptop */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-16 h-16" aria-hidden="true">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 blur-md opacity-60" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white via-violet-200 to-indigo-400 shadow-lg" />
      </div>
      {/* sticky note right */}
      <div className="absolute top-[20%] right-[10%] w-12 h-12 bg-amber-200 rotate-6 shadow-sm" aria-hidden="true">
        <div className="m-2 space-y-1">
          <div className="h-1 bg-amber-700/40" />
          <div className="h-1 bg-amber-700/30 w-2/3" />
        </div>
      </div>
      {/* plant left */}
      <div className="absolute bottom-[12%] left-[8%]" aria-hidden="true">
        <div className="w-8 h-3 bg-stone-400 rounded-sm" />
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-500" />
        <div className="absolute -top-3 left-0 w-4 h-4 rounded-full bg-emerald-400" />
        <div className="absolute -top-3 right-0 w-4 h-4 rounded-full bg-emerald-600" />
      </div>
    </>
  );
}

// ============================================================
// 2. Market competition — spiral race + climbing figures
// ============================================================
function SceneMarketCompetition() {
  return (
    <>
      <Bg tone="bg-gradient-to-br from-slate-100 via-blue-50 to-white" />
      <svg
        viewBox="0 0 100 56"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* spiral path */}
        <path
          d="M50,50 C20,50 20,15 50,15 C75,15 75,40 50,40 C30,40 30,22 50,22 C65,22 65,33 50,33"
          fill="none"
          stroke="#1c69d4"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          opacity="0.6"
        />
        {/* climbing dots */}
        {[
          { cx: 50, cy: 50, color: "#1c69d4" },
          { cx: 32, cy: 40, color: "#3b82f6" },
          { cx: 35, cy: 22, color: "#60a5fa" },
          { cx: 55, cy: 30, color: "#0653b6" },
          { cx: 50, cy: 33, color: "#1e3a8a" },
        ].map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r="1.8" fill={dot.color} />
        ))}
        {/* eliminated x marks bottom right */}
        <g stroke="#ef4444" strokeWidth="0.7" opacity="0.7">
          <line x1="84" y1="46" x2="88" y2="50" />
          <line x1="88" y1="46" x2="84" y2="50" />
          <line x1="92" y1="48" x2="96" y2="52" />
          <line x1="96" y1="48" x2="92" y2="52" />
        </g>
      </svg>
    </>
  );
}

// ============================================================
// 3. WeChat meeting — phone with chat bubbles + calendar + clock
// ============================================================
function SceneWechatMeeting() {
  return (
    <>
      <Bg tone="bg-gradient-to-br from-emerald-100 via-green-50 to-white" />
      {/* phone */}
      <div className="absolute top-1/2 left-[28%] -translate-y-1/2 w-[18%] aspect-[9/16] bg-slate-800 rounded-xl border-2 border-slate-900 shadow-lg" aria-hidden="true">
        <div className="absolute inset-1.5 rounded-md bg-emerald-50 overflow-hidden">
          {/* status bar */}
          <div className="h-2 bg-emerald-200/60" />
          {/* chat bubbles */}
          <div className="p-1.5 space-y-1.5">
            <div className="w-[70%] h-3 bg-white rounded-full rounded-bl-none border border-emerald-200" />
            <div className="ml-auto w-[60%] h-3 bg-emerald-500 rounded-full rounded-br-none" />
            <div className="w-[80%] h-3 bg-white rounded-full rounded-bl-none border border-emerald-200" />
            <div className="ml-auto w-[50%] h-3 bg-emerald-500 rounded-full rounded-br-none" />
          </div>
        </div>
      </div>
      {/* calendar block */}
      <div className="absolute top-[18%] right-[14%] w-20 h-20 bg-white border-2 border-ink-300 rounded shadow-md overflow-hidden" aria-hidden="true">
        <div className="h-4 bg-bmw-blue" />
        <div className="grid grid-cols-5 gap-0.5 p-1.5">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square ${i === 8 ? "bg-bmw-blue" : "bg-ink-100"}`}
            />
          ))}
        </div>
      </div>
      {/* clock */}
      <div className="absolute bottom-[14%] right-[10%] w-12 h-12 rounded-full bg-white border-2 border-ink-300 shadow-sm flex items-center justify-center" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <line x1="12" y1="12" x2="12" y2="6" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="12" x2="16" y2="14" stroke="#1c69d4" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </>
  );
}

// ============================================================
// 4. Crypto risk — k-line bars behind a shield
// ============================================================
function SceneCryptoRisk() {
  return (
    <>
      <Bg tone="bg-gradient-to-br from-slate-100 via-violet-50 to-white" />
      {/* grid lines */}
      <svg viewBox="0 0 100 56" className="absolute inset-0 w-full h-full" aria-hidden="true">
        {[10, 20, 30, 40].map((y) => (
          <line key={y} x1="5" x2="95" y1={y} y2={y} stroke="#94a3b8" strokeWidth="0.2" strokeDasharray="1 2" />
        ))}
        {/* candle sticks */}
        {[
          { x: 12, top: 18, bot: 30, color: "#10b981" },
          { x: 22, top: 22, bot: 36, color: "#ef4444" },
          { x: 32, top: 14, bot: 26, color: "#10b981" },
          { x: 42, top: 20, bot: 34, color: "#ef4444" },
          { x: 52, top: 10, bot: 22, color: "#10b981" },
          { x: 62, top: 16, bot: 28, color: "#10b981" },
          { x: 72, top: 24, bot: 38, color: "#ef4444" },
          { x: 82, top: 18, bot: 30, color: "#10b981" },
        ].map((c, i) => (
          <rect key={i} x={c.x - 1.8} y={c.top} width="3.6" height={c.bot - c.top} fill={c.color} opacity="0.7" />
        ))}
      </svg>
      {/* shield centered */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        <svg viewBox="0 0 100 110" className="w-24 h-24 drop-shadow-lg">
          <path
            d="M50 5 L88 18 L88 60 C88 82 70 100 50 105 C30 100 12 82 12 60 L12 18 Z"
            fill="url(#shieldGrad)"
            stroke="#1c69d4"
            strokeWidth="3"
          />
          <path d="M30 55 L45 70 L72 40" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3b82f6" />
              <stop offset="1" stopColor="#0653b6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
}

// ============================================================
// 5. Duty-free customer — two shelves (skincare vs wine) + customer dots + clock
// ============================================================
function SceneDutyFreeCustomer() {
  return (
    <>
      <Bg tone="bg-gradient-to-br from-amber-50 via-orange-50 to-white" />
      {/* left shelf — skincare bottles (rounded) */}
      <div className="absolute top-[20%] left-[12%] w-[28%] h-[44%] border-2 border-stone-300 bg-white/60 rounded-sm" aria-hidden="true">
        <div className="absolute inset-x-2 top-2 flex justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-5 h-12 bg-rose-200 rounded-t-full rounded-b-md border border-rose-300" />
          ))}
        </div>
        <div className="absolute inset-x-0 top-[55%] h-px bg-stone-300" />
        <div className="absolute inset-x-2 top-[60%] flex justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-5 h-10 bg-amber-100 rounded-md border border-amber-300" />
          ))}
        </div>
      </div>
      {/* right shelf — wine bottles (tall thin) */}
      <div className="absolute top-[20%] right-[12%] w-[28%] h-[44%] border-2 border-stone-300 bg-white/60 rounded-sm" aria-hidden="true">
        <div className="absolute inset-x-2 top-2 flex justify-between items-end h-[80%]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-1.5 h-3 bg-emerald-900" />
              <div className="w-3 h-12 bg-emerald-700 rounded-b" />
            </div>
          ))}
        </div>
      </div>
      {/* clock badge centre-top */}
      <div className="absolute top-[6%] left-1/2 -translate-x-1/2 px-2 py-1 bg-bmw-blue text-white text-[10px] font-bold tracking-wider rounded-sm" aria-hidden="true">
        15:00 – 17:00
      </div>
      {/* customer avatar dots */}
      <div className="absolute bottom-[8%] inset-x-0 flex justify-center gap-2" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-3.5 h-3.5 rounded-full bg-stone-400 border border-stone-500" />
        ))}
      </div>
    </>
  );
}

// ============================================================
// 6. Hotel pricing — front desk + occupancy bar chart + rate calendar
// ============================================================
function SceneHotelPricing() {
  return (
    <>
      <Bg tone="bg-gradient-to-br from-amber-100 via-orange-50 to-white" />
      {/* front desk on left */}
      <div className="absolute bottom-[12%] left-[8%] w-[28%] h-[28%]" aria-hidden="true">
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-stone-700 rounded-t-sm" />
        <div className="absolute inset-x-0 bottom-[55%] h-1 bg-stone-900" />
        {/* bell */}
        <div className="absolute bottom-[60%] left-1/2 -translate-x-1/2 w-6 h-3 bg-amber-400 rounded-t-full border-b border-amber-700" />
      </div>
      {/* occupancy bar chart centre-right */}
      <div className="absolute top-[18%] right-[8%] w-[44%] h-[55%]" aria-hidden="true">
        <div className="absolute -top-3 left-0 text-[10px] font-bold tracking-wider text-emerald-700">
          OCCUPANCY 92%
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-ink-300" />
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-1.5 h-full">
          {[55, 62, 70, 78, 92, 88, 75].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={`flex-1 ${
                h >= 90 ? "bg-emerald-500" : h >= 75 ? "bg-emerald-300" : "bg-amber-300"
              } rounded-t-sm`}
            />
          ))}
        </div>
      </div>
      {/* rate calendar bottom right */}
      <div className="absolute bottom-[10%] right-[10%] w-16 h-12 bg-white border border-ink-200 rounded shadow-sm grid grid-cols-7 gap-px p-1" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square ${
              i === 5 || i === 6 || i === 12 || i === 13 ? "bg-bmw-blue" : "bg-ink-100"
            }`}
          />
        ))}
      </div>
    </>
  );
}

// ============================================================
// 7. Airport traffic — terminal arch + passenger flow + airplane + shop
// ============================================================
function SceneAirportTraffic() {
  return (
    <>
      <Bg tone="bg-gradient-to-br from-sky-100 via-cyan-50 to-white" />
      {/* airplane silhouette top right */}
      <svg viewBox="0 0 100 56" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <path
          d="M85 12 L72 16 L60 14 L66 18 L60 20 L72 22 L85 26 L92 26 L92 16 Z"
          fill="#1c69d4"
          opacity="0.85"
        />
        {/* terminal arch */}
        <path
          d="M10 50 L10 30 Q50 5 90 30 L90 50 Z"
          fill="#e0f2fe"
          stroke="#0ea5e9"
          strokeWidth="0.5"
        />
        {/* gate doors */}
        <rect x="22" y="38" width="6" height="12" fill="#0ea5e9" opacity="0.6" />
        <rect x="36" y="38" width="6" height="12" fill="#0ea5e9" opacity="0.6" />
        <rect x="58" y="38" width="6" height="12" fill="#0ea5e9" opacity="0.6" />
        <rect x="72" y="38" width="6" height="12" fill="#0ea5e9" opacity="0.6" />
        {/* duty-free shop block */}
        <rect x="46" y="32" width="10" height="18" fill="#fbbf24" opacity="0.55" />
        <rect x="48" y="34" width="6" height="3" fill="#92400e" opacity="0.7" />
        {/* passenger dots flowing */}
        {[
          { x: 14, y: 52 },
          { x: 22, y: 53 },
          { x: 32, y: 52 },
          { x: 44, y: 53 },
          { x: 54, y: 52 },
          { x: 64, y: 53 },
          { x: 74, y: 52 },
          { x: 84, y: 53 },
        ].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.2" fill="#475569" />
        ))}
        {/* +20% data badge */}
        <rect x="6" y="6" width="20" height="7" rx="1" fill="#10b981" />
      </svg>
      <div className="absolute top-[10%] left-[6%] text-[10px] font-bold text-white tracking-wider" aria-hidden="true">
        +20% YoY
      </div>
    </>
  );
}

// ============================================================
// 8. Slang register — split panel: casual chat vs business meeting
// ============================================================
function SceneSlangRegister() {
  return (
    <>
      <div className="absolute inset-0 grid grid-cols-2" aria-hidden="true">
        {/* left — casual */}
        <div className="relative bg-gradient-to-br from-rose-100 via-pink-50 to-white">
          <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-rose-700">
            CASUAL
          </div>
          {/* phone with chat bubble */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] aspect-square">
            <div className="absolute inset-0 bg-white border border-rose-200 rounded-2xl rounded-bl-none p-2 shadow-sm">
              <div className="h-1.5 w-[80%] bg-rose-300 rounded" />
              <div className="h-1.5 w-[60%] bg-rose-300 rounded mt-1.5" />
              <div className="h-1.5 w-[70%] bg-rose-300 rounded mt-1.5" />
            </div>
            <div className="absolute -bottom-1 -left-1 text-xl">😩</div>
          </div>
        </div>
        {/* right — business */}
        <div className="relative bg-gradient-to-br from-slate-100 via-blue-50 to-white border-l border-ink-200">
          <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-sky-700">
            BUSINESS-SAFE
          </div>
          {/* bar chart card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-[4/3] bg-white border border-ink-200 rounded shadow-sm p-2">
            <div className="h-px bg-ink-200 absolute inset-x-2 bottom-3" />
            <div className="absolute inset-x-3 bottom-3 flex items-end gap-1 h-[70%]">
              <div className="flex-1 bg-sky-300" style={{ height: "30%" }} />
              <div className="flex-1 bg-sky-400" style={{ height: "55%" }} />
              <div className="flex-1 bg-sky-500" style={{ height: "75%" }} />
              <div className="flex-1 bg-sky-600" style={{ height: "90%" }} />
            </div>
            <div className="absolute top-2 left-2 text-xl">📊</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// 9. Trust / reliability — two supplier boxes, one check, one X
// ============================================================
function SceneTrustReliability() {
  return (
    <>
      <Bg tone="bg-gradient-to-br from-stone-100 via-slate-50 to-white" />
      {/* good supplier */}
      <div className="absolute top-1/2 left-[18%] -translate-y-1/2 w-[24%]" aria-hidden="true">
        <div className="aspect-square bg-amber-200 border-2 border-amber-700 rounded relative">
          {/* box flap */}
          <div className="absolute inset-x-0 top-0 h-[6%] bg-amber-300 border-b border-amber-700" />
          {/* big check badge */}
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M5 13 L10 18 L20 6" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="mt-2 mx-auto h-1.5 w-12 bg-emerald-500 rounded" />
      </div>
      {/* bad supplier */}
      <div className="absolute top-1/2 right-[18%] -translate-y-1/2 w-[24%]" aria-hidden="true">
        <div className="aspect-square bg-stone-300 border-2 border-stone-500 rounded relative opacity-80">
          <div className="absolute inset-x-0 top-0 h-[6%] bg-stone-400 border-b border-stone-500" />
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 border-2 border-white shadow-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="mt-2 mx-auto h-1.5 w-12 bg-red-500 rounded" />
      </div>
    </>
  );
}

// ============================================================
// 10. Music rhythm — headphones + sound waves + moon
// ============================================================
function SceneMusicRhythm() {
  return (
    <>
      <Bg tone="bg-gradient-to-br from-purple-100 via-fuchsia-50 to-white" />
      {/* moon top right */}
      <div className="absolute top-[14%] right-[14%] w-8 h-8 rounded-full bg-yellow-100 shadow-inner" aria-hidden="true">
        <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-purple-100" />
      </div>
      {/* headphones */}
      <svg viewBox="0 0 100 56" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <path
          d="M30 38 Q30 16 50 16 Q70 16 70 38"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="22" y="34" width="12" height="14" rx="3" fill="#5b21b6" />
        <rect x="66" y="34" width="12" height="14" rx="3" fill="#5b21b6" />
        {/* sound waves */}
        <path d="M82 30 Q86 36 82 42" stroke="#a78bfa" strokeWidth="1.2" fill="none" />
        <path d="M86 26 Q92 36 86 46" stroke="#a78bfa" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M18 30 Q14 36 18 42" stroke="#a78bfa" strokeWidth="1.2" fill="none" />
        <path d="M14 26 Q8 36 14 46" stroke="#a78bfa" strokeWidth="1.2" fill="none" opacity="0.7" />
      </svg>
    </>
  );
}

// ============================================================
// 11. Business negotiation — table + two avatars + document
// ============================================================
function SceneBusinessNegotiation() {
  return (
    <>
      <Bg tone="bg-gradient-to-br from-slate-100 via-blue-50 to-white" />
      {/* table */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[60%] h-[10%] bg-stone-400 rounded-full shadow-md" aria-hidden="true" />
      <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2 w-[40%] h-[6%] bg-stone-500 rounded-full opacity-40" aria-hidden="true" />
      {/* document on table */}
      <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-[18%] h-[28%] bg-white border border-ink-300 shadow rotate-[-4deg]" aria-hidden="true">
        <div className="m-2 space-y-1">
          <div className="h-1 bg-ink-200" />
          <div className="h-1 bg-ink-200 w-3/4" />
          <div className="h-1 bg-ink-200" />
          <div className="h-1 bg-ink-200 w-2/3" />
          <div className="h-1 bg-bmw-blue w-1/2 mt-2" />
        </div>
      </div>
      {/* left avatar */}
      <div className="absolute bottom-[26%] left-[18%]" aria-hidden="true">
        <div className="w-10 h-10 rounded-full bg-bmw-blue border-2 border-white shadow" />
        <div className="w-14 h-8 bg-bmw-blue rounded-t-2xl mt-1 -ml-2" />
      </div>
      {/* right avatar */}
      <div className="absolute bottom-[26%] right-[18%]" aria-hidden="true">
        <div className="w-10 h-10 rounded-full bg-amber-600 border-2 border-white shadow" />
        <div className="w-14 h-8 bg-amber-600 rounded-t-2xl mt-1 -ml-2" />
      </div>
      {/* handshake arrows */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 text-2xl" aria-hidden="true">
        🤝
      </div>
    </>
  );
}

// ============================================================
// 12. Crypto exchange — k-line + USDT coin + shield, on dark background
// ============================================================
function SceneCryptoExchange() {
  return (
    <>
      <Bg tone="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <svg viewBox="0 0 100 56" className="absolute inset-0 w-full h-full" aria-hidden="true">
        {[15, 25, 35, 45].map((y) => (
          <line key={y} x1="5" x2="95" y1={y} y2={y} stroke="#475569" strokeWidth="0.2" />
        ))}
        {[
          { x: 14, top: 26, bot: 38, c: "#10b981" },
          { x: 22, top: 18, bot: 30, c: "#10b981" },
          { x: 30, top: 22, bot: 34, c: "#ef4444" },
          { x: 38, top: 14, bot: 26, c: "#10b981" },
          { x: 46, top: 10, bot: 22, c: "#10b981" },
          { x: 54, top: 16, bot: 28, c: "#ef4444" },
          { x: 62, top: 12, bot: 24, c: "#10b981" },
          { x: 70, top: 20, bot: 32, c: "#ef4444" },
        ].map((c, i) => (
          <rect key={i} x={c.x - 2} y={c.top} width="4" height={c.bot - c.top} fill={c.c} opacity="0.9" />
        ))}
        {/* shield bottom-right */}
        <path d="M82 40 L92 42 L92 50 C92 53 87 56 87 56 C87 56 82 53 82 50 Z" fill="#1c69d4" />
        <path d="M84 49 L86 51 L90 47" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* coin top-right */}
        <circle cx="86" cy="14" r="5" fill="#facc15" stroke="#a16207" strokeWidth="0.6" />
        <text x="86" y="16" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#78350f">¥</text>
      </svg>
    </>
  );
}

// ============================================================
// 13. Airport retail — shopping bag + airplane + shop window
// ============================================================
function SceneAirportRetail() {
  return (
    <>
      <Bg tone="bg-gradient-to-br from-sky-100 via-cyan-50 to-white" />
      <svg viewBox="0 0 100 56" className="absolute inset-0 w-full h-full" aria-hidden="true">
        {/* airplane top */}
        <path d="M82 10 L70 14 L60 12 L66 16 L60 18 L70 20 L82 24 L88 24 L88 14 Z" fill="#0ea5e9" opacity="0.85" />
        {/* shop window */}
        <rect x="10" y="20" width="38" height="28" fill="#f0f9ff" stroke="#0284c7" strokeWidth="0.6" />
        <line x1="10" y1="30" x2="48" y2="30" stroke="#0284c7" strokeWidth="0.4" />
        {/* shelves */}
        {[1, 2, 3, 4].map((i) => (
          <rect key={i} x={14 + (i - 1) * 8} y="22" width="4" height="6" fill="#fbbf24" />
        ))}
        {[1, 2, 3, 4].map((i) => (
          <rect key={i} x={14 + (i - 1) * 8} y="33" width="4" height="6" fill="#a78bfa" />
        ))}
        {/* shopping bag */}
        <g transform="translate(60 24)">
          <path d="M0 8 L20 8 L18 28 L2 28 Z" fill="#1c69d4" />
          <path d="M5 8 Q5 2 10 2 Q15 2 15 8" stroke="#0653b6" strokeWidth="1.2" fill="none" />
        </g>
      </svg>
    </>
  );
}

// ============================================================
// 14. Hotel operations — front desk bell + key card + bed
// ============================================================
function SceneHotelOperations() {
  return (
    <>
      <Bg tone="bg-gradient-to-br from-amber-100 via-orange-50 to-white" />
      <svg viewBox="0 0 100 56" className="absolute inset-0 w-full h-full" aria-hidden="true">
        {/* desk surface */}
        <rect x="6" y="38" width="88" height="2" fill="#92400e" opacity="0.6" />
        {/* bell */}
        <ellipse cx="20" cy="34" rx="10" ry="6" fill="#fbbf24" stroke="#a16207" strokeWidth="0.7" />
        <line x1="20" y1="22" x2="20" y2="28" stroke="#a16207" strokeWidth="0.8" />
        <circle cx="20" cy="22" r="1.5" fill="#a16207" />
        {/* key card */}
        <rect x="42" y="26" width="20" height="12" rx="1" fill="#1c69d4" stroke="#0653b6" strokeWidth="0.5" />
        <rect x="45" y="29" width="6" height="3" fill="#fbbf24" />
        <circle cx="58" cy="32" r="1" fill="white" />
        {/* bed */}
        <rect x="74" y="22" width="22" height="14" rx="1" fill="#fef3c7" stroke="#a16207" strokeWidth="0.5" />
        <rect x="76" y="22" width="8" height="6" fill="white" stroke="#a16207" strokeWidth="0.3" />
        <rect x="74" y="36" width="22" height="3" fill="#a16207" opacity="0.5" />
      </svg>
    </>
  );
}

// ============================================================
// 15. AI productivity — laptop + brain icon + speed lines
// ============================================================
function SceneAiProductivity() {
  return (
    <>
      <Bg tone="bg-gradient-to-br from-indigo-100 via-violet-50 to-white" />
      {/* laptop */}
      <div className="absolute bottom-[18%] left-[20%] w-[40%] h-[40%]" aria-hidden="true">
        <div className="absolute inset-x-0 bottom-0 h-2 bg-slate-400 rounded-sm" />
        <div className="absolute inset-x-2 inset-y-0 bottom-2 bg-slate-800 rounded-md border border-slate-900">
          <div className="absolute inset-2 bg-slate-700 rounded-sm">
            <div className="absolute inset-x-3 top-3 space-y-1.5">
              <div className="h-1 w-[40%] bg-indigo-400" />
              <div className="h-1 w-[60%] bg-indigo-400/60" />
            </div>
          </div>
        </div>
      </div>
      {/* brain icon above laptop */}
      <svg viewBox="0 0 100 56" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <g transform="translate(38 6)">
          <path
            d="M12 0 Q4 0 4 8 Q-2 12 4 18 Q4 24 12 22 Q14 26 20 22 Q26 24 26 18 Q32 12 26 8 Q26 0 18 0 Q15 -2 12 0 Z"
            fill="#a78bfa"
            stroke="#7c3aed"
            strokeWidth="0.8"
          />
          <path d="M14 6 Q12 12 14 18" stroke="#5b21b6" strokeWidth="0.6" fill="none" />
          <path d="M22 6 Q24 12 22 18" stroke="#5b21b6" strokeWidth="0.6" fill="none" />
          <path d="M16 12 L20 12" stroke="#5b21b6" strokeWidth="0.6" />
        </g>
        {/* speed arrows right */}
        <g stroke="#1c69d4" strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path d="M70 30 L86 30" />
          <path d="M82 26 L86 30 L82 34" />
          <path d="M72 38 L84 38" opacity="0.6" />
          <path d="M74 22 L84 22" opacity="0.6" />
        </g>
      </svg>
    </>
  );
}
