import HistoryDetailClient from "../HistoryDetailClient";

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="pt-32 px-6">
      <HistoryDetailClient id={id} />
    </main>
  );
}
