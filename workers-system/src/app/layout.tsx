import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Workers Management System",
    description: "Manage tasks, claims, and payroll",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="bg-gray-900">
            <body className={`${inter.className} bg-gray-900 m-0 p-0`}>{children}</body>
        </html>
    );
}
