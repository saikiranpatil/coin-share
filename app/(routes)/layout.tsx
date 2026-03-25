import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AIChat from "@/components/ai/AIChat";

export const metadata: Metadata = {
  title: "CoinShare",
  description: "Split expenses with your group",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <AIChat />
    </div>
  );
}