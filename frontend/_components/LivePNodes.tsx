"use client";

import { useEffect, useState } from "react";
import PNodeTable from "@/_components/PNodeTable";
import { fetchLivePNodes, PNode } from "@/_lib/api";

interface Props {
  refreshIntervalMs?: number;
}

export default function LivePNodes({
  refreshIntervalMs = 15000,
}: Props) {
  const [pnodes, setPNodes] = useState<PNode[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await fetchLivePNodes();
      setPNodes(data);
    } catch (err) {
      console.error("Failed to fetch live pNodes", err);
    } finally {
      setLoading(false);
    }
  }

  // Poll live pNode data every 15 seconds so the dashboard
// reflects near real-time network state without refreshing.
  useEffect(() => {
    // initial fetch
    load();

    // poll every X seconds
    const interval = setInterval(load, refreshIntervalMs);

    return () => clearInterval(interval);
  }, [refreshIntervalMs]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 text-gray-300">
        Loading live pNodes…
      </div>
    );
  }

  return (
    <PNodeTable
      title="Live pNodes"
      pnodes={pnodes}
      cardClassName="bg-gray-800"
      headerTextClass="text-gray-100"
      bodyTextClass="text-gray-200"
    />
  );
}
