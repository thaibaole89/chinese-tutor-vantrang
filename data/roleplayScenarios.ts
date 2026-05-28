import type { RoleplayScenario } from "@/lib/types";
import { week1Lessons } from "./week1Lessons";
import { realFeedItems } from "./realFeedItems";
import { domainPacks } from "./domainPacks";

/**
 * Vân Trang lifestyle extra scenarios. Existing Bao business scenarios
 * (MOU, VIP airport-as-host, project progress) are replaced with
 * lifestyle equivalents: family chat, drama fan chat, travel-buddy
 * coordination.
 */
export const extraRoleplayScenarios: RoleplayScenario[] = [
  {
    id: "extra-family-chat",
    titleVi: "WeChat gia đình — chúc Tết Trung Quốc",
    titleZh: "微信家族群 — 拜年祝福",
    contextVi:
      "Group WeChat gia đình chồng/người yêu Trung. Bạn gửi lời chúc Tết Nguyên đán cho cô chú anh chị, kèm 1 emoji + 1 ảnh bánh chưng.",
    aiRole: "Cô chú trong group — reply lại",
    userRole: "Vân Trang — con dâu/em",
    targetPhrases: ["新年好", "祝", "身体健康", "万事如意", "红包"],
    difficulty: "easy",
  },
  {
    id: "extra-drama-fan-chat",
    titleVi: "Tâm sự với bạn về drama mới xem",
    titleZh: "和朋友聊新追的剧",
    contextVi:
      "Bạn vừa xem 1 tập drama hiện đại, nhắn bạn thân: kể plot tóm tắt, khen diễn viên, hỏi bạn xem chưa.",
    aiRole: "Bạn thân — fan drama như bạn",
    userRole: "Vân Trang — chia sẻ",
    targetPhrases: ["这剧", "好看", "颜值", "你看了吗", "求安利"],
    difficulty: "easy",
  },
  {
    id: "extra-travel-buddy",
    titleVi: "Phối hợp lịch với bạn đồng hành",
    titleZh: "和旅伴沟通行程",
    contextVi:
      "Chuyến Thượng Hải, bạn nhắn bạn đồng hành dời tour Cố Cung từ 8h sang 9h vì hôm nay dậy không nổi. Đề xuất ăn sáng lúc 8:30 ở khách sạn.",
    aiRole: "Bạn đồng hành — linh hoạt",
    userRole: "Vân Trang — đề xuất dời lịch",
    targetPhrases: ["要不", "改到", "九点", "早餐", "酒店"],
    difficulty: "easy",
  },
  {
    id: "extra-period-drama-court",
    titleVi: "Đóng cảnh quý phi trong phim cung đình",
    titleZh: "扮演宫廷剧中的妃嫔",
    contextVi:
      "Bạn đóng vai quý phi nhỏ mới vào cung, gặp quý phi lớn tuổi đến chào. Đáp lễ khiêm tốn, cáo lui sau 2-3 lượt thoại.",
    aiRole: "Quý phi lớn tuổi mở chuyện",
    userRole: "Vân Trang — quý phi mới",
    targetPhrases: ["姐姐说哪里话", "妾身", "本宫", "告退"],
    difficulty: "medium",
  },
  {
    id: "extra-xiaohongshu-content",
    titleVi: "Lên ý tưởng caption Xiaohongshu",
    titleZh: "构思小红书文案",
    contextVi:
      "Bạn vừa ăn ở 1 quán dim sum hot ở Quảng Châu, muốn viết caption Xiaohongshu 5-6 câu khen, kèm hashtag + emoji.",
    aiRole: "Trợ lý content tư vấn",
    userRole: "Vân Trang — đăng bài",
    targetPhrases: ["yyds", "种草", "打卡", "颜值", "求推荐"],
    difficulty: "medium",
  },
  {
    id: "extra-news-summarize",
    titleVi: "Tóm tắt tin miễn visa cho mẹ",
    titleZh: "向妈妈转述免签新闻",
    contextVi:
      "Bạn vừa đọc tin TQ miễn visa cho VN. Kể lại cho mẹ (không quen từ formal) bằng 3-4 câu spoken đơn giản.",
    aiRole: "Mẹ — không quen tiếng Trung formal",
    userRole: "Vân Trang — tóm tắt",
    targetPhrases: ["听说", "免签", "15 天", "可以去"],
    difficulty: "medium",
  },
];

export function getAllRoleplayScenarios(): RoleplayScenario[] {
  const fromLessons = week1Lessons.map((l) => l.roleplayScenario);
  const fromRealFeed = realFeedItems.map((i) => i.roleplayScenario);
  const fromDomainPacks = domainPacks.flatMap((p) => p.roleplayScenarios);
  return [...fromLessons, ...fromRealFeed, ...fromDomainPacks, ...extraRoleplayScenarios];
}

export function findScenario(id: string): RoleplayScenario | undefined {
  return getAllRoleplayScenarios().find((s) => s.id === id);
}
