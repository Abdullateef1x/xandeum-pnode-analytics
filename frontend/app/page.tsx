import PNodeHistoryChart from "@/_components/PNodeHistoryChart";
import LivePNodes from "@/_components/LivePNodes";
import HistoricalPNodesClient from "@/_components/HistoricalPNodesClient";

import {
  fetchHistoricalPNodes,
  PNodeSnapshot,
} from "@/_lib/api";

export type HistoricalPNodesResponse = {
  pnodes: PNodeSnapshot[];
  nextCursor: string | null;
};

export default async function DashboardPage() {
  // Server-side fetch for initial chart render
  const { pnodes }: HistoricalPNodesResponse =
    await fetchHistoricalPNodes(undefined, 60);

  return (
    <main className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold">
            Xandeum pNode Dashboard
          </h1>

          <p className="text-xs text-green-400">
            ● Live · refreshes every 15s
          </p>

          <p className="text-gray-300 text-sm">
            Live network state + historical snapshots
          </p>
        </header>

        {/* Snapshot-based historical chart */}
        <PNodeHistoryChart pnodes={pnodes} />

        {/* Client-side polling for live table */}
        <LivePNodes refreshIntervalMs={15_000} />

        {/* Paginated snapshot history table */}
        <HistoricalPNodesClient />
      </div>
    </main>
  );
}
