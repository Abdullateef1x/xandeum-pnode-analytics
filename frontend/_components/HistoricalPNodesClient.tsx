"use client";

import { useEffect, useState } from "react";
import PNodeTable from "@/_components/PNodeTable";
import { fetchHistoricalPNodes, PNode } from "@/_lib/api";

type StatusFilter = "all" | "online" | "offline";

export default function HistoricalPNodesClient() {
  const [pnodes, setPNodes] = useState<PNode[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusFilter>("all");

  async function load(reset = false) {
    setLoading(true);

    const res = await fetchHistoricalPNodes(
      reset ? undefined : cursor ?? undefined,
      25,
      status === "all" ? undefined : status
    );

    setPNodes(prev => (reset ? res.pnodes : [...prev, ...res.pnodes]));
    setCursor(res.nextCursor);
    setLoading(false);
  }

  // Reload when filter changes
  useEffect(() => {
    setCursor(null);
    load(true);
  }, [status]);

  return (
    <div className="space-y-4">
      {/* Filter */}
 <div className="flex gap-2">
  {(["all", "online", "offline"] as StatusFilter[]).map((s) => {
    let bg = "bg-gray-700 hover:bg-gray-600 text-gray-200"; // default
    if (status === s) {
      if (s === "all") bg = "bg-gray-600 text-white";
      else if (s === "online") bg = "bg-green-600 text-white";
      else if (s === "offline") bg = "bg-red-600 text-white";
    }
    return (
      <button
        key={s}
        onClick={() => setStatus(s)}
        className={`px-3 py-1 rounded text-sm ${bg}`}
      >
        {s.toUpperCase()}
      </button>
    );
  })}
</div>


      <PNodeTable
        title={`Historical pNodes (${status})`}
        pnodes={pnodes}
        cardClassName="bg-gray-800"
        headerTextClass="text-gray-100"
        bodyTextClass="text-gray-200"
      />

      {cursor && (
        <div className="flex justify-center">
          <button
            onClick={() => load()}
            disabled={loading}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
