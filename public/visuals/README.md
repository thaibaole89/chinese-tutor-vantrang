# Vân Trang lifestyle illustrations (`public/visuals/`)

10 semi-realistic .webp images — travel/lifestyle/daily, no brands, no
celebrities, no copyrighted characters or drama screenshots.

## Constraints
- Format: `.webp` only
- Target: under 80 KB per image
- Hard max: 150 KB per image
- Aspect: 16:9 (1280×720 max) or 4:3 for square cards
- Style: clean lifestyle photo feel, semi-realistic, warm tones
- No real brand logos / signage, no readable copyrighted characters,
  no celebrities, no movie / drama screenshots, no panic / gore.

## File list + prompts

Use these prompts with any image gen model (Gemini Nano Banana, DALL-E,
SDXL, etc.). Save output to the exact filename listed.

| Filename | Prompt |
|---|---|
| `travel-china.webp` | Asian woman traveler with rolling suitcase walking on a clean Chinese city street, subtle generic signs in simplified Chinese (no readable brand), warm afternoon light, semi-realistic lifestyle photo, no celebrity likeness |
| `hotel-checkin.webp` | Female traveler at a generic hotel reception, passport and small suitcase visible on counter, warm lobby lighting, friendly receptionist (back of head only), no brand logos, semi-realistic |
| `restaurant-ordering.webp` | Small cozy Chinese restaurant table from above: open menu, teapot, two ceramic bowls of food, chopsticks, no brand or readable text, soft warm lighting, semi-realistic |
| `shopping-market.webp` | Night-market stall with silk scarves, small gifts, paper lanterns, warm string lights, no brand signage, semi-realistic lifestyle |
| `transport-taxi-train.webp` | Generic high-speed-rail platform or taxi rank exterior, clean signage in simplified Chinese (no readable real route names), traveler with suitcase from behind, late afternoon, semi-realistic |
| `airport-checkin.webp` | Airport check-in counter, suitcase + boarding-pass-style paper, no airline logo, soft modern terminal interior, traveler from behind, semi-realistic |
| `drama-watching.webp` | Asian woman in cozy living room watching a tablet showing a generic costume-drama scene silhouette (no actor face), tea cup on side table, warm evening lighting, semi-realistic |
| `social-media-reading.webp` | Phone in hand showing a generic Chinese-style vertical social feed mock-up (no platform logo, no real handles), café table background, semi-realistic |
| `book-news-reading.webp` | Asian woman reading a Chinese book or newspaper at home with a cup of tea, calm bright morning light, semi-realistic lifestyle photo |
| `emergency-help.webp` | Calm safe scene: traveler at a generic information desk at a station, helpful staff (back of head only), no panic, no gore, soft daylight, semi-realistic |

## Vietnamese alt text (used in UI)

- `travel-china.webp` → "Minh hoạ du lịch ở Trung Quốc"
- `hotel-checkin.webp` → "Minh hoạ nhận phòng khách sạn"
- `restaurant-ordering.webp` → "Minh hoạ gọi món nhà hàng"
- `shopping-market.webp` → "Minh hoạ mua sắm ở chợ đêm"
- `transport-taxi-train.webp` → "Minh hoạ taxi và tàu cao tốc"
- `airport-checkin.webp` → "Minh hoạ check-in sân bay"
- `drama-watching.webp` → "Minh hoạ xem phim Trung Quốc"
- `social-media-reading.webp` → "Minh hoạ đọc mạng xã hội Trung Quốc"
- `book-news-reading.webp` → "Minh hoạ đọc báo và sách Trung Quốc"
- `emergency-help.webp` → "Minh hoạ hỏi giúp đỡ ở quầy thông tin"

## Compression checklist (after generation)

```bash
# Resize + re-encode to hit <80 KB
cwebp -q 75 -resize 1280 0 input.png -o public/visuals/travel-china.webp

# Verify size
ls -lh public/visuals/*.webp
```
