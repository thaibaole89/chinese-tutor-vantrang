#!/usr/bin/env node
/**
 * Manual, one-off "example sentence breakdown" generator for Chinese Tutor
 * Vân Trang.
 *
 *   npm run breakdowns:generate
 *
 * - Node-only. Never runs in the browser, never during `next build`.
 * - Reads the EXISTING cleaned data (data/domainPacks.ts + data/week1Lessons.ts)
 *   as text and extracts every `exampleZh` sentence plus every vocab triple
 *   (hanzi / pinyin / vietnameseMeaning) to use as a Vietnamese gloss dict.
 * - Uses `pinyin-pro` (a devDependency, never shipped to the client) to add
 *   accurate pinyin to each word.
 * - Segments each example sentence with forward-maximum-matching against the
 *   combined dictionary (app vocab + a curated common-word list below), so the
 *   breakdown reuses words the learner is already studying.
 * - Writes a static, typed data file: data/exampleBreakdowns.ts.
 * - No API key, no network, no cost. Fully offline.
 *
 * Re-run this whenever example sentences in the source data change.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pinyin } from "pinyin-pro";

const ROOT = process.cwd();
const SOURCES = ["data/domainPacks.ts", "data/week1Lessons.ts"];
const OUT = "data/exampleBreakdowns.ts";

/**
 * Curated Vietnamese glosses for high-frequency / function words that don't
 * appear as their own vocab entries. Kept concise — these are chip hints, not
 * dictionary definitions. App vocab (below) overrides any overlap.
 */
const COMMON = {
  // pronouns
  "我": "tôi", "你": "bạn", "您": "ngài/anh-chị", "他": "anh ấy", "她": "cô ấy",
  "它": "nó", "我们": "chúng tôi", "咱们": "chúng ta", "你们": "các bạn",
  "他们": "họ", "她们": "họ (nữ)", "大家": "mọi người", "自己": "bản thân",
  // particles
  "的": "(trợ từ sở hữu)", "了": "(trợ từ hoàn thành)", "着": "(trợ từ tiếp diễn)",
  "过": "(trợ từ đã từng)", "吗": "(trợ từ nghi vấn)", "呢": "(trợ từ)",
  "吧": "(trợ từ đề nghị)", "啊": "(trợ từ)", "得": "(trợ từ bổ ngữ)",
  // common verbs
  "是": "là", "有": "có", "在": "ở / đang", "要": "muốn / cần", "想": "muốn / nghĩ",
  "能": "có thể", "会": "biết / sẽ", "可以": "có thể", "请": "mời / xin",
  "给": "cho / đưa", "帮": "giúp", "帮忙": "giúp đỡ", "去": "đi", "来": "đến / lại",
  "到": "đến / tới", "走": "đi / rời", "看": "xem / nhìn", "找": "tìm",
  "出示": "xuất trình", "带": "mang / dẫn", "用": "dùng", "做": "làm",
  "买": "mua", "卖": "bán", "吃": "ăn", "喝": "uống", "说": "nói",
  "知道": "biết", "叫": "gọi", "让": "để / cho phép", "等": "đợi",
  "坐": "ngồi / đi (xe)", "开": "mở / lái", "换": "đổi", "付": "trả (tiền)",
  "需要": "cần", "觉得": "cảm thấy", "喜欢": "thích", "希望": "hi vọng",
  "应该": "nên", "可能": "có thể / có lẽ", "麻烦": "làm phiền",
  // negation / adverbs
  "不": "không", "没": "không / chưa", "没有": "không có", "别": "đừng",
  "很": "rất", "太": "quá", "都": "đều", "也": "cũng", "还": "còn / vẫn",
  "就": "liền / thì", "再": "lại / nữa", "已经": "đã", "一起": "cùng nhau",
  "一下": "một chút", "一点": "một chút", "一点儿": "một chút", "比较": "tương đối",
  "真": "thật", "最": "nhất", "多": "nhiều / bao", "少": "ít", "马上": "ngay",
  // question words
  "什么": "cái gì", "怎么": "như thế nào", "怎么样": "thế nào", "哪": "nào",
  "哪里": "ở đâu", "哪儿": "ở đâu", "谁": "ai", "多少": "bao nhiêu", "几": "mấy",
  "为什么": "tại sao", "什么时候": "khi nào", "多久": "bao lâu",
  // demonstratives / place
  "这": "này", "那": "kia / đó", "这个": "cái này", "那个": "cái kia",
  "这里": "ở đây", "这儿": "ở đây", "那里": "ở đó", "那儿": "ở đó",
  "附近": "gần đây", "旁边": "bên cạnh", "这边": "bên này", "那边": "bên kia",
  "上面": "phía trên", "下面": "phía dưới", "里面": "bên trong", "外面": "bên ngoài",
  "前面": "phía trước", "后面": "phía sau", "对面": "đối diện",
  // time
  "现在": "bây giờ", "今天": "hôm nay", "明天": "ngày mai", "昨天": "hôm qua",
  "早上": "buổi sáng", "中午": "buổi trưa", "晚上": "buổi tối", "点": "giờ",
  "分": "phút", "分钟": "phút", "小时": "tiếng / giờ", "时候": "lúc / khi",
  // numbers / measure
  "一": "một", "二": "hai", "两": "hai", "三": "ba", "四": "bốn", "五": "năm",
  "六": "sáu", "七": "bảy", "八": "tám", "九": "chín", "十": "mười",
  "百": "trăm", "千": "nghìn", "零": "không", "个": "(lượng từ)", "块": "đồng (tiền)",
  "元": "đồng", "毛": "hào", "张": "(lượng từ: tờ)", "位": "(lượng từ: vị)",
  "杯": "cốc / ly", "瓶": "chai",
  // conjunctions / prepositions
  "和": "và", "跟": "với", "从": "từ", "把": "(giới từ 把)", "被": "bị",
  "对": "đối với / đúng", "为": "vì", "因为": "bởi vì", "所以": "cho nên",
  "但是": "nhưng", "可是": "nhưng", "如果": "nếu", "还是": "hay là / vẫn",
  "或者": "hoặc", "而且": "hơn nữa", "然后": "sau đó", "先": "trước",
  // greetings / polite
  "你好": "xin chào", "谢谢": "cảm ơn", "不客气": "đừng khách sáo",
  "对不起": "xin lỗi", "不好意思": "ngại quá / xin lỗi", "没关系": "không sao",
  "没事": "không sao", "请问": "xin hỏi", "再见": "tạm biệt",
  // common nouns
  "钱": "tiền", "人": "người", "东西": "đồ / thứ", "时间": "thời gian",
  "问题": "vấn đề", "先生": "ông / anh", "小姐": "cô", "师傅": "bác tài / thợ",
  "服务员": "nhân viên phục vụ", "地方": "nơi / chỗ", "路": "đường",
  "车": "xe", "票": "vé", "手机": "điện thoại",
};

