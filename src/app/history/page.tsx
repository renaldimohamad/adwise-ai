import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import HistoryClient from "./HistoryClient";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intelligence Archive",
  description: "Review and analyze your past advertising campaign performance insights.",
};

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <HistoryClient />
    </div>
  );
}
