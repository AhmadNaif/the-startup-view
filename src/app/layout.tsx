import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | The Startup View",
    default: "The Startup View",
  },
  description: "Your gateway to startup insights and services",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={inter.className}>
      <body className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
