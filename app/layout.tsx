import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chinese Tutor Vân Trang",
  description:
    "Học tiếng Trung cho du lịch, phim ảnh, mạng xã hội và đọc hiểu đời sống Trung Quốc.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="font-sans bg-canvas text-ink-900">
        <NavBar />
        <main className="mx-auto max-w-editorial">{children}</main>
      </body>
    </html>
  );
}
