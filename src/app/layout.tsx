/* eslint-disable @next/next/next-script-for-ga */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import FooterNav from "@/components/FooterNav";
import Analytics from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mamelog-84649.web.app"),
  title: {
    default: "まめログ",
    template: "%s | まめログ",
  },
  description:
    "まめログは、購入したコーヒー豆の情報をスマホで手軽に記録・管理できるモバイルファーストなアプリです。",
  applicationName: "まめログ",
  keywords: [
    "まめログ",
    "コーヒー豆管理",
    "コーヒー記録",
    "焙煎度メモ",
    "coffee log",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "まめログ",
    title: "まめログ",
    description:
      "お気に入りの珈琲豆を記録・管理。購入日、生産国、焙煎度、価格などをまとめて保存できます。",
    url: "https://mamelog-84649.web.app",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "まめログのアプリアイコン",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "まめログ",
    description:
      "お気に入りの珈琲豆を記録・管理。購入日、生産国、焙煎度、価格などをまとめて保存できます。",
    images: ["/icons/icon-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-EQGH0WDSTD"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EQGH0WDSTD', { page_path: window.location.pathname });
            `,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4B3621" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-20`} // フッター分余白を確保
      >
        <Analytics />
        <Link className="flex justify-center mt-3 pb-3 border-b" href="/">
          <Image
            src="/icons/icon-512x512.png"
            alt="まめログ"
            width={40}
            height={40}
            priority
          />
        </Link>
        {children}

        <FooterNav></FooterNav>
      </body>
    </html>
  );
}
