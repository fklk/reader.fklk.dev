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
                    className={`${inter.className} min-h-screen container flex justify-center`}
                >
                    {children}
                </body>
            </TRPCReactProvider>
        </html>
    );
}
