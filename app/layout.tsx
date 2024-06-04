import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import AllProviders from "@/components/providers/AllProviders";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        <AllProviders>
          <div className="flex min-h-screen w-full flex-col bg-gray-100 dark:bg-gray-900">
            {children}
          </div>
        </AllProviders>
      </body>
    </html>
  );
}