"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Clock,
  TrendingUp,
  BarChart2,
  Trash2,
  Globe,
  Search,
  Zap,
  DollarSign,
  Target,
  Sparkles,
  Layers,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

type CampaignInfo = {
  id: string;
  name: string;
  platform: string;
  createdAt: string;
  ctr: number;
  cpc: number;
  cpa: number;
  spend: number;
};

const SkeletonCard = () => (
  <div className="bg-card p-5 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-premium border border-border/50 relative overflow-hidden group">
    {/* Animated Shimmer Overlay */}
    <div className="absolute inset-0 z-20 pointer-events-none">
      <div className="w-full h-full bg-gradient-to-r from-transparent via-foreground/[0.03] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>

    {/* Top Right Decorative Glow */}
    <div className="absolute top-0 right-0 w-48 h-48 bg-foreground/[0.02] rounded-full blur-[60px] -mr-24 -mt-24" />

    <div className="flex justify-between items-start mb-8 sm:mb-10 relative z-10">
      <div className="space-y-5 flex-grow pr-4">
        {/* Platform Badge Skeleton */}
        <div className="h-8 w-32 bg-foreground/[0.05] rounded-full"></div>
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-full bg-foreground/[0.08] rounded-xl"></div>
          <div className="h-8 w-2/3 bg-foreground/[0.08] rounded-xl"></div>
        </div>
      </div>
      {/* Action Button Skeleton */}
      <div className="h-12 w-12 bg-foreground/[0.03] rounded-2xl"></div>
    </div>

    {/* Bento Metrics Grid Skeleton */}
    <div className="grid grid-cols-2 gap-4 py-8 border-y border-border/40 mb-10">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-foreground/[0.02] p-5 rounded-3xl border border-transparent space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-foreground/[0.05] rounded-full"></div>
            <div className="h-2 w-10 bg-foreground/[0.05] rounded"></div>
          </div>
          <div className="h-7 w-16 bg-foreground/[0.1] rounded-lg"></div>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between">
      {/* Date Skeleton */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-foreground/[0.05] rounded-full"></div>
        <div className="h-3 w-20 bg-foreground/[0.05] rounded"></div>
      </div>
      {/* Examine Button Skeleton */}
      <div className="h-12 w-32 bg-foreground/10 rounded-2xl"></div>
    </div>
  </div>
);

export default function HistoryClient() {
  const { dict, language } = useLanguage();
  const [campaigns, setCampaigns] = useState<CampaignInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaign");
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (e) {
      toast.error(language === 'id' ? "Gagal mengambil riwayat" : "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    const isID = language === 'id';
    setIsDeleting(true);
    try {
      setCampaigns(c => c.filter(camp => camp.id !== deleteId));
      const res = await fetch(`/api/campaign/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(isID ? "Catatan berhasil dihapus" : "Record purged successfully");
      } else {
        throw new Error();
      }
    } catch (e) {
      toast.error(isID ? "Gagal menghapus catatan" : "Failed to delete record");
      fetchHistory();
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const openDeleteModal = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const getPlatformStyle = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('facebook')) return { icon: <Globe className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10", glow: "shadow-blue-500/20" };
    if (p.includes('google')) return { icon: <Search className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-500/10", glow: "shadow-amber-500/20" };
    if (p.includes('tiktok')) return { icon: <Zap className="w-5 h-5" />, color: "text-rose-500", bg: "bg-rose-500/10", glow: "shadow-rose-500/20" };
    return { icon: <Layers className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/10", glow: "shadow-primary/20" };
  };

  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("All");

  const filteredCampaigns = campaigns.filter(camp => {
    const matchesSearch = camp.name.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform = platformFilter === "All" || camp.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 py-16 sm:py-24 min-h-screen relative z-10">
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="h-16 w-full md:w-96 bg-foreground/5 rounded-[2rem] animate-pulse"></div>
            <div className="h-16 w-full md:w-48 bg-foreground/5 rounded-[2rem] animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-[2.5rem] p-8 sm:p-16 text-center shadow-premium max-w-2xl mx-auto mt-12 overflow-hidden relative group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] transition-all duration-1000 group-hover:bg-primary/10" />
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-primary/20 shadow-glow shadow-primary/10">
          <Clock className="w-12 h-12" />
        </div>
        <h3 className="text-3xl sm:text-4xl font-black text-foreground mb-6 tracking-tighter leading-none">{dict.history.emptyTitle}</h3>
        <p className="text-lg sm:text-xl font-medium text-foreground/40 mb-12 leading-relaxed italic">&quot;{dict.history.emptyDesc}&quot;</p>
        <Link href="/dashboard" className="inline-flex items-center gap-5 bg-primary text-white px-10 py-5 sm:px-14 sm:py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:brightness-110 hover:-translate-y-1 active:scale-95 transition-all shadow-glow shadow-primary/30 group">
          <BarChart2 className="w-6 h-6 group-hover:rotate-12 transition-transform" /> {dict.history.btnStart}
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 py-16 sm:py-24 min-h-screen relative z-10">
      <div className="mb-12 sm:mb-20 space-y-6">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[9px] xs:text-[10px] font-black uppercase tracking-[0.3em]">
          <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
          {dict.history.archiveBadge}
        </div>
        <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.9]">
          {dict.history.vaultTitle} <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">{dict.history.vaultSubtitle}</span>
        </h1>
        <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-medium text-foreground/40 max-w-2xl leading-relaxed">
          {dict.history.vaultDesc}
        </p>
      </div>

      <div className="space-y-12">
        {/* Search and Filter UI */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder={dict.history.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border/50 rounded-[2rem] py-5 pl-14 pr-6 text-sm font-bold focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all shadow-premium"
            />
          </div>

          <div className="flex gap-2 p-1.5 bg-card border border-border/50 rounded-[2.5rem] shadow-premium overflow-x-auto w-full md:w-auto">
            {["All", "Facebook", "Google", "TikTok"].map((p) => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={`px-8 py-3 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${platformFilter === p ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-foreground/5 text-foreground/40"}`}
              >
                {p === "All" ? (language === 'id' ? "Semua" : "All") : p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((camp, idx) => {
                const style = getPlatformStyle(camp.platform);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    transition={{ duration: 0.5, delay: idx * 0.05, type: "spring", stiffness: 100 }}
                    key={camp.id}
                    className="group relative"
                  >
                    <Link
                      href={`/history/${camp.id}`}
                      className="block h-full bg-card border border-border/80 rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-10 shadow-premium hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] hover:border-primary/40 transition-all duration-700 overflow-hidden text-left relative z-10"
                    >
                      {/* Platform specific mesh-glow */}
                      <div className={`absolute -top-20 -right-20 w-56 h-56 ${style.bg} rounded-full blur-[80px] group-hover:opacity-100 opacity-60 transition-all duration-700`} />
                      <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-primary rounded-full animate-ping opacity-0 group-hover:opacity-40" />

                      <div className="flex justify-between items-start mb-8 sm:mb-10 relative z-10">
                        <div className="space-y-5 flex-grow pr-4">
                          <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-full ${style.bg} border border-${style.color.split('-')[1]}-500/20 ${style.color} text-[10px] font-black uppercase tracking-[0.2em] shadow-sm`}>
                            <div className="animate-pulse">{style.icon}</div>
                            <span>{camp.platform} {dict.history.record}</span>
                          </div>
                          <h3 className="text-3xl font-black text-foreground tracking-tighter leading-[1.1] group-hover:text-primary transition-colors line-clamp-2">
                            {camp.name}
                          </h3>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openDeleteModal(camp.id, camp.name);
                          }}
                          className="p-4 text-foreground/10 hover:text-red-500 hover:bg-red-500/10 rounded-[1.5rem] transition-all group-hover:text-foreground/30 relative z-20"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Bento-style Metrics Grid */}
                      <div className="grid grid-cols-2 gap-4 py-8 border-y border-border/40 relative z-10 mb-10">
                        {[
                          { label: dict.history.metrics.engagement, value: `${camp.ctr.toFixed(2)}%`, icon: <Target className="w-3.5 h-3.5" />, positive: camp.ctr > 2 },
                          { label: dict.history.metrics.netInvestment, value: `$${Math.round(camp.spend)}`, icon: <DollarSign className="w-3.5 h-3.5" />, positive: false },
                          { label: dict.history.metrics.unitValue, value: `$${camp.cpc.toFixed(2)}`, icon: <TrendingUp className="w-3.5 h-3.5" />, positive: camp.cpc < 1 },
                          { label: dict.history.metrics.resultIndex, value: `$${camp.cpa.toFixed(2)}`, icon: <Sparkles className="w-3.5 h-3.5" />, positive: camp.cpa < 20 }
                        ].map((m, i) => (
                          <div key={i} className="bg-foreground/[0.02] dark:bg-white/[0.01] p-5 rounded-3xl border border-transparent hover:border-foreground/5 hover:bg-foreground/[0.04] transition-all">
                            <div className="flex items-center gap-2 mb-3">
                              <span className={`opacity-40 ${m.positive ? 'text-primary' : ''}`}>{m.icon}</span>
                              <span className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.2em]">{m.label}</span>
                            </div>
                            <p className={`text-2xl font-black tracking-tighter ${m.positive ? 'text-primary' : 'text-foreground'}`}>{m.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3 text-foreground/30">
                          <Clock className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-[0.25em]">
                            {format(new Date(camp.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background group-hover:bg-primary transition-all text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 shadow-black/20"
                        >
                          {dict.history.examine}
                          <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>

                      {/* Decorative geometry */}
                      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity border-4 border-primary/5 rounded-[2rem] rotate-45" />
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full py-20 text-center"
              >
                <div className="w-20 h-20 bg-foreground/[0.02] rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border">
                  <Search className="w-8 h-8 text-foreground/20" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2 tracking-tighter">{dict.history.filterEmptyTitle}</h3>
                <p className="text-foreground/40 font-medium max-w-xs mx-auto">{dict.history.filterEmptyDesc}</p>
                <button 
                  onClick={() => { setSearch(""); setPlatformFilter("All"); }}
                  className="mt-8 text-primary font-black uppercase tracking-widest text-[10px] hover:underline"
                >
                  {language === 'id' ? "Reset Filter" : "Reset Filters"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Delete Confirmation Modal - Refined */}
        <AnimatePresence>
          {deleteId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-left">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeleteId(null)}
                className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative w-full max-w-[90vw] sm:max-w-md bg-card border border-border/80 rounded-[2rem] sm:rounded-[3.5rem] p-8 sm:p-12 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-red-500/10 rounded-full -mr-16 sm:-mr-24 -mt-16 sm:-mt-24 blur-[40px] sm:blur-[60px]" />

                <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-red-500/10 rounded-[1.5rem] sm:rounded-[2.5rem] flex items-center justify-center border border-red-500/20 shadow-glow shadow-red-500/10">
                    <Trash2 className="w-6 h-6 sm:w-10 sm:h-10 text-red-500" />
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-2xl sm:text-4xl font-black text-foreground tracking-tighter leading-none">
                      {dict.history.purgeConfirmTitle}
                    </h3>
                    <p className="text-foreground/40 font-medium text-sm sm:text-lg leading-relaxed px-2 sm:px-4">
                      {dict.history.purgeConfirmDesc.replace('{name}', deleteName)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:gap-4 w-full pt-2 sm:pt-4">
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full py-4 sm:py-6 rounded-xl sm:rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-wider sm:tracking-[0.2em] text-[10px] sm:text-xs transition-all shadow-xl shadow-red-500/30 disabled:opacity-50 flex items-center justify-center gap-3 px-4"
                    >
                      {isDeleting ? (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5" />
                          {dict.history.btnConfirmPurge}
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setDeleteId(null)}
                      disabled={isDeleting}
                      className="w-full py-4 sm:py-6 rounded-xl sm:rounded-2xl bg-foreground/5 hover:bg-foreground/10 text-foreground font-black uppercase tracking-wider sm:tracking-[0.2em] text-[10px] sm:text-xs transition-all disabled:opacity-50"
                    >
                      {dict.history.btnAbortPurge}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
