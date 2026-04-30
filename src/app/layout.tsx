import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AdWise AI - Advanced Ads Optimization Advisor",
    template: "%s | AdWise AI"
  },
  description: "AI-powered advertising campaign analysis and optimization advisor. Eliminate guesswork with enterprise-grade neural insights.",
  keywords: ["Ads Optimization", "AI Ads Advisor", "Campaign Analysis", "Digital Marketing AI", "AdWise AI"],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "AdWise AI - Advanced Ads Optimization Advisor",
    description: "Master your ads with AI Intelligence. Enterprise-grade insights that scale your performance instantly.",
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
