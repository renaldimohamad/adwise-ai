import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Campaign Analysis</h1>
        <p className="text-gray-500 mt-2">Enter your campaign metrics below to get actionable AI insights.</p>
      </div>

      <DashboardClient />
    </div>
  );
}
