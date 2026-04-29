import Link from "next/link";
import { ArrowRight, BarChart3, TrendingUp, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center py-24">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-10 text-xs font-black uppercase tracking-[0.2em] text-primary bg-primary/5 rounded-full border border-primary/10">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          Revolutionizing Ad Optimization
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground mb-8 leading-[0.9]">
          Master your ads with <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">AI Intelligence</span>
        </h1>
        <p className="text-xl text-foreground/50 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Eliminate guesswork. AdWise AI analyzes your cross-platform metrics to deliver enterprise-grade insights that scale your performance instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link
            href="/auth?mode=register"
            className="flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-bold hover:brightness-110 transition-all hover:scale-[1.02] shadow-glow w-full sm:w-auto justify-center"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/auth"
            className="flex items-center gap-2 bg-card text-foreground border border-border px-10 py-5 rounded-2xl font-bold hover:bg-input transition-all w-full sm:w-auto justify-center shadow-premium"
          >
            Client Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-6xl mx-auto py-20 grid md:grid-cols-3 gap-8 px-4">
        <div className="group bg-card p-10 rounded-[2.5rem] shadow-premium border border-border hover:border-primary/20 transition-all">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black mb-4 tracking-tight">Metrics Clarity</h3>
          <p className="text-foreground/50 leading-relaxed font-medium">
            Automated processing of CPA, CPC, and CTR to provide a crystal-clear performance architecture.
          </p>
        </div>
        <div className="group bg-card p-10 rounded-[2.5rem] shadow-premium border border-border hover:border-secondary/20 transition-all">
          <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black mb-4 tracking-tight">Instant Diagnostics</h3>
          <p className="text-foreground/50 leading-relaxed font-medium">
            Identify performance leakage within milliseconds. Our AI spots inefficiency before it drains your budget.
          </p>
        </div>
        <div className="group bg-card p-10 rounded-[2.5rem] shadow-premium border border-border hover:border-accent/20 transition-all">
          <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black mb-4 tracking-tight">Execution Roadmap</h3>
          <p className="text-foreground/50 leading-relaxed font-medium">
            Receive prioritized, high-impact optimization protocols tailored to your unique campaign ecosystem.
          </p>
        </div>
      </section>
    </div>
  );
}
