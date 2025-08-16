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