/** Concise gloss for a chip: drop parenthetical asides and secondary senses. */
function conciseGloss(s) {
  let v = String(s).replace(/\s*[(（].*$/u, "").trim();
  // keep slash variants ("không/chưa") but drop comma-separated extra senses
  v = v.split(/\s*,\s*/u)[0].trim();
  return v || String(s).trim();
}

async function loadSources() {
  const vocab = {};
  const examples = new Set();
  for (const rel of SOURCES) {
    let txt;
    try {
      txt = await readFile(path.join(ROOT, rel), "utf8");
    } catch (e) {
      console.warn(`! could not read ${rel}: ${e?.message || e}`);
      continue;
    }
    // Order-tolerant within a single flat vocab object: capture hanzi then the
    // vietnameseMeaning that belongs to the same item (no `}` in between).
    const reVocab = /hanzi:\s*"([^"]+)"[^}]*?vietnameseMeaning:\s*"([^"]+)"/g;
    let m;
    while ((m = reVocab.exec(txt))) {
      const hanzi = m[1];
      const vi = m[2];
      if (!vocab[hanzi]) vocab[hanzi] = conciseGloss(vi);
    }
    const reEx = /exampleZh:\s*"([^"]+)"/g;
    while ((m = reEx.exec(txt))) {
      const s = m[1].trim();
      if (s) examples.add(s);
    }
  }
  return { vocab, examples: [...examples] };
}

/**
 * Build a breakdown: forward-maximum-matching segmentation over runs of Han
 * characters, with pinyin taken from the CONTEXT-AWARE sentence-level array
 * (so e.g. the aspect particle 了 resolves to "le", not the verb "liǎo").
 */
