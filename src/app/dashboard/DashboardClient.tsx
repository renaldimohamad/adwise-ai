"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Globe,
  Search,
  Zap,
  Database,
  Activity,
  MousePointer2,
  Target,
  DollarSign,
  LineChart
} from "lucide-react";
import { PremiumSpinner, AnalysisSkeleton } from "@/components/LoadingStates";
import { useLanguage } from "@/context/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { PerformanceChart } from "@/components/PerformanceChart";

type CampaignResult = {
  id: string;
  name: string;
  platform: string;
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

const campaignSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  platform: z.enum(["Facebook", "Google", "TikTok"]),
  impressions: z.number().min(1, "Must be at least 1"),
  clicks: z.number().min(0, "Cannot be negative"),
  conversions: z.number().min(0, "Cannot be negative"),
  spend: z.number().min(1, "Must be at least 1"),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function DashboardClient() {
  const { dict, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [msgIndex, setMsgIndex] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      platform: "Facebook",
      impressions: 1,
      clicks: 0,
      conversions: 0,
      spend: 1,
    },
  });

  const loadingMessages = [
    dict.dashboard.btnAnalyzing,
    ...dict.dashboard.loading
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setMsgIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  const lastSubmitTime = useRef<number>(0);

  const onSubmit = async (data: CampaignFormValues) => {
    const now = Date.now();
    if (now - lastSubmitTime.current < 5000) {
      toast.error(language === 'id' ? "Sabar! Tunggu beberapa detik lagi." : "Please wait a few seconds before another request.");
      return;
    }
    lastSubmitTime.current = now;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, lang: language })
      });

      const resData = await res.json();
      if (res.ok) {
        setResult(resData);
        toast.success(language === 'id' ? "Analisis selesai!" : "Analysis complete!");
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        toast.error(resData.message || (language === 'id' ? "Terjadi kesalahan." : "Something went wrong."));
      }
    } catch (error) {
      toast.error(language === 'id' ? "Analisis gagal. Periksa koneksi Anda." : "Analysis failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const getMetricColor = (metric: string, value: number) => {
    if (metric === "ctr") {
      if (value > 2) return "text-emerald-500 bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]";
      if (value > 0.8) return "text-yellow-500 bg-yellow-500/5 border-yellow-500/20";
      return "text-red-500 bg-red-500/5 border-red-500/20 shadow-[0_0_30px_-10px_rgba(239,68,68,0.2)]";
    }
    if (metric === "cpc") {
      if (value < 0.5) return "text-emerald-500 bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]";
      if (value < 1.5) return "text-yellow-500 bg-yellow-500/5 border-yellow-500/20";
      return "text-red-500 bg-red-500/5 border-red-500/20 shadow-[0_0_30px_-10px_rgba(239,68,68,0.2)]";
    }
    if (metric === "cpa") {
      if (value < 15) return "text-emerald-500 bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]";
      if (value < 40) return "text-yellow-500 bg-yellow-500/5 border-yellow-500/20";
      return "text-red-500 bg-red-500/5 border-red-500/20 shadow-[0_0_30px_-10px_rgba(239,68,68,0.2)]";
    }
    return "text-foreground/60 bg-foreground/5 border-border shadow-sm";
  };

  const platformOptions = [
    { value: "Facebook", label: "Facebook Ads", icon: <Globe className="w-4 h-4" /> },
    { value: "Google", label: "Google Search", icon: <Search className="w-4 h-4" /> },
    { value: "TikTok", label: "TikTok Spark", icon: <Zap className="w-4 h-4" /> }
  ];

  return (
    <div className="relative min-h-screen pb-20">
      {/* Premium Background Elements */}
      <div className="mesh-bg" />
      <div className="mesh-grid shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      {/* Decorative Beams */}
      <div className="beam left-[10%] top-[-100px] opacity-10" />
      <div className="beam left-[60%] top-[-50px] opacity-20 [animation-delay:2s]" />
      <div className="beam left-[90%] top-[-80px] opacity-10 [animation-delay:4s]" />

      <div className="px-6 pt-32 max-w-7xl mx-auto grid lg:grid-cols-[380px_1fr] gap-12 relative z-10">
        {/* Left Column: Input Form (Fixed Style) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="h-fit lg:sticky lg:top-32"
        >
          <div className="premium-card p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group border-white/10 dark:border-white/5 text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-all duration-700" />

            <div className="flex items-center gap-5 mb-10">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[1.5rem] flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                <Database className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tighter leading-none">
                  {dict.dashboard.inputTitle.split(' ')[0]}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 mt-1 uppercase">Data ingestion</p>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label={dict.dashboard.nameLabel}
                icon={<Activity className="w-4 h-4" />}
                placeholder="e.g. Q4 Growth Focus"
                error={form.formState.errors.name?.message}
                {...form.register("name")}
              />

              <CustomSelect
                label={dict.dashboard.platformLabel}
                options={platformOptions}
                value={form.watch("platform")}
                onChange={(val) => form.setValue("platform", val as any)}
                error={form.formState.errors.platform?.message}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={dict.dashboard.impressionsLabel}
                  type="number"
                  icon={<Target className="w-4 h-4" />}
                  error={form.formState.errors.impressions?.message}
                  {...form.register("impressions", { valueAsNumber: true })}
                />
                <Input
                  label={dict.dashboard.clicksLabel}
                  type="number"
                  icon={<MousePointer2 className="w-4 h-4" />}
                  error={form.formState.errors.clicks?.message}
                  {...form.register("clicks", { valueAsNumber: true })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={dict.dashboard.conversionsLabel}
                  type="number"
                  icon={<Zap className="w-4 h-4" />}
                  error={form.formState.errors.conversions?.message}
                  {...form.register("conversions", { valueAsNumber: true })}
                />
                <Input
                  label={dict.dashboard.spendLabel.split(' ')[0]}
                  type="number"
                  step="0.01"
                  icon={<DollarSign className="w-4 h-4" />}
                  error={form.formState.errors.spend?.message}
                  {...form.register("spend", { valueAsNumber: true })}
                />
              </div>

              <Button
                type="submit"
                variant="premium"
                isLoading={loading}
                className="w-full mt-6"
                rightIcon={!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              >
                {dict.dashboard.btnAnalyze}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Right Column: AI Result Panel */}
        <div className="min-h-[600px] w-full" ref={resultRef}>
          <AnimatePresence mode="wait">
            {!loading && !result && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="premium-card p-20 h-full flex flex-col items-center justify-center text-center rounded-[3.5rem] border-white/10 dark:border-white/5 group"
              >
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full animate-pulse" />
                  <div className="relative w-32 h-32 glass rounded-[2.5rem] flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-700">
                    <BrainCircuit className="w-16 h-16 text-primary float" />
                  </div>
                </div>
                <h3 className="text-5xl font-black text-foreground mb-6 tracking-tighter leading-none">
                  {dict.dashboard.emptyTitle.split(' ')[0]} <br /> {dict.dashboard.emptyTitle.split(' ')[1]}
                </h3>
                <p className="text-foreground/40 max-w-sm text-xl font-medium leading-relaxed italic">
                  &quot;{dict.dashboard.emptyDesc}&quot;
                </p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="premium-card p-16 h-full min-h-[600px] flex flex-col rounded-[3.5rem] border-white/10 dark:border-white/5"
              >
                <div className="flex flex-col items-center justify-center flex-grow text-center">
                  <div className="relative mb-12">
                    <div className="absolute inset-0 bg-primary/30 blur-[60px] rounded-full animate-ping" />
                    <PremiumSpinner size="lg" />
                  </div>
                  <motion.div
                    key={msgIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="max-w-md mx-auto"
                  >
                    <h3 className="text-4xl font-black text-foreground mb-4 tracking-tighter leading-tight">{loadingMessages[msgIndex]}</h3>
                    <p className="text-primary flex items-center justify-center gap-3 text-lg font-black uppercase tracking-[0.2em] opacity-60">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                      Synthesizing Strategy
                    </p>
                  </motion.div>
                </div>
                <div className="mt-auto opacity-20 filter grayscale blur-[1px]">
                  <AnalysisSkeleton />
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Condensed Header Section */}
                <div className="relative group overflow-hidden glass rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 border-white/20 dark:border-white/10 shadow-premium">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full -mr-64 -mt-64 group-hover:bg-primary/20 transition-all duration-1000" />
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="space-y-4 max-w-xl text-left">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest shadow-lg">
                        <Sparkles className="w-3.5 h-3.5" />
                        {dict.dashboard.aiVerified}
                      </div>
                      <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-foreground tracking-tighter leading-none truncate pb-2">
                        {result.name}
                      </h2>
                      <p className="text-lg sm:text-xl font-medium text-foreground/50 leading-relaxed italic border-l-2 border-primary/20 pl-6 line-clamp-2">
                        &quot;{result.analyses[0]?.aiSummary}&quot;
                      </p>
                    </div>
                    <div className="shrink-0 flex flex-col items-center justify-center p-8 sm:p-10 glass rounded-[2rem] sm:rounded-[2.5rem] shadow-glow shadow-primary/5 border-white/5 min-w-[180px] sm:min-w-[200px]">
                      <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] mb-4">{dict.dashboard.performanceScore}</span>
                      <div className="text-6xl sm:text-7xl font-black text-primary tracking-tighter relative tabular-nums">
                        {Math.min(100, Math.round((result.ctr * 20) + (result.conversions / (result.clicks || 1) * 100) || 0))}%
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary/20 blur-xl rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics Bento Grid - Perfectly Aligned */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { label: dict.dashboard.metrics.ctr, value: `${result.ctr.toFixed(2)}%`, key: 'ctr', icon: <TrendingUp className="w-4 h-4" />, desc: dict.dashboard.metrics.ctrDesc },
                    { label: dict.dashboard.metrics.cpc, value: `$${result.cpc.toFixed(2)}`, key: 'cpc', icon: <DollarSign className="w-4 h-4" />, desc: dict.dashboard.metrics.cpcDesc },
                    { label: dict.dashboard.metrics.cpa, value: `$${result.cpa.toFixed(2)}`, key: 'cpa', icon: <LineChart className="w-4 h-4" />, desc: dict.dashboard.metrics.cpaDesc }
                  ].map((item, idx) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className={`group relative overflow-hidden p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border transition-all duration-700 hover:-translate-y-1 ${getMetricColor(item.key, (result as any)[item.key])}`}
                    >
                      <div className="relative z-10 space-y-4 text-left">
                        <div className="flex items-center justify-between opacity-40">
                          <span className="text-[10px] font-black uppercase tracking-[0.25em]">{item.label}</span>
                          <span className="p-1.5 border border-current rounded-lg">{item.icon}</span>
                        </div>
                        <div className="flex items-end gap-2">
                           <div className="text-4xl sm:text-5xl font-black tracking-tighter tabular-nums group-hover:scale-105 transition-transform duration-500 origin-left">{item.value}</div>
                           <div className="mb-2 w-2 h-2 rounded-full bg-current animate-pulse" />
                        </div>
                        <div className="space-y-2">
                           <div className="h-1.5 w-full bg-current/10 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "65%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-current"
                              />
                           </div>
                           <div className="text-[10px] font-bold opacity-40 uppercase tracking-[0.1em] flex justify-between">
                              <span>{item.desc}</span>
                              <span>Optimal Range</span>
                           </div>
                        </div>
                      </div>
                      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-current opacity-5 blur-[40px] group-hover:opacity-10 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
                
                {/* Trend Analysis Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="premium-card p-10 rounded-[3rem] border-white/10 dark:border-white/5 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter">Growth Trajectory</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Predicted scaling potential</p>
                    </div>
                    <div className="flex gap-2">
                       <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black">
                         <TrendingUp className="w-3 h-3" /> +12.5%
                       </span>
                    </div>
                  </div>
                  
                  <PerformanceChart 
                    data={[
                      { label: "Phase 1", value: 30 },
                      { label: "Phase 2", value: 45 },
                      { label: "Phase 3", value: 40 },
                      { label: "Phase 4", value: 70 },
                      { label: "Phase 5", value: 85 },
                      { label: "Phase 6", value: 100 },
                    ]}
                    color="var(--primary)"
                  />
                </motion.div>

                {/* Insight Engine - Refined Balance */}
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  {/* Bottlenecks Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="premium-card rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 border-white/10 dark:border-white/5 flex flex-col h-full text-left"
                  >
                    <div className="flex items-center gap-5 mb-8">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black tracking-tighter">{dict.dashboard.bottlenecksTitle}</h3>
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-red-500/40">{dict.dashboard.bottlenecksSubtitle}</p>
                      </div>
                    </div>
                    <div className="space-y-4 flex-grow">
                      {result.analyses[0]?.aiIssues.split('\n').filter(l => l.trim()).map((line, i) => (
                        <div key={i} className="flex gap-4 group p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] hover:bg-red-500/5 transition-all border border-transparent hover:border-red-500/10 items-start">
                          <div className="w-1.5 h-6 bg-red-500/10 rounded-full group-hover:bg-red-500 transition-colors shrink-0 mt-0.5" />
                          <p className="text-base sm:text-lg font-bold text-foreground/60 group-hover:text-foreground leading-tight tracking-tight">{line.replace(/^[-*]\s*/, '')}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Recommendations Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-primary text-white border border-primary/20 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl shadow-primary/20 relative overflow-hidden flex flex-col h-full text-left"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                    <div className="flex items-center gap-5 mb-8 relative z-10">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black tracking-tighter">{dict.dashboard.actionsTitle}</h3>
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{dict.dashboard.actionsSubtitle}</p>
                      </div>
                    </div>
                    <div className="space-y-4 relative z-10 flex-grow">
                      {result.analyses[0]?.aiRecommendations.split('\n').filter(l => l.trim().length > 0).map((line, i) => (
                        <motion.div
                          key={i}
                          className="flex gap-4 bg-white/10 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 hover:bg-white/15 transition-all group items-start"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                          <span className="text-base sm:text-lg font-bold leading-tight tracking-tight">{line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '')}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
