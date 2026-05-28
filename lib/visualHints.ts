import type { VisualHint } from "./types";

/**
 * Hanzi → emoji map for flashcards and vocab lists.
 * Covers high-frequency business / WeChat / hospitality terms used by the app.
 * Falls back to undefined → component renders plain hanzi without emoji.
 */
const HANZI_EMOJI: Record<string, string> = {
  // Business core
  报价: "💰",
  价格: "💰",
  预算: "📊",
  风险: "⚠️",
  风险控制: "🛡️",
  合作: "🤝",
  合同: "📄",
  协议: "📄",
  条款: "📄",
  谈判: "🤝",
  让步: "↔️",
  双赢: "🏆",
  支持: "🛠️",
  效率: "⚙️",
  市场: "📈",
  产品: "📦",
  客户: "👤",
  用户: "👤",
  团队: "👥",
  项目: "📁",
  报告: "📊",
  确认: "✅",
  同意: "✅",
  会议: "📅",
  开会: "📅",
  日历: "📅",

  // WeChat / messaging
  微信: "💬",
  消息: "💬",
  回复: "↩️",
  请问: "🙋",
  谢谢: "🙏",

  // Time / scheduling
  今天: "📆",
  明天: "📆",
  上午: "🌅",
  下午: "🌇",
  时间: "⏰",

  // Travel / airport / hotel
  机场: "✈️",
  航线: "✈️",
  航班: "✈️",
  登机口: "🛂",
  登机牌: "🎫",
  护照: "📕",
  起飞: "🛫",
  酒店: "🏨",
  前台: "🛎️",
  入住: "🔑",
  退房: "🚪",
  房型: "🛏️",
  套房: "🛌",
  早餐: "🥐",
  钥匙: "🔑",
  行李寄存: "🧳",
  叫醒服务: "⏰",
  客房服务: "🛎️",
  打扫: "🧹",

  // Retail / duty-free
  免税店: "🛍️",
  化妆品: "💄",
  香水: "🌸",
  酒类: "🍷",
  烟: "🚬",
  巧克力: "🍫",
  护肤品: "🧴",
  新品: "🆕",
  热销: "🔥",
  正品: "🏷️",
  限购: "🚦",
  结账: "💳",
  刷卡: "💳",
  支付宝: "📱",
  微信支付: "📱",
  退税: "🧾",
  包装: "🎁",

  // Crypto / finance
  加密货币: "🪙",
  交易所: "💹",
  现货: "💹",
  合约: "📑",
  杠杆: "⚖️",
  流动性: "💧",
  做市商: "🏦",
  深度: "📚",
  上线: "🚀",
  下架: "📤",
  钱包: "👛",
  私钥: "🔐",
  实名认证: "🪪",
  反洗钱: "🛡️",
  提现: "🏧",
  充值: "➕",
  手续费: "💸",
  波动: "📉",
  止损: "🛑",
  爆仓: "💥",
  稳定币: "💵",
  投资: "📈",
  损失: "📉",
  信誉: "🏅",

  // AI / productivity
  人工智能: "🤖",
  大模型: "🧠",
  自动化: "⚙️",
  替代: "🔁",
  工具: "🧰",
  数据: "📊",
  训练: "🏋️",
  微调: "🎚️",
  提示词: "📝",
  应用场景: "🎯",
  落地: "🚀",
  幻觉: "💭",
  智能体: "🤖",
  上下文: "🧩",
  试点: "🧪",
  投入产出: "📈",
  推广: "📣",

  // Negotiation
  底线: "📍",
  违约: "⚠️",
  诚意: "🤲",
  退一步: "↩️",
  起草: "✍️",
  争议: "⚖️",
  诉求: "🎯",
  付款方式: "💳",
  首付: "💵",
  尾款: "💵",
  折扣: "🏷️",
  保证: "🛡️",

  // Slang
  卷: "🌀",
  内卷: "🌀",
  靠谱: "👍",
  不靠谱: "👎",
  老是: "🔁",
  加班: "🌙",
  换: "🔄",

  // Generic high-freq
  我: "🙋",
  你: "👉",
  是: "✅",
  公司: "🏢",
  工作: "💼",
  负责: "🎯",
  运营: "⚙️",
  业务发展: "📈",
  方便: "👌",
  讨论: "🗣️",
  开始: "▶️",
  主要: "⭐",
  方案: "📋",
  考虑: "🤔",
  需要: "❗",
  觉得: "💭",
  竞争: "⚔️",
  激烈: "🔥",
  出现: "✨",
  特色: "✨",
  淘汰: "🗑️",
  发现: "🔍",
  关心: "💛",
  入住率: "📊",
  超过: "🚀",
  适当: "⚖️",
  淡季: "🍂",
  促销: "🎉",
  春节: "🎊",
  旅客流量: "👥",
  增长: "📈",
  游客: "🧳",
  思念: "💭",
  家乡: "🏡",
  夜风: "🌙",
  方向: "🧭",
  说好的: "🤝",
  资料: "📂",
  提前: "⏰",
  问题: "❓",
  支付: "💳",
  尽快: "⚡",
};

/**
 * Memory hooks — short Vietnamese sentences that anchor a Chinese word in a
 * concrete mental image. Different from emoji: forces the learner to *see*
 * the word in context. Optional `imagePrompt` for future illustration.
 */
const MEMORY_HOOK: Record<
  string,
  { memoryHookVi: string; imagePrompt?: string }
