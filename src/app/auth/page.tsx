"use client";

import { useState, useEffect, Suspense } from "react";
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
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Mail, Lock } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

function AuthContent() {
  const { dict } = useLanguage();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? false : true;
  const [isLogin, setIsLogin] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onLogin = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.success("Welcome back! Redirecting...");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (res.ok) {
        toast.success("Account created! Logging you in...");
        await signIn("credentials", {
          email: data.email.toLowerCase(),
          password: data.password,
          callbackUrl: "/dashboard",
          redirect: false,
        });
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Registration failed.");
      }
    } catch (err) {
      toast.error("Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex items-center justify-center p-4">
      <motion.div
        layout
        className={`w-full max-w-5xl bg-card rounded-[2.5rem] shadow-premium border border-border overflow-hidden flex flex-col md:flex-row min-h-[600px] relative transition-all duration-500 ease-in-out ${isLogin ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      >
        {/* Visual Section */}
        <motion.div
          layout
          className="w-full md:w-1/2 bg-gradient-to-br from-primary via-secondary/80 to-primary relative p-12 flex flex-col justify-between text-white overflow-hidden shadow-inner"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-20 -mt-20 blur-[100px] animate-pulse"></div>
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={isLogin ? "login-vis" : "reg-vis"}
            className="z-10"
          >
            <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter mb-12 group">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md group-hover:bg-white/30 transition-all">
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <span>AdWise AI</span>
            </Link>

            <h2 className="text-4xl font-black leading-[1.1] mb-6 tracking-tight">
              {isLogin ? dict.authPage.loginWelcome : dict.authPage.registerWelcome}
            </h2>
            <p className="text-white/70 text-lg font-medium max-w-sm">
              {isLogin ? dict.authPage.loginDesc : dict.authPage.registerDesc}
            </p>
          </motion.div>

          <div className="z-10 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div className="text-[10px] font-black uppercase tracking-widest leading-none whitespace-pre-line">{dict.authPage.secureProtocols.replace(" ", "\n")}</div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <Sparkles className="w-5 h-5 text-accent" />
              <div className="text-[10px] font-black uppercase tracking-widest leading-none whitespace-pre-line">{dict.authPage.neuralEngine.replace(" ", "\n")}</div>
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div layout className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-card">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <h3 className="text-3xl font-black text-foreground mb-2">
                {isLogin ? dict.auth.loginTitle : dict.auth.registerTitle}
              </h3>
              <p className="text-foreground/40 font-medium">
                {isLogin ? dict.auth.loginSubtitle : dict.auth.registerSubtitle}
              </p>
            </div>

            <form
              onSubmit={isLogin ? loginForm.handleSubmit(onLogin) : registerForm.handleSubmit(onRegister)}
              className="space-y-5"
            >
              <Input
                label={dict.auth.emailLabel}
                type="email"
                icon={<Mail className="w-4 h-4" />}
                placeholder="agent@company.com"
                error={isLogin ? loginForm.formState.errors.email?.message : registerForm.formState.errors.email?.message}
                {...(isLogin ? loginForm.register("email") : registerForm.register("email"))}
              />

              <div className="relative group">
                <Input
                  label={dict.auth.passwordLabel}
                  type={showPassword ? "text" : "password"}
                  icon={<Lock className="w-4 h-4" />}
                  placeholder="••••••••"
                  error={isLogin ? loginForm.formState.errors.password?.message : registerForm.formState.errors.password?.message}
                  {...(isLogin ? loginForm.register("password") : registerForm.register("password"))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-[44px] text-foreground/20 hover:text-primary transition-colors z-20"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="relative group"
                >
                  <Input
                    label={dict.auth.confirmPasswordLabel}
                    type={showPassword ? "text" : "password"}
                    icon={<Lock className="w-4 h-4" />}
                    placeholder="••••••••"
                    error={registerForm.formState.errors.confirmPassword?.message}
                    {...registerForm.register("confirmPassword")}
                  />
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-glow relative overflow-hidden group mt-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{dict.authPage.processing}</span>
                  </>
                ) : (
                  <>
                    {isLogin ? dict.auth.btnAuthenticate : dict.auth.btnInitialize}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-sm font-medium text-foreground/40 mb-4">
                {isLogin ? dict.auth.noAccount : dict.auth.hasAccount}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="flex items-center gap-2 mx-auto text-primary font-black uppercase tracking-widest text-[11px] hover:text-secondary transition-all"
              >
                {isLogin ? (
                  <>{dict.auth.switchRegister} <CheckCircle2 className="w-4 h-4" /></>
                ) : (
                  <><ArrowLeft className="w-4 h-4" /> {dict.auth.switchLogin}</>
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
