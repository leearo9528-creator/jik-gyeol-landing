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
  title: "직결 - 수수료 0원 행사 매칭 플랫폼",
  description: "",
  openGraph: {
    title: "직결 - 수수료 0원 행사 매칭 플랫폼",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "직결 - 수수료 0원 행사 매칭 플랫폼",
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
