import "./globals.scss";
import { Inter } from "next/font/google";

import { UserProvider } from "@auth0/nextjs-auth0/client";

import Header from "@/components/base/Header/Header";
import { RestaurantProvider } from "@/contexts/RestaurantContext";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swipe Eats",
  description: "Swipe Eats",
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
