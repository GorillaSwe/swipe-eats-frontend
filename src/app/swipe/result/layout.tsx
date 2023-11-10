import { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Swipe Eats",
  description: "Swipe Eats",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
