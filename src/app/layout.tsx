import "./globals.scss";
import { Inter } from "next/font/google";

import { UserProvider } from "@auth0/nextjs-auth0/client";

import AuthNavbar from "@/components/AuthNavbar";
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
    <html lang="en">
      <UserProvider>
        <body className={inter.className}>
          <AuthNavbar />
          <RestaurantProvider>{children}</RestaurantProvider>
        </body>
      </UserProvider>
    </html>
  );
}
