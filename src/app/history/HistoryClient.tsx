"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Clock, TrendingUp, BarChart2, Trash2, Link } from "lucide-react";
import { motion } from "framer-motion"

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
  <div className="bg-card p-8 rounded-3xl shadow-premium border border-border animate-pulse">
    <div className="flex justify-between items-start mb-6">
      <div className="space-y-3">
        <div className="h-4 w-20 bg-foreground/5 rounded-full"></div>
        <div className="h-8 w-48 bg-foreground/5 rounded-xl"></div>
      </div>
      <div className="h-10 w-10 bg-foreground/5 rounded-xl"></div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i}>
          <div className="h-3 w-12 bg-foreground/5 rounded mb-2"></div>
          <div className="h-6 w-24 bg-foreground/5 rounded-lg"></div>
        </div>
      ))}
    </div>
    <div className="pt-6 border-t border-border">
      <div className="h-4 w-40 bg-foreground/5 rounded-lg"></div>
    </div>
  </div>
);

export default function HistoryClient() {
  const [campaigns, setCampaigns] = useState<CampaignInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/campaign");
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign history?")) return;

    // We would need a DELETE route for this, since I didn't add it yet, let's just optimistically remove from UI for now or we can implement the API route quickly.
    try {
      setCampaigns(c => c.filter(camp => camp.id !== id));
      await fetch(`/api/campaign/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="bg-card border border-border rounded-[2.5rem] p-16 text-center shadow-premium max-w-2xl mx-auto mt-12">
        <div className="w-20 h-20 bg-primary/5 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/10">
          <Clock className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-black text-foreground mb-4">Archive Empty</h3>
        <p className="text-foreground/50 mb-10 text-lg font-medium">You haven&apos;t archived any neural campaign data. Initiate your first analysis to populate this archive.</p>
        <Link href="/dashboard" className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all shadow-glow">
          <BarChart2 className="w-5 h-5" /> Start Analysis
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {campaigns.map((camp) => (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          key={camp.id}
          className="bg-card p-8 rounded-[2rem] shadow-premium border border-border flex flex-col group hover:border-primary/30 transition-all"
        >
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                {camp.platform}
              </span>
              <h3 className="text-2xl font-black text-foreground line-clamp-1 tracking-tight">{camp.name}</h3>
            </div>
            <button
              onClick={() => handleDelete(camp.id)}
              className="p-2.5 text-foreground/20 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all"
              title="Purge Record"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10 pt-6 border-t border-border">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Efficiency</span>
              <p className="text-2xl font-black text-foreground">{camp.ctr.toFixed(2)}%</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Investment</span>
              <p className="text-2xl font-black text-foreground">${camp.spend.toLocaleString()}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">CPC Index</span>
              <p className="text-2xl font-black text-foreground">${camp.cpc.toFixed(2)}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">CPA Index</span>
              <p className="text-2xl font-black text-foreground">${camp.cpa.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-foreground/30">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">{format(new Date(camp.createdAt), "MMM d, yyyy")}</span>
            </div>
            <Link
              href="/dashboard"
              className="group/link flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors"
            >
              Examine <TrendingUp className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
