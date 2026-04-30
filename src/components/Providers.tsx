"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
          {children}
        </SessionProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
