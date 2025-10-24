import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { MatomoAnalytics } from "@/components/matomo-analytics";
import { CopyNotificationProvider } from "@/components/copy-notification-provider";
import { Navbar } from "@/components/navbar";

import "./globals.css";

const siteUrl = process.env.SITE_URL;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Borderlands 4 SHiFT codes",
  description:
    "Live Borderlands 4 SHiFT codes with expiry tracking, exports, and notifications.",
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider>
          <CopyNotificationProvider>
            <Navbar />
            <MatomoAnalytics />
            {children}
          </CopyNotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
