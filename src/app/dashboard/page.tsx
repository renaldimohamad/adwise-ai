import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Analyze your campaign performance with advanced AI insights.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <DashboardClient />
    </div>
  );
}
