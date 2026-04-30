"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  BarChart3,
  LogOut,
  Moon,
  Sun,
  UserIcon,
  Languages,
  ChevronDown,
  LayoutDashboard,
  History as HistoryIcon,
  Menu,
  X
} from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, dict } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleLanguage = (lang: "en" | "id") => {
    setLanguage(lang);
    setLangOpen(false);
  };

  if (!mounted) {
    return (
      <nav className="fixed w-full top-0 z-50 bg-white/80 dark:bg-black/60 backdrop-blur-xl border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
            <BarChart3 className="w-6 h-6" />
            <span>AdWise AI</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/80 dark:bg-black/10 backdrop-blur-xl border-b border-border/50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5 group group-hover:opacity-90 transition-all">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="bg-primary/10 p-1.5 rounded-lg border border-primary/20"
          >
            <BarChart3 className="w-6 h-6 text-primary" />
          </motion.div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AdWise AI
          </span>
        </Link>

        <div className="flex items-center gap-4 lg:gap-8">
          {session ? (
            <div className="flex items-center gap-4 lg:gap-8">
              <div className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="flex items-center gap-2 text-foreground/80 hover:text-primary font-bold transition-all hover:-translate-y-0.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{dict.nav.dashboard}</span>
                </Link>
                <Link href="/history" className="flex items-center gap-2 text-foreground/80 hover:text-primary font-bold transition-all hover:-translate-y-0.5">
                  <HistoryIcon className="w-4 h-4" />
                  <span>{dict.nav.history}</span>
                </Link>
              </div>
              <div className="h-6 w-px bg-border hidden md:block"></div>
            </div>
          ) : null}

          <div className="flex items-center gap-2 lg:gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
              >
                <Languages className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">{language}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-40 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-50 p-1"
                  >
                    {[
                      { id: 'en', label: 'English' },
                      { id: 'id', label: 'Indonesia' }
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => toggleLanguage(lang.id as 'en' | 'id')}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${language === lang.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-foreground/5 text-foreground/70"}`}
                      >
                        <span>{lang.label}</span>
                        {language === lang.id && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-3 text-foreground/60 hover:text-primary hover:bg-primary/10 rounded-xl transition-all group"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-accent group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
              )}
            </button>

            {session ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3 text-[10px] text-foreground/80 bg-foreground/[0.03] border border-border px-4 py-2.5 rounded-xl font-black uppercase tracking-widest">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <UserIcon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="max-w-[120px] truncate">{session.user.email?.split("@")[0]}</span>
                </div>

                <button
                  onClick={async () => {
                    await signOut({ redirect: false });
                    window.location.href = "/";
                  }}
                  className="p-3 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  title={dict.nav.logout}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link href="/auth" className="hidden sm:block text-sm font-semibold text-foreground/70 hover:text-primary transition-colors px-2">
                  {dict.nav.login}
                </Link>
                <Link
                  href="/auth?mode=register"
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_8px_20px_-6px_rgba(var(--primary-rgb),0.5)] hover:shadow-[0_8px_25px_-4px_rgba(var(--primary-rgb),0.6)] active:scale-95"
                >
                  {dict.nav.signup}
                </Link>
              </div>
            )}
          </div>
          
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2.5 text-foreground/60 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-white dark:bg-black overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {session && (
                <div className="space-y-4">
                  <Link 
                    href="/dashboard" 
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-foreground/[0.03] text-foreground font-black uppercase tracking-widest text-xs"
                  >
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    {dict.nav.dashboard}
                  </Link>
                  <Link 
                    href="/history" 
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-foreground/[0.03] text-foreground font-black uppercase tracking-widest text-xs"
                  >
                    <HistoryIcon className="w-4 h-4 text-primary" />
                    {dict.nav.history}
                  </Link>
                </div>
              )}
              
              {!session && (
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/auth" 
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center p-4 rounded-2xl bg-foreground/[0.03] text-foreground font-bold text-sm"
                  >
                    {dict.nav.login}
                  </Link>
                  <Link 
                    href="/auth?mode=register" 
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center p-4 rounded-2xl bg-primary text-white font-bold text-sm"
                  >
                    {dict.nav.signup}
                  </Link>
                </div>
              )}

              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="p-3 bg-foreground/[0.03] rounded-xl text-foreground/60"
                    >
                      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <div className="flex gap-2">
                       {['en', 'id'].map((lang) => (
                         <button
                           key={lang}
                           onClick={() => setLanguage(lang as any)}
                           className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${language === lang ? 'bg-primary text-white' : 'bg-foreground/[0.03] text-foreground/40'}`}
                         >
                           {lang}
                         </button>
                       ))}
                    </div>
                 </div>
                 {session && (
                    <button
                      onClick={async () => {
                        await signOut({ redirect: false });
                        window.location.href = "/";
                      }}
                      className="p-3 text-red-500 bg-red-500/10 rounded-xl"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
