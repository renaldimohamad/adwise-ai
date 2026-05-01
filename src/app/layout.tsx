import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AdWise AI - Enterprise Ads Optimization",
    template: "%s | AdWise AI"
  },
  description: "Next-generation campaign analysis with Neural Engine 2.5. Achieve 10x marketing efficiency with data-driven AI diagnostics.",
  keywords: ["Ads Optimization", "AI Ads Advisor", "Campaign Analysis", "Digital Marketing AI", "AdWise AI", "SaaS Analytics"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "AdWise AI - Neural Campaign Optimization",
    description: "Transform your marketing data into actionable growth strategies using AdWise Neural Engine.",
    url: "https://campaign-genius.vercel.app",
    siteName: "AdWise AI",
    locale: "en_US",
    type: "website",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-foreground antialiased`}>
        <Providers>
          <Toaster position="top-right" richColors closeButton />
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
