import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Groups | Coin Share",
    description: "Groups | Coin Share : All the Groups ypu are part of.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}