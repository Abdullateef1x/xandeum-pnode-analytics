import PNodeHistoryChart from "@/_components/PNodeHistoryChart";
import LivePNodes from "@/_components/LivePNodes";

import { fetchHistoricalPNodes, PNode } from "@/_lib/api";
import HistoricalPNodesClient from "@/_components/HistoricalPNodesClient";

export type HistoricalPNodesResponse = {
  pnodes: PNode[];
  nextCursor: string | null;
};


export default async function DashboardPage() {
const { pnodes }: HistoricalPNodesResponse = await fetchHistoricalPNodes();

  return (
    <main className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Xandeum pNode Dashboard</h1>
          <p className="text-xs text-green-400">
            ● Live · refreshes every 15s
          </p>
          <p className="text-gray-300 text-sm">
            Live network state + historical snapshots
          </p>
        </header>

        <PNodeHistoryChart pnodes={pnodes} />

        {/*  Client-side polling */}
        <LivePNodes refreshIntervalMs={15000} />

        {/*  Server-rendered history */}
    <HistoricalPNodesClient />

      </div>
    </main>
  );
}
