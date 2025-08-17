import { AuthProvider } from "@/src/components/AuthProvider";
import type { Metadata } from "next";
import { Mochiy_Pop_One } from "next/font/google";
import "./globals.css";

const mochiyPopOne = Mochiy_Pop_One({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ピクプロ！",
  description: "ひらめきで、お題の絵を完全再現！",
  openGraph: {
    type: "website",
    title: "ピクプロ！",
    description:
      "ピクプロは、ひらめきでお題の絵を完全再現するゲームです。友達と一緒に楽しもう！",
    images: [
      {
        url: "https://pic-pro-front--picture-prompt-game.asia-east1.hosted.app/ogp/thumbnail.png", // 🌟 静的画像の指定
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: "ピクプロ！",
    description:
      "ピクプロは、ひらめきでお題の絵を完全再現するゲームです。友達と一緒に楽しもう！",
    site: "https://pic-pro-front--picture-prompt-game.asia-east1.hosted.app/",
    images: {
      url: "https://pic-pro-front--picture-prompt-game.asia-east1.hosted.app/ogp/thumbnail.png",
      type: "image/png",
      width: 1200,
      height: 630,
    },
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${mochiyPopOne.className} bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-300 min-h-screen`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
