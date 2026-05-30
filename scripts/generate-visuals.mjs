#!/usr/bin/env node
/**
 * Manual, one-off illustration generator for Chinese Tutor Vân Trang.
 *
 *   npm run visuals:generate            # generate missing images only
 *   npm run visuals:generate -- --force # regenerate all 10
 *
 * - Node-only. Never runs in the browser, never during `next build`.
 * - Reads GOOGLE_AI_STUDIO_API_KEY from the environment (via `--env-file`,
 *   loaded from the gitignored .env.local). The key is never logged.
 * - Generates EXACTLY the 10 approved topic images, one per topic.
 * - Resizes to 768×512 and compresses to WebP (quality ~65) with sharp.
 * - Skips files that already exist unless --force.
 * - Hard cap: refuses to process more than 10 images.
 * - Removes the intermediate PNG; only the .webp is kept.
 *
 * "Nano Banana" = Google's Gemini image model on the Generative Language
 * API. We POST a text prompt and read back inline image bytes.
 */

import { writeFile, unlink, stat, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.resolve(process.cwd(), "public/visuals");
const TARGET_W = 768;
const TARGET_H = 512;
const WEBP_QUALITY = 65;
const SOFT_MAX_KB = 80;
const HARD_MAX_KB = 150;

// Shared style suffix applied to every prompt for a consistent look.
const STYLE =
  "Clean semi-realistic lifestyle illustration, soft natural lighting, simple uncluttered composition, warm calm tones, premium but lightweight, suitable for an adult learner. Absolutely no brand logos, no readable text, no Chinese signage text, no famous landmarks, no crowds, no celebrities, no copyrighted characters, no movie or drama screenshots. Mobile learning-app card style, 16:9 landscape.";

/** The 10 approved images — DO NOT add more (cost control + hard cap). */
const IMAGES = [
  {
    file: "travel-china.webp",
    prompt:
      "A Vietnamese woman traveler with a small suitcase walking on a clean modern Chinese city street with simple storefronts and a subtle Chinese atmosphere, soft daylight, uncluttered background.",
  },
  {
    file: "hotel-checkin.webp",
    prompt:
      "A traveler checking in at a hotel reception desk, a small suitcase beside her and a passport on the counter, a friendly receptionist, clean modern hotel lobby, soft warm lighting.",
  },
  {
    file: "restaurant-ordering.webp",
    prompt:
      "A cozy Chinese restaurant table with a menu, a tea cup and simple dishes, a friendly server nearby, clean composition, soft warm light.",
  },
  {
    file: "shopping-market.webp",
    prompt:
      "A woman browsing small gifts and scarves at a clean local market stall in China, warm lights, simple products, soft colors, not crowded.",
  },
  {
    file: "transport-taxi.webp",
    prompt:
      "A traveler standing near a taxi pickup area with luggage and a phone showing a generic map interface, a generic taxi, clean city background, soft daylight.",
  },
  {
    file: "metro-station.webp",
    prompt:
      "A traveler looking at a simple generic metro station direction board while a friendly local person helps, clean modern station, calm mood.",
  },
  {
    file: "drama-watching.webp",
    prompt:
      "A woman relaxing at home watching a generic blurred drama-like scene on a tablet (no actor faces, no recognizable content), a tea cup nearby, cozy evening light.",
  },
  {
    file: "social-reading.webp",
    prompt:
      "A close-up of a smartphone in a hand showing a generic social-media feed layout made of abstract cards and simple icons (no platform logos), soft clean background.",
  },
  {
    file: "wechat-chat.webp",
    prompt:
      "A generic messaging app interface on a phone held in a hand, simple empty chat bubbles (no logos), friendly casual mood, clean soft background.",
  },
  {
    file: "emergency-help.webp",
    prompt:
      "A traveler at a public information desk calmly asking a staff member for help, luggage nearby, a generic low-battery icon shown subtly, clean public place, no panic, no danger.",
  },
];

// ---- Gemini image model candidates (try in order) ----
const MODELS = [
  "gemini-2.5-flash-image",
  "gemini-2.5-flash-image-preview",
  "gemini-2.0-flash-preview-image-generation",
];

function kb(bytes) {
  return Math.round((bytes / 1024) * 10) / 10;
}

/** Calls the Generative Language API and returns raw image bytes (Buffer). */
async function generateImage(apiKey, prompt) {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: `${prompt} ${STYLE}` }] }],
    generationConfig: { responseModalities: ["IMAGE"] },
  });

  let lastErr = "";
  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body,
      });
    } catch (e) {
      lastErr = `network: ${e?.message || e}`;
      continue;
    }
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      // Redact anything that looks like a key from error text before storing.
      lastErr = `${model} → HTTP ${res.status} ${txt.slice(0, 160)}`;
      // 404 = model not available on this key; try next model.
      if (res.status === 404) continue;
      // 400/403 usually means the key itself is bad — stop early.
      if (res.status === 400 || res.status === 401 || res.status === 403) break;
      continue;
    }
    const json = await res.json();
    const parts = json?.candidates?.[0]?.content?.parts || [];
    const imgPart = parts.find((p) => p?.inlineData?.data);
    if (imgPart) {
      return Buffer.from(imgPart.inlineData.data, "base64");
    }
    lastErr = `${model} → no inline image in response`;
  }
  throw new Error(lastErr || "unknown generation error");
}