function buildBreakdown(sentence, dict, maxLen) {
  // One pinyin per Han char, in order, punctuation removed → aligns 1:1 with
  // the concatenation of the Han runs below.
  const charPys = pinyin(sentence, { type: "array", toneType: "symbol", nonZh: "removed" });
  const runs = sentence.split(/[^\p{Script=Han}]+/u).filter(Boolean);
  const tokens = [];
  let p = 0; // pointer into charPys
  for (const run of runs) {
    let i = 0;
    while (i < run.length) {
      let w = null;
      let vi;
      for (let L = Math.min(maxLen, run.length - i); L >= 1; L--) {
        const sub = run.slice(i, i + L);
        if (Object.prototype.hasOwnProperty.call(dict, sub)) {
          w = sub;
          vi = dict[sub];
          break;
        }
      }
      if (!w) w = run[i]; // unknown single char — pinyin only, no gloss
      const len = w.length;
      const tok = { w, py: charPys.slice(p, p + len).join("") };
      if (vi) tok.vi = vi;
      // 了 is the aspect/modal particle only when read "le"; as "liǎo" it's the
      // verb 了 (e.g. 了结) — drop the particle gloss so it isn't mislabeled.
      if (w === "了" && tok.py !== "le") delete tok.vi;
      tokens.push(tok);
      i += len;
      p += len;
    }
  }
  return { pinyin: tokens.map((t) => t.py).join(" "), tokens };
}

async function main() {
  const { vocab, examples } = await loadSources();
  console.log(
    `Loaded ${examples.length} example sentences, ${Object.keys(vocab).length} vocab glosses.`,
  );
  if (examples.length === 0) {
    console.error("✗ No example sentences extracted — aborting (check source format).");
    process.exit(1);
  }

  // Combined dictionary: curated common words, then app vocab overrides.
  const dict = { ...COMMON };
  for (const [h, vi] of Object.entries(vocab)) dict[h] = vi;
  const maxLen = Math.min(6, Math.max(...Object.keys(dict).map((k) => k.length)));

  const breakdowns = {};
  let totalTok = 0;
  let glossedTok = 0;
  for (const zh of examples.sort()) {
    const bd = buildBreakdown(zh, dict, maxLen);
    breakdowns[zh] = bd;
    for (const t of bd.tokens) {
      totalTok++;
      if (t.vi) glossedTok++;
    }
  }

  const pct = totalTok ? Math.round((glossedTok / totalTok) * 1000) / 10 : 0;
  // Compact: one sentence per line — small bundle, still diff-friendly.
  const entries = Object.keys(breakdowns)
    .map((zh) => `  ${JSON.stringify(zh)}: ${JSON.stringify(breakdowns[zh])},`)
    .join("\n");
  const body = `{\n${entries}\n}`;
  const file = `// AUTO-GENERATED by scripts/generate-breakdowns.mjs — DO NOT EDIT BY HAND.
// Regenerate with:  npm run breakdowns:generate
//
// Per-example pinyin + word-by-word Vietnamese breakdown for the "Ví dụ"
// section of the Card-First Home. Pinyin via pinyin-pro (dev-only); Vietnamese
// glosses from existing app vocabulary + a curated common-word list.

export interface BreakdownToken {
  /** the word (one or more hanzi) */
  w: string;
  /** pinyin with tone marks */
  py: string;
  /** concise Vietnamese gloss; omitted when unknown */
  vi?: string;
}

export interface ExampleBreakdown {
  /** word-grouped pinyin for the whole sentence */
  pinyin: string;
  tokens: BreakdownToken[];
}

export const exampleBreakdowns: Record<string, ExampleBreakdown> = ${body};

/** Look up the breakdown for an example sentence (exact match on the hanzi). */
export function breakdownFor(zh: string | undefined | null): ExampleBreakdown | null {
  if (!zh) return null;
  return exampleBreakdowns[zh] ?? null;
}
`;

  await writeFile(path.join(ROOT, OUT), file, "utf8");
  console.log(
    `✓ Wrote ${OUT}: ${examples.length} sentences, ${totalTok} tokens, ${glossedTok} glossed (${pct}% coverage).`,
  );
}

main().catch((e) => {
  console.error("Fatal:", e?.message || e);
  process.exit(1);
});
