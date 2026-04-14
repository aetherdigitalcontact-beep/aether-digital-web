import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Relay | Universal Notification API",
  description: "High-performance API for routing notifications to WhatsApp, Telegram, Discord, and more.",
  other: {
    "facebook-domain-verification": "syngclbgjpaz2r6z8a567u9sw61uot",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="hero-glow top-0 left-0" />
        <div className="hero-glow bottom-0 right-0 opacity-50" />
        {children}
      </body>
    </html>
  );
}
