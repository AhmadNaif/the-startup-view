import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "The Startup View",
  description: "Your gateway to startup insights and services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Navbar />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