> = {
  报价: {
    memoryHookVi: "Tưởng tượng một file PDF báo giá nằm giữa bàn đàm phán, giá highlight vàng.",
    imagePrompt:
      "A quotation document on a business negotiation table with price highlights, no text, no logos",
  },
  价格: {
    memoryHookVi: "Tag giá treo lủng lẳng trên một món hàng duty-free.",
  },
  风险: {
    memoryHookVi: "Dashboard có cảnh báo đỏ và một chiếc khiên bảo vệ ở góc.",
    imagePrompt:
      "A risk dashboard with warning icon and protective shield, no readable text, no logos",
  },
  风险控制: {
    memoryHookVi: "Khiên + biểu đồ kiểm soát = risk control trong tài chính.",
  },
  入住率: {
    memoryHookVi: "Bảng công suất phòng khách sạn 92% sáng đèn xanh.",
    imagePrompt:
      "A hotel occupancy board and room calendar, no readable text, no logos",
  },
  旅客流量: {
    memoryHookVi: "Dòng hành khách đi qua terminal sân bay, mũi tên chỉ hướng cổng.",
    imagePrompt:
      "Passenger flow through an airport terminal, no text, no logos",
  },
  合作: {
    memoryHookVi: "Hai bàn tay bắt nhau trên nền tài liệu hợp đồng.",
  },
  合同: {
    memoryHookVi: "Cuộn hợp đồng có chữ ký và con dấu đỏ.",
  },
  谈判: {
    memoryHookVi: "Hai người ngồi đối diện, ở giữa là bàn cà phê + file proposal.",
  },
  让步: {
    memoryHookVi: "Hình mũi tên cong một bên lùi một bước về phía đối phương.",
  },
  双赢: {
    memoryHookVi: "Hai cúp vàng đứng song song — win-win.",
  },
  底线: {
    memoryHookVi: "Đường kẻ đỏ dưới chân — không bước qua = bottom line.",
  },
  预算: {
    memoryHookVi: "Bảng spreadsheet ngân sách với số tiền màu xanh / đỏ.",
  },
  会议: {
    memoryHookVi: "Calendar có khối thời gian xanh dương — slot họp.",
  },
  开会: {
    memoryHookVi: "Bàn họp tròn với ghế xếp đều và slide projector.",
  },
  客户: {
    memoryHookVi: "Khách hàng bước vào shop, smile và bag mua sắm.",
  },
  人工智能: {
    memoryHookVi: "Bộ não điện tử với mạch xanh — AI = trí tuệ nhân tạo.",
  },
  自动化: {
    memoryHookVi: "Cánh tay robot lặp đi lặp lại một thao tác.",
  },
  数据: {
    memoryHookVi: "Hàng cột số liệu chạy như dòng matrix.",
  },
  效率: {
    memoryHookVi: "Đồng hồ chạy nhanh + đường đi thẳng = hiệu suất.",
  },
  成本: {
    memoryHookVi: "Ví tiền có mũi tên xuống — chi phí giảm.",
  },
  交易所: {
    memoryHookVi: "Màn hình K-line của sàn giao dịch xanh đỏ nhấp nháy.",
  },
  杠杆: {
    memoryHookVi: "Đòn bẩy kim loại — leverage nhỏ chuyển sức lớn.",
  },
  止损: {
    memoryHookVi: "Đường kẻ ngang đỏ — chạm là dừng lỗ.",
  },
  爆仓: {
    memoryHookVi: "Tia chớp nổ vào tài khoản — cháy tài khoản.",
  },
  实名认证: {
    memoryHookVi: "CMND + selfie + tick xanh = KYC.",
  },
  机场: {
    memoryHookVi: "Bóng máy bay + biển báo cổng ra.",
  },
  酒店: {
    memoryHookVi: "Toà nhà có chìa khoá + biển 'hotel' tròn.",
  },
  前台: {
    memoryHookVi: "Quầy lễ tân khách sạn với chuông và sổ.",
  },
  入住: {
    memoryHookVi: "Thẻ phòng được trao tay từ lễ tân.",
  },
  免税店: {
    memoryHookVi: "Cửa hàng có chữ duty-free + tag không thuế.",
  },
  护肤品: {
    memoryHookVi: "Set chai serum + kem dưỡng trên kệ trắng.",
  },
  限购: {
    memoryHookVi: "Tay cầm 2 chai rượu + dấu STOP — chỉ được mua 2.",
  },
  卷: {
    memoryHookVi: "Vòng xoáy cuốn nhân viên xuống deadline — internal competition.",
  },
  靠谱: {
    memoryHookVi: "Một bàn tay đặt lên vai với tick xanh — đáng tin.",
  },
  不靠谱: {
    memoryHookVi: "Cùng bàn tay đó nhưng tick xanh đổi thành dấu X đỏ.",
  },
  确认: {
    memoryHookVi: "Tick xanh phát sáng trong app chat.",
  },
  支付宝: {
    memoryHookVi: "QR code trên màn hình điện thoại tại quầy thu ngân (generic).",
  },
  微信支付: {
    memoryHookVi: "Bong bóng chat + biểu tượng đồng xu (generic, không logo thật).",
  },
};

export function visualHintFor(hanzi: string): VisualHint | undefined {
  const emoji = HANZI_EMOJI[hanzi];
  const hook = MEMORY_HOOK[hanzi];
  if (!emoji && !hook) return undefined;
  return {
    emoji,
    memoryHookVi: hook?.memoryHookVi,
    imagePrompt: hook?.imagePrompt,
    altVi: `Biểu tượng cho ${hanzi}`,
  };
}

/** Direct memory-hook lookup, used independently of emoji. */
export function memoryHookFor(hanzi: string): string | undefined {
  return MEMORY_HOOK[hanzi]?.memoryHookVi;
}
