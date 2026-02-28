import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "직행 - 수수료 0원 행사 매칭 플랫폼",
  description: "에이전시 배불리기는 이제 끝. 행사 사장님을 위한 수수료 0원 매칭 서비스 직행",
  openGraph: {
    title: "직행 - 수수료 0원 행사 매칭 플랫폼",
    description: "사장님, 수수료 뜯기지 마세요. '직행' 사전등록 중입니다!",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "직행 - 수수료 0원 행사 매칭 플랫폼",
    description: "사장님, 수수료 뜯기지 마세요. '직행' 사전등록 중입니다!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
