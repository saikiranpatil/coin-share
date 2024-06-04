import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Transactions | Coin Share",
    description: "Page listing all the transactions made by you.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}