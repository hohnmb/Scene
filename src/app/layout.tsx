import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Script from "next/script";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SCENE — 이번 달, 놓치지 말아야 할 공연과 전시",
  description: "한국문화정보원 공공데이터 API를 활용한 공연 전시 큐레이션 웹 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=clusterer&autoload=false`}
          strategy="beforeInteractive"
        />
        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
