import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AI Career Coach - Your Path to Tech",
    description: "Personalized roadmap for transitioning into AI and tech roles in Canada",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className} suppressHydrationWarning>
        {children}
        <Toaster position="top-center" richColors />
        </body>
        </html>
    );
}