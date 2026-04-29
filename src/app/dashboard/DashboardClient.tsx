"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, BrainCircuit, AlertCircle, CheckCircle2, TrendingUp, BarChart, Sparkles } from "lucide-react";
import { PremiumSpinner } from "@/components/LoadingStates";

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

const loadingMessages = [
  "Fetching campaign data...",
  "Analyzing platforms benchmarks...",
  "Calculating conversion efficiency...",
  "Querying AI experts for insights...",
  "Optimizing priority actions...",
  "Formatting your personalized report...",
];

export default function DashboardClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [msgIndex, setMsgIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    platform: "Facebook",
    impressions: "",
    clicks: "",
    conversions: "",
    spend: "",
  });

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
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        name: formData.name,
        platform: formData.platform,
        impressions: parseInt(formData.impressions) || 0,
        clicks: parseInt(formData.clicks) || 0,
        conversions: parseInt(formData.conversions) || 0,
        spend: parseFloat(formData.spend) || 0,
      };

      const res = await fetch("/api/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (error) {
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getMetricColor = (metric: string, value: number) => {
    if (metric === "ctr") {
      if (value > 2) return "text-emerald-600 bg-emerald-50 border-emerald-200";
      if (value > 0.8) return "text-yellow-600 bg-yellow-50 border-yellow-200";
      return "text-red-600 bg-red-50 border-red-200";
    }
    if (metric === "cpc") {
      if (value < 0.5) return "text-emerald-600 bg-emerald-50 border-emerald-200";
      if (value < 1.5) return "text-yellow-600 bg-yellow-50 border-yellow-200";
      return "text-red-600 bg-red-50 border-red-200";
    }
    if (metric === "cpa") {
      if (value < 15) return "text-emerald-600 bg-emerald-50 border-emerald-200";
      if (value < 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
      return "text-red-600 bg-red-50 border-red-200";
    }
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Form Column */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-4 h-fit"
      >
        <div className="bg-card p-6 rounded-3xl shadow-premium border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
              <BarChart className="w-5 h-5 text-primary" />
            </div>
            Campaign Data
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-foreground/40 mb-1.5 ml-1 uppercase tracking-[0.2em]">Campaign Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Q4 Growth Focus"
                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground font-medium"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-foreground/40 mb-1.5 ml-1 uppercase tracking-[0.2em]">Platform</label>
              <select
                name="platform"
                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground font-medium"
                value={formData.platform}
                onChange={handleChange}
              >
                <option value="Facebook">Facebook Ads</option>
                <option value="Google">Google Search</option>
                <option value="TikTok">TikTok Spark</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-foreground/40 mb-1.5 ml-1 uppercase tracking-[0.2em]">Impressions</label>
                <input
                  type="number"
                  name="impressions"
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground font-medium"
                  value={formData.impressions}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-foreground/40 mb-1.5 ml-1 uppercase tracking-[0.2em]">Clicks</label>
                <input
                  type="number"
                  name="clicks"
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground font-medium"
                  value={formData.clicks}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-foreground/40 mb-1.5 ml-1 uppercase tracking-[0.2em]">Conversions</label>
                <input
                  type="number"
                  name="conversions"
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground font-medium"
                  value={formData.conversions}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-foreground/40 mb-1.5 ml-1 uppercase tracking-[0.2em]">Spend ($)</label>
                <input
                  type="number"
                  name="spend"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground font-medium"
                  value={formData.spend}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-glow disabled:opacity-50 overflow-hidden relative group"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    exit={{ y: -20 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </motion.div>
                ) : (
                  <motion.div
                    key="static"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    exit={{ y: -20 }}
                    className="flex items-center gap-2"
                  >
                    Analyze Campaign <ArrowRight className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>
        </div>
      </motion.div>

      {/* Result Column */}
      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          {!loading && !result && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-card border border-border rounded-3xl p-12 h-full flex flex-col items-center justify-center text-center shadow-premium"
            >
              <div className="w-20 h-20 bg-primary/5 text-primary rounded-3xl flex items-center justify-center mb-8 border border-primary/10">
                <BrainCircuit className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-foreground mb-4">Strategic Insights</h3>
              <p className="text-foreground/50 max-w-sm text-lg font-medium leading-relaxed">
                Connect your campaign data on the left to unlock high-performance AI strategies.
              </p>
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card border border-border rounded-3xl p-12 h-full flex flex-col items-center justify-center text-center shadow-premium min-h-[400px]"
            >
              <PremiumSpinner />
              <motion.div
                key={msgIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="mt-10"
              >
                <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">{loadingMessages[msgIndex]}</h3>
                <p className="text-foreground/40 flex items-center justify-center gap-3 text-xl font-medium">
                  <Sparkles className="w-6 h-6 text-accent animate-pulse" />
                  Orchestrating AI models
                </p>
              </motion.div>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`p-6 rounded-3xl border bg-card shadow-premium flex flex-col justify-between ${getMetricColor('ctr', result.ctr)}`}
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">CTR Performance</div>
                  <div className="text-4xl font-black">{result.ctr.toFixed(2)}%</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`p-6 rounded-3xl border bg-card shadow-premium flex flex-col justify-between ${getMetricColor('cpc', result.cpc)}`}
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">CPC Breakdown</div>
                  <div className="text-4xl font-black">${result.cpc.toFixed(2)}</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`p-6 rounded-3xl border bg-card shadow-premium flex flex-col justify-between ${getMetricColor('cpa', result.cpa)}`}
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">CPA Efficiency</div>
                  <div className="text-4xl font-black">${result.cpa.toFixed(2)}</div>
                </motion.div>
              </div>

              {/* AI Insights Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card rounded-3xl shadow-premium border border-border overflow-hidden"
              >
                <div className="border-b border-border p-8 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                  <h2 className="text-2xl font-black text-foreground flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <BrainCircuit className="w-6 h-6 text-primary" />
                    </div>
                    Strategy Execution Plan
                  </h2>
                </div>

                <div className="p-8 space-y-10">
                  {/* Summary */}
                  <div>
                    <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Executive Summary</h3>
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-xl font-medium">
                      {result.analyses[0]?.aiSummary}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12 pt-10 border-t border-border">
                    {/* Issues */}
                    <div>
                      <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500/10 rounded-xl flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        </div>
                        Bottlenecks
                      </h3>
                      <div className="space-y-5">
                        {result.analyses[0]?.aiIssues.split('\n').filter(l => l.trim()).map((line, i) => (
                          <div key={i} className="flex gap-4 group">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0 group-hover:scale-150 transition-transform"></div>
                            <p className="text-lg font-medium text-foreground/80 leading-relaxed">{line.replace(/^[-*]\s*/, '')}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                        Strategic Actions
                      </h3>
                      <div className="space-y-4">
                        {result.analyses[0]?.aiRecommendations.split('\n').filter(l => l.trim().length > 0).map((line, i) => (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            key={i}
                            className="flex gap-4 text-foreground bg-input/50 p-5 rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-input transition-all group"
                          >
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="text-lg font-bold leading-tight">{line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '')}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

