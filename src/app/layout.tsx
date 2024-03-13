import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ReadR",
    description: "Read what you enjoy, publish what you create.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <TRPCReactProvider>
                <body
                    className={`${inter.className} min-h-screen px-24 flex relative left-1/2 -translate-x-1/2`}
                >
                    {children}
                </body>
            </TRPCReactProvider>
        </html>
    );
}
