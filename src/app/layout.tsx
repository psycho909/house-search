import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "跨站找房",
  description: "以固定示範資料呈現跨房屋交易網搜尋流程。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
