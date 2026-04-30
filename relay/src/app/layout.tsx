import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Relay | Universal Notification API & Routing Engine",
  description: "Enterprise-grade notification routing for WhatsApp, Telegram, Discord, and Slack. Built for developers who need reliable, multi-channel delivery.",
  keywords: ["Notification API", "WhatsApp API", "Telegram Bot", "Discord Webhooks", "Notification Routing", "Developer Tools", "Real-time Alerts", "Relay Notify"],
  authors: [{ name: "Aether Digital" }],
  openGraph: {
    title: "Relay | Universal Notification API",
    description: "Route your alerts to any platform with a single API call.",
    url: "https://relay-notify.com",
    siteName: "Relay",
    images: [
      {
        url: "/og-image.png", // We should ensure this exists later or use a default
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Relay | Universal Notification API",
    description: "Multi-channel notification routing made simple.",
    images: ["/og-image.png"],
  },
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
      <body className={`${inter.variable} ${outfit.variable} font-sans`} suppressHydrationWarning>
        <div className="hero-glow top-0 left-0" />
        <div className="hero-glow bottom-0 right-0 opacity-50" />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
