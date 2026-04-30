"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, TrendingUp, Zap, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function Home() {
  const { dict } = useLanguage();

  return (
    <div className="relative overflow-hidden pt-20">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
        <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] opacity-30" />
        <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] opacity-30" />
      </div>

      <div className="flex flex-col items-center justify-center px-4">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 mb-8 md:mb-10 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary bg-primary/5 rounded-full border border-primary/10"
          >
            <span className="flex h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary animate-pulse"></span>
            {dict.hero.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground mb-8 leading-[0.9] px-2"
          >
            {dict.hero.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-secondary to-accent animate-gradient">
              {dict.hero.titleAccent}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-foreground/50 mb-12 max-w-2xl mx-auto leading-relaxed font-medium px-4"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <Link
              href="/auth?mode=register"
              className="flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-bold hover:brightness-110 transition-all hover:scale-[1.02] shadow-[0_20px_40px_-12px_rgba(var(--primary-rgb),0.35)] w-full sm:w-auto justify-center group"
            >
              {dict.hero.ctaPrimary} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth"
              className="flex items-center gap-2 bg-card text-foreground border border-border px-10 py-5 rounded-2xl font-bold hover:bg-input transition-all w-full sm:w-auto justify-center shadow-premium"
            >
              {dict.hero.ctaSecondary}
            </Link>
          </motion.div>
        </section>

        {/* Interactive Preview Section */}
        <section className="w-full max-w-6xl mx-auto py-24 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-card border border-border/50 rounded-[3.5rem] p-4 shadow-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative bg-background/50 backdrop-blur-sm rounded-[3rem] p-6 sm:p-8 md:p-12 border border-border/40">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight">{dict.features.feature1.title}</h2>
                    <p className="text-foreground/50 font-medium">{dict.features.feature1.desc}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
               </div>
               
               <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                  <div className="space-y-6">
                    {[
                      { label: "Cost Per Acquisition (CPA)", value: "$12.40", color: "text-primary", desc: "Target: <$15.00" },
                      { label: "Cost Per Click (CPC)", value: "$0.85", color: "text-secondary", desc: "Target: <$1.20" },
                      { label: "Click-Through Rate (CTR)", value: "3.2%", color: "text-accent", desc: "Target: >2.0%" }
                    ].map((metric, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-4 p-6 rounded-3xl bg-foreground/[0.02] border border-border/40 hover:border-primary/20 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground/40 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                          {i === 0 ? <Zap className="w-5 h-5" /> : i === 1 ? <BarChart3 className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                        </div>
                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">{metric.label}</span>
                            <span className={`text-lg font-black ${metric.color}`}>{metric.value}</span>
                          </div>
                          <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: "70%" }}
                               transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                               className={`h-full bg-current ${metric.color}`}
                             />
                          </div>
                          <div className="text-[9px] font-bold text-foreground/20 italic">{metric.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="bg-foreground/[0.02] rounded-[3rem] p-10 border border-border/40 relative overflow-hidden flex flex-col justify-center text-left">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                       <Sparkles className="w-32 h-32 text-primary" />
                    </div>
                    <div className="relative z-10 space-y-6">
                       <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Intelligence Synthesis</span>
                          <h3 className="text-3xl font-black tracking-tight leading-none">Architecture of <br /> Performance</h3>
                       </div>
                       <p className="text-foreground/40 font-medium leading-relaxed">
                          AdWise AI doesn&apos;t just show numbers; it interprets the structural relationship between your unit costs and acquisition efficiency.
                       </p>
                       <div className="flex gap-4 pt-4">
                          <div className="px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs font-black">
                             98% Accuracy
                          </div>
                          <div className="px-6 py-3 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary text-xs font-black">
                             Real-time
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="w-full max-w-6xl mx-auto py-24 grid md:grid-cols-3 gap-8 px-4">
          {[
            { icon: <BarChart3 className="w-7 h-7" />, title: dict.features.feature1.title, desc: dict.features.feature1.desc, color: "primary" },
            { icon: <Zap className="w-7 h-7" />, title: dict.features.feature2.title, desc: dict.features.feature2.desc, color: "secondary" },
            { icon: <TrendingUp className="w-7 h-7" />, title: dict.features.feature3.title, desc: dict.features.feature3.desc, color: "accent" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group bg-card p-8 sm:p-10 rounded-[2.5rem] shadow-premium border border-border hover:border-primary/20 transition-all`}
            >
              <div className="w-14 h-14 bg-foreground/5 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-foreground/50 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </section>
      </div>
    </div>
  );
}
