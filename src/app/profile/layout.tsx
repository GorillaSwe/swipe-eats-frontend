import { Metadata } from "next";
import "./layout.scss";

export const metadata: Metadata = {
  title: "Swipe Eats",
  description: "Swipe Eats",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="profileContainer">{children}</div>;
}
