import "./globals.scss";
import { Inter } from "next/font/google";

import { UserProvider } from "@auth0/nextjs-auth0/client";

import Header from "@/components/base/Header/Header";
import { RestaurantProvider } from "@/contexts/RestaurantContext";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });
const siteName = 'Swipe Eats"';
const description =
  "SwipeEats はレストランを簡単に探せる、無料のWebアプリケーションです。スワイプ操作で簡単にあなたの好みに合ったレストランを見つけることができます。";
const url = "https://www.swipeeats.net/";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s - ${siteName}`,
  },
  description,
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    site: "@GorillaSwe",
    creator: "@GorillaSwe",
  },
  alternates: {
    canonical: url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <link rel="icon" href="/images/favicon.ico" sizes="any" />
      <UserProvider>
        <body className={inter.className}>
          <Header />
          <main>
            <RestaurantProvider>{children}</RestaurantProvider>
          </main>
        </body>
      </UserProvider>
    </html>
  );
}
