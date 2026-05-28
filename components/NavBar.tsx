"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Main nav for Vân Trang's lifestyle app. Labels are reoriented from
// the business app: WeChat Coach → "Chat Coach", Domain Packs → "Chủ đề",
// Lyrics Mode → "Lời bài hát". Routes stay the same to avoid renaming
// pages.
const ITEMS = [
  { href: "/", label: "Trang chủ" },
  { href: "/session/today", label: "Hôm nay" },
  { href: "/real-feed", label: "Khám phá" },
  { href: "/wechat-coach", label: "Chat Coach" },
  { href: "/roleplay", label: "Hội thoại" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/domain-packs", label: "Chủ đề" },
  { href: "/lyrics-mode", label: "Lời bài hát" },
  { href: "/mistakes", label: "Mistakes" },
  { href: "/progress", label: "Tiến độ" },
];

export function NavBar() {
  const pathname = usePathname() || "/";
  return (
    <nav className="sticky top-0 z-30 bg-canvas border-b border-hairline">
      <div className="mx-auto max-w-editorial h-16 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-ink-900 text-white flex items-center justify-center text-base font-bold zh">
            云
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-bold tracking-[0.3px]">Chinese Tutor Vân Trang</div>
            <div className="text-[11px] font-light text-muted">Du lịch · Phim · Mạng xã hội</div>
          </div>
        </Link>
        <ul className="hidden md:flex items-center gap-4 lg:gap-5 xl:gap-6 overflow-x-auto">
          {ITEMS.map((it) => {
            const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
            return (
              <li key={it.href} className="shrink-0">
                <Link
                  href={it.href}
                  className={`text-[13px] lg:text-[14px] tracking-[0.3px] transition whitespace-nowrap ${
                    active
                      ? "text-ink-900 font-bold"
                      : "text-muted font-normal hover:text-ink-900"
                  }`}
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Mobile horizontal scroll nav */}
      <ul className="md:hidden flex items-center gap-5 overflow-x-auto px-6 pb-3 border-t border-hairline pt-2">
        {ITEMS.map((it) => {
          const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          return (
            <li key={it.href} className="shrink-0">
              <Link
                href={it.href}
                className={`text-[13px] tracking-[1.5px] uppercase ${
                  active ? "text-ink-900 font-bold border-b-2 border-ink-900 pb-1" : "text-muted font-bold"
                }`}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
