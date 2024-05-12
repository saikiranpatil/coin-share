import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Transactions | Coin Share",
    description: "Transactions | Coin Share : All the Transactions made by you.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}