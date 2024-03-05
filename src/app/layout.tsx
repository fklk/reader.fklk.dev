import type { Metadata } from "next";
import { Inter, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/react";

const inter = Inter({ subsets: ["latin"] });
const beVietnamPro = Be_Vietnam_Pro({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
