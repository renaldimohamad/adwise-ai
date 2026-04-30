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
import { PerformanceChart } from "@/components/PerformanceChart";

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

const DetailSkeleton = ({ dict }: { dict: any }) => (
  <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 space-y-8 sm:space-y-12 pb-20 animate-pulse pt-6">
    {/* Back Link Skeleton */}
    <div className="h-4 w-32 bg-foreground/5 rounded-lg mb-8"></div>

    {/* Hero Skeleton */}
    <div className="bg-card border border-border/50 rounded-[2rem] sm:rounded-[3.5rem] p-8 sm:p-14 relative overflow-hidden">
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-foreground/[0.03] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
      <div className="flex flex-col lg:flex-row justify-between gap-12">
        <div className="space-y-6 flex-grow">
          <div className="flex gap-3">
            <div className="h-8 w-32 bg-foreground/5 rounded-full"></div>
            <div className="h-8 w-32 bg-foreground/5 rounded-full"></div>
          </div>
          <div className="h-20 w-3/4 bg-foreground/10 rounded-[2rem]"></div>
          <div className="h-12 w-full bg-foreground/5 rounded-xl"></div>
        </div>
        <div className="w-full lg:w-64 h-64 bg-foreground/[0.03] rounded-[3rem] border border-border"></div>
      </div>
    </div>

    {/* Metrics Grid Skeleton */}
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-48 bg-card border border-border rounded-[2rem] sm:rounded-[3rem] p-10 relative overflow-hidden">
          <div className="w-12 h-12 bg-foreground/5 rounded-2xl mb-6"></div>
          <div className="h-3 w-20 bg-foreground/5 rounded mb-4"></div>
          <div className="h-10 w-24 bg-foreground/10 rounded-xl"></div>
        </div>
      ))}
    </div>

    {/* Insights Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="h-[500px] bg-card border border-border rounded-[2rem] sm:rounded-[3.5rem]"></div>
      <div className="h-[500px] bg-primary/10 border border-primary/20 rounded-[2rem] sm:rounded-[3.5rem]"></div>
    </div>
  </div>
);

export default function HistoryDetailClient({ id }: { id: string }) {
  const { dict, language } = useLanguage();
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
    return <DetailSkeleton dict={dict} />;
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
    <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 space-y-8 sm:space-y-12 pb-20 overflow-x-hidden">
      {/* Back & Breadcrumb */}
      <Link href="/history" className="inline-flex items-center gap-3 text-foreground/40 hover:text-primary font-black uppercase tracking-widest text-[9px] sm:text-[10px] transition-all group pt-6">
        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
        {dict.history.backToArchive}
      </Link>

      {/* Header Analysis Summary (Startup Style) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group overflow-hidden bg-foreground/[0.03] dark:bg-white/[0.02] border border-border rounded-[2rem] sm:rounded-[3.5rem] p-8 sm:p-10 lg:p-14"
      >
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 blur-[80px] sm:blur-[120px] -mr-32 sm:-mr-64 -mt-32 sm:-mt-64 rounded-full" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
          <div className="space-y-4 sm:space-y-6 max-w-3xl">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                <Layers className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                {data.platform} {dict.history.intel}
              </div>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-foreground/5 border border-border text-foreground/40 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                {format(new Date(data.createdAt), "MMMM d, yyyy")}
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-none">
              {data.name}
            </h1>
            <p className="text-lg sm:text-2xl font-medium text-foreground/60 leading-relaxed max-w-2xl italic">
              &quot;{data.analyses[0]?.aiSummary}&quot;
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-center justify-center p-8 sm:p-12 bg-card rounded-[2rem] sm:rounded-[3rem] border border-border shadow-premium w-full lg:w-auto">
            <span className="text-[9px] sm:text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-3 sm:mb-4">{dict.history.neuralScore}</span>
            <div className="text-5xl sm:text-7xl font-black text-primary tracking-tighter">
              {Math.min(100, Math.round((data.ctr * 20) + (data.conversions / data.clicks * 100) || 0))}%
            </div>
            <div className="mt-3 sm:mt-4 flex items-center gap-2 text-emerald-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {dict.history.verifiedAnalysis}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: dict.history.metrics.ctrPerf, value: `${data.ctr.toFixed(2)}%`, icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />, color: "text-emerald-500 bg-emerald-500/5" },
          { label: dict.history.metrics.convFlow, value: data.conversions, icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />, color: "text-primary bg-primary/5" },
          { label: dict.history.metrics.costIndex, value: `$${data.cpc.toFixed(2)}`, icon: <BarChart className="w-4 h-4 sm:w-5 sm:h-5" />, color: "text-yellow-500 bg-yellow-500/5" },
          { label: dict.history.metrics.burnRate, value: `$${data.spend.toLocaleString()}`, icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />, color: "text-red-500 bg-red-500/5" }
        ].map((m, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className={`p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] border border-border bg-card shadow-premium relative group hover:-translate-y-1 transition-all duration-500`}
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${m.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}>
              {m.icon}
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">{m.label}</span>
            <div className="text-2xl sm:text-4xl font-black text-foreground tracking-tighter mt-1 sm:mt-2 group-hover:scale-110 transition-transform origin-left">{m.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Growth Trajectory Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-[2rem] sm:rounded-[3.5rem] p-8 sm:p-12 shadow-premium"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h3 className="text-3xl font-black tracking-tight mb-2">{dict.dashboard.growthTitle}</h3>
            <p className="text-foreground/40 font-medium">{dict.dashboard.growthSubtitle}</p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 rounded-2xl bg-foreground/5 border border-border text-[10px] font-black uppercase tracking-widest text-foreground/40">
              {language === 'id' ? 'Proyeksi 7-Hari' : '7-Day Projection'}
            </div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <PerformanceChart
            data={[
              { label: "Day 1", value: Math.round(data.ctr * 10) },
              { label: "Day 2", value: Math.round(data.ctr * 12) },
              { label: "Day 3", value: Math.round(data.ctr * 15) },
              { label: "Day 4", value: Math.round(data.ctr * 14) },
              { label: "Day 5", value: Math.round(data.ctr * 18) },
              { label: "Day 6", value: Math.round(data.ctr * 22) },
              { label: "Day 7", value: Math.round(data.ctr * 25) }
            ]}
          />
        </div>
      </motion.div>

      {/* Advanced Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Issues */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-[2rem] sm:rounded-[3.5rem] p-8 sm:p-12 shadow-premium"
        >
          <div className="flex items-center gap-4 sm:gap-5 mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/10 rounded-[1.25rem] sm:rounded-[2rem] flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{dict.history.bottlenecksTitle}</h3>
              <p className="text-foreground/40 font-bold uppercase text-[9px] sm:text-[10px] tracking-widest mt-1">{dict.history.bottlenecksSubtitle}</p>
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {data.analyses[0]?.aiIssues.split('\n').filter(l => l.trim()).map((line, i) => (
              <div key={i} className="flex gap-4 sm:gap-6 group p-4 sm:p-6 rounded-2xl sm:rounded-3xl hover:bg-red-500/5 transition-all border border-transparent hover:border-red-500/10">
                <div className="w-1 h-6 sm:w-1.5 sm:h-7 bg-red-500/20 rounded-full group-hover:bg-red-500 transition-colors shrink-0 mt-1" />
                <p className="text-base sm:text-xl font-bold text-foreground/60 group-hover:text-foreground leading-tight">{line.replace(/^[-*]\s*/, '')}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-primary text-white border border-primary/20 rounded-[2rem] sm:rounded-[3.5rem] p-8 sm:p-12 shadow-2xl shadow-primary/30"
        >
          <div className="flex items-center gap-4 sm:gap-5 mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-[1.25rem] sm:rounded-[2rem] flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{dict.history.roadmapTitle}</h3>
              <p className="text-white/40 font-bold uppercase text-[9px] sm:text-[10px] tracking-widest mt-1">{dict.history.roadmapSubtitle}</p>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {data.analyses[0]?.aiRecommendations.split('\n').filter(l => l.trim().length > 0).map((line, i) => (
              <div key={i} className="flex gap-4 sm:gap-6 bg-white/10 backdrop-blur-md p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/10 hover:bg-white/15 transition-all group">
                <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-base sm:text-xl font-bold leading-tight tracking-tight">{line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '')}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