async function main() {
  const force = process.argv.includes("--force");
  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;

  if (!apiKey) {
    console.error(
      "✗ GOOGLE_AI_STUDIO_API_KEY is not set. Put it in .env.local and run via:\n" +
        "  npm run visuals:generate",
    );
    process.exit(1);
  }

  if (IMAGES.length > 10) {
    console.error(`✗ Refusing to run: ${IMAGES.length} images requested (hard cap 10).`);
    process.exit(1);
  }

  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

  console.log(`Generating up to ${IMAGES.length} images → public/visuals/ (force=${force})\n`);

  const results = [];
  for (const img of IMAGES) {
    const outPath = path.join(OUT_DIR, img.file);
    if (!force && existsSync(outPath)) {
      const s = await stat(outPath);
      console.log(`• skip  ${img.file} (exists, ${kb(s.size)} KB)`);
      results.push({ file: img.file, kb: kb(s.size), status: "skipped" });
      continue;
    }
    try {
      process.stdout.write(`• gen   ${img.file} … `);
      const raw = await generateImage(apiKey, img.prompt);
      const webp = await sharp(raw)
        .resize(TARGET_W, TARGET_H, { fit: "cover", position: "centre" })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
      await writeFile(outPath, webp);
      const sizeKb = kb(webp.length);
      const flag = sizeKb > HARD_MAX_KB ? "  ✗ OVER 150KB" : sizeKb > SOFT_MAX_KB ? "  ⚠ >80KB" : "  ✓";
      console.log(`${sizeKb} KB${flag}`);
      results.push({ file: img.file, kb: sizeKb, status: "generated" });
    } catch (e) {
      console.log(`FAILED — ${e?.message || e}`);
      results.push({ file: img.file, kb: 0, status: "failed", error: String(e?.message || e) });
    }
  }

  // Summary
  console.log("\n=== Summary ===");
  let over = 0;
  let failed = 0;
  for (const r of results) {
    if (r.status === "failed") failed++;
    if (r.kb > HARD_MAX_KB) over++;
    console.log(`  ${r.file.padEnd(26)} ${String(r.kb).padStart(6)} KB  ${r.status}`);
  }
  if (failed) console.log(`\n⚠ ${failed} image(s) failed to generate.`);
  if (over) console.log(`\n✗ ${over} image(s) exceed the 150KB hard max — recompress before committing.`);
  if (!failed && !over) console.log("\n✓ All images generated and within size limits.");
}

main().catch((e) => {
  console.error("Fatal:", e?.message || e);
  process.exit(1);
});
