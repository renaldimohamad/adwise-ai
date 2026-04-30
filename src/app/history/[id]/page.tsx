import { Metadata } from "next";
import HistoryDetailClient from "../HistoryDetailClient";

export const metadata: Metadata = {
  title: "Analysis Detail",
  description: "Detailed AI analysis and performance metrics for your campaign.",
};

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="pt-5 lg:pt-32 px-6">
      <HistoryDetailClient id={id} />
    </main>
  );
}
