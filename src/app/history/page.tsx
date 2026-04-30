import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen">
      <div className="mb-20 space-y-6">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
          <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
          Archive & Intelligence
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.9]">
          Analysis <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">Vault</span>
        </h1>
        <p className="text-xl md:text-2xl font-medium text-foreground/40 max-w-2xl leading-relaxed">
          Deep dive into your past campaign performance and AI-driven strategic insights.
        </p>
      </div>

      <HistoryClient />
    </div>
  );
}
