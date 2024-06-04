import type { Metadata } from "next";
import "../globals.css";

import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Home | Coin Share",
  description: "Coin Share, app to manage and settle group transactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
