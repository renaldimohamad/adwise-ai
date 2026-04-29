import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { BarChart3, Link, LogOut, Moon, Sun, UserIcon } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, dict } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="glass px-6 py-4 fixed w-full top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <BarChart3 className="w-6 h-6" />
          </motion.div>
          <span>AdWise AI</span>
        </Link>

        <div className="flex items-center gap-6">
          {session ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-foreground/70 hover:text-primary font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/history" className="text-foreground/70 hover:text-primary font-medium transition-colors">
                  History
                </Link>
              </div>
              <div className="h-6 w-px bg-border hidden md:block"></div>

              <div className="flex items-center gap-3">
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 text-foreground/50 hover:bg-card/50 rounded-xl transition-all"
                  >
                    {theme === "dark" ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5" />}
                  </button>
                )}

                <div className="flex items-center gap-2 text-sm text-foreground/70 bg-card px-3 py-1.5 rounded-full border border-border shadow-premium">
                  <UserIcon className="w-4 h-4 text-primary" />
                  <span className="max-w-[100px] truncate font-medium">{session.user.email}</span>
                </div>

                <button
                  onClick={async () => {
                    await signOut({ redirect: false });
                    window.location.href = "/";
                  }}
                  className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 text-foreground/60 hover:bg-card rounded-xl transition-all"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              <Link href="/auth" className="text-foreground/70 hover:text-primary font-semibold transition-colors">
                Log in
              </Link>
              <Link
                href="/auth?mode=register"
                className="bg-primary pt-2.5 pb-2.5 pl-6 pr-6 text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-glow"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
