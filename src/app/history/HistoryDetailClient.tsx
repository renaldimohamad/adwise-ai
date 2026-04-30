"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  BarChart,
  Sparkles,
  ArrowLeft,
  Calendar,
  Layers
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useLanguage } from "@/context/LanguageContext";
import { PremiumSpinner } from "@/components/LoadingStates";

type CampaignResult = {
  id: string;
  name: string;
  platform: string;
  createdAt: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  cpa: number;
  analyses: Array<{
    aiSummary: string;
    aiIssues: string;
    aiRecommendations: string;
  }>;
};

export default function HistoryDetailClient({ id }: { id: string }) {
  const { dict } = useLanguage();
  const [data, setData] = useState<CampaignResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/campaign/${id}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <PremiumSpinner size="lg" />
        <p className="mt-8 text-primary font-black uppercase tracking-widest text-xs animate-pulse">{dict.history.retrieving}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-black text-foreground mb-4">{dict.history.notFound}</h2>
        <Link href="/history" className="text-primary font-bold hover:underline">{dict.history.backToArchive}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Back & Breadcrumb */}
      <Link href="/history" className="inline-flex items-center gap-3 text-foreground/40 hover:text-primary font-black uppercase tracking-widest text-[10px] transition-all group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {dict.history.backToArchive}
      </Link>

      {/* Header Analysis Summary (Startup Style) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group overflow-hidden bg-foreground/[0.03] dark:bg-white/[0.02] border border-border rounded-[3.5rem] p-10 lg:p-14"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] -mr-64 -mt-64 rounded-full" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-6 max-w-3xl">
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                <Layers className="w-3.5 h-3.5" />
                {data.platform} {dict.history.intel}
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-border text-foreground/40 text-[10px] font-black uppercase tracking-widest">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(data.createdAt), "MMMM d, yyyy")}
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-none">
              {data.name}
            </h1>
            <p className="text-2xl font-medium text-foreground/60 leading-relaxed max-w-2xl italic">
              &quot;{data.analyses[0]?.aiSummary}&quot;
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-center justify-center p-12 bg-card rounded-[3rem] border border-border shadow-premium">
            <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.25em] mb-4">{dict.history.neuralScore}</span>
            <div className="text-7xl font-black text-primary tracking-tighter">
              {Math.min(100, Math.round((data.ctr * 20) + (data.conversions / data.clicks * 100) || 0))}%
            </div>
            <div className="mt-4 flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
              <TrendingUp className="w-4 h-4" />
              {dict.history.verifiedAnalysis}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: dict.history.metrics.ctrPerf, value: `${data.ctr.toFixed(2)}%`, icon: <TrendingUp />, color: "text-emerald-500 bg-emerald-500/5" },
          { label: dict.history.metrics.convFlow, value: data.conversions, icon: <Sparkles />, color: "text-primary bg-primary/5" },
          { label: dict.history.metrics.costIndex, value: `$${data.cpc.toFixed(2)}`, icon: <BarChart />, color: "text-yellow-500 bg-yellow-500/5" },
          { label: dict.history.metrics.burnRate, value: `$${data.spend.toLocaleString()}`, icon: <TrendingUp />, color: "text-red-500 bg-red-500/5" }
        ].map((m, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className={`p-10 rounded-[3rem] border border-border bg-card shadow-premium relative group hover:-translate-y-1 transition-all duration-500`}
          >
            <div className={`w-12 h-12 ${m.color} rounded-2xl flex items-center justify-center mb-6`}>
              {m.icon}
            </div>
            <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">{m.label}</span>
            <div className="text-4xl font-black text-foreground tracking-tighter mt-2 group-hover:scale-110 transition-transform origin-left">{m.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Insights Section */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Issues */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-[3.5rem] p-12 shadow-premium"
        >
          <div className="flex items-center gap-5 mb-12">
            <div className="w-16 h-16 bg-red-500/10 rounded-[2rem] flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight">{dict.history.bottlenecksTitle}</h3>
              <p className="text-foreground/40 font-bold uppercase text-[10px] tracking-widest mt-1">{dict.history.bottlenecksSubtitle}</p>
            </div>
          </div>
          <div className="space-y-6">
            {data.analyses[0]?.aiIssues.split('\n').filter(l => l.trim()).map((line, i) => (
              <div key={i} className="flex gap-6 group p-6 rounded-3xl hover:bg-red-500/5 transition-all border border-transparent hover:border-red-500/10">
                <div className="w-1.5 h-7 bg-red-500/20 rounded-full group-hover:bg-red-500 transition-colors shrink-0" />
                <p className="text-xl font-bold text-foreground/60 group-hover:text-foreground leading-tight">{line.replace(/^[-*]\s*/, '')}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-primary text-white border border-primary/20 rounded-[3.5rem] p-12 shadow-2xl shadow-primary/30"
        >
          <div className="flex items-center gap-5 mb-12">
            <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight">{dict.history.roadmapTitle}</h3>
              <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-1">{dict.history.roadmapSubtitle}</p>
            </div>
          </div>
          <div className="space-y-4">
            {data.analyses[0]?.aiRecommendations.split('\n').filter(l => l.trim().length > 0).map((line, i) => (
              <div key={i} className="flex gap-6 bg-white/10 backdrop-blur-md p-7 rounded-3xl border border-white/10 hover:bg-white/15 transition-all group">
                <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
                <span className="text-xl font-bold leading-tight tracking-tight">{line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '')}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
