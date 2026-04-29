"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn,
  UserPlus,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowLeft
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function AuthContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? false : true;
  const [isLogin, setIsLogin] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Reset error when switching modes
  useEffect(() => {
    setError("");
  }, [isLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // Auto login after success
        await signIn("credentials", {
          email: email.toLowerCase(),
          password,
          callbackUrl: "/dashboard",
          redirect: false,
        });
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed.");
        setLoading(false);
      }
    } catch (err) {
      setError("Something went wrong during registration.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      {/* Desktop Container */}
      <motion.div
        layout
        className={`w-full max-w-5xl bg-card rounded-[2.5rem] shadow-premium border border-border overflow-hidden flex flex-col md:flex-row min-h-[650px] relative transition-all duration-500 ease-in-out ${isLogin ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      >
        {/* Visual / Image Section */}
        <motion.div
          layout
          className="w-full md:w-1/2 bg-gradient-to-br from-primary via-secondary to-primary dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 relative p-12 flex flex-col justify-between text-white overflow-hidden shadow-inner"
        >
          {/* Animated Background Elements - Subtle in Dark Mode */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 dark:bg-primary/5 rounded-full -mr-20 -mt-20 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 dark:bg-secondary/5 rounded-full -ml-20 -mb-20 blur-[100px]"></div>

          {/* Mesh Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={isLogin ? "login-vis" : "reg-vis"}
            transition={{ delay: 0.2 }}
            className="z-10"
          >
            <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter mb-12 group">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md group-hover:bg-white/30 transition-all">
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <span>AdWise AI</span>
            </Link>

            <h2 className="text-4xl md:text-5xl font-black leading-[1.1] mb-6 tracking-tight">
              {isLogin ? "Welcome back to the elite." : "Join the future of advertising."}
            </h2>
            <p className="text-white/70 text-lg font-medium max-w-sm">
              {isLogin
                ? "Access your neural dashboard and continue optimizing your high-performance campaigns."
                : "Create an account today and unlock enterprise-grade AI insights for your business."}
            </p>
          </motion.div>

          <div className="z-10 grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <div className="text-[10px] font-black uppercase tracking-widest leading-none">Secure<br />Protocols</div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10">
              <Sparkles className="w-6 h-6 text-accent" />
              <div className="text-[10px] font-black uppercase tracking-widest leading-none">Neural<br />Engine</div>
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          layout
          className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-card"
        >
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h3 className="text-3xl font-black text-foreground mb-2">
                {isLogin ? "Neural Access" : "Neural Foundry"}
              </h3>
              <p className="text-foreground/50 font-medium italic">
                {isLogin ? "Authorized credentials required" : "Initiating new user protocol"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-red-500/5 text-red-500 p-4 rounded-2xl text-sm mb-8 border border-red-500/20 font-bold flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-foreground/40 ml-1 uppercase tracking-[0.2em]">Identification (Email)</label>
                <div className="relative group">
                  <input
                    type="email"
                    className="w-full px-5 py-4 bg-input border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-foreground/20 text-foreground font-semibold"
                    placeholder="agent@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-foreground/40 ml-1 uppercase tracking-[0.2em]">Access Token (Password)</label>
                <input
                  type="password"
                  className="w-full px-5 py-4 bg-input border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-foreground/20 text-foreground font-semibold"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="block text-[10px] font-black text-foreground/40 ml-1 uppercase tracking-[0.2em]">Verify Token</label>
                  <input
                    type="password"
                    className="w-full px-5 py-4 bg-input border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-foreground/20 text-foreground font-semibold"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-glow relative overflow-hidden group mt-4"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="static"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      {isLogin ? "Authenticate" : "Initialize Account"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-sm font-medium text-foreground/40 mb-4">
                {isLogin ? "No access key?" : "System identity already exists?"}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="flex items-center gap-2 mx-auto text-primary font-black uppercase tracking-widest text-[11px] hover:text-secondary transition-all"
              >
                {isLogin ? (
                  <>Create Foundry Account <CheckCircle2 className="w-4 h-4" /></>
                ) : (
                  <><ArrowLeft className="w-4 h-4" /> Back to Authentication</>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
