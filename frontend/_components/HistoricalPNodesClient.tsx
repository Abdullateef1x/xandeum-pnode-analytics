"use client";

import { useEffect, useState } from "react";
import { fetchHistoricalPNodes, PNodeSnapshot } from "@/_lib/api";

type StatusFilter = "all" | "online" | "offline";

export default function HistoricalPNodesClient() {
  const [snapshots, setSnapshots] = useState<PNodeSnapshot[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusFilter>("all");

  async function load(reset = false) {
    setLoading(true);

    try {
      const res = await fetchHistoricalPNodes(
        reset ? undefined : cursor ?? undefined,
        25,
        status === "all" ? undefined : status
      );

      setSnapshots((prev) =>
        reset ? res.pnodes : [...prev, ...res.pnodes]
      );
      setCursor(res.nextCursor);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to load historical snapshots", err);
      }
    } finally {
      setLoading(false);
    }
  }

  // Reload when filter changes
  useEffect(() => {
    setCursor(null);
    load(true);
  }, [status]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "online", "offline"] as StatusFilter[]).map((s) => {
          let bg = "bg-gray-700 hover:bg-gray-600 text-gray-200";
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

      {/* Snapshot Table */}
      <div className="rounded-xl shadow p-4 bg-gray-800">
        <h2 className="text-lg font-semibold mb-3 text-gray-100">
          Historical pNode Snapshots
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="border-b border-gray-600">
              <tr className="text-left text-gray-300">
                <th className="py-2 w-1/3">Time</th>
                <th className="w-1/6">Total</th>
                <th className="w-1/6">Online</th>
                <th className="w-1/6">Offline</th>
              </tr>
            </thead>

            <tbody>
              {snapshots.map((s) => (
                <tr key={s.fetchedAt} className="border-b last:border-0">
                  <td className="py-2 text-gray-200">
                    {new Date(s.fetchedAt).toLocaleString()}
                  </td>
                  <td className="text-gray-200">{s.total}</td>
                  <td className="text-green-400">{s.online}</td>
                  <td className="text-red-400">{s.offline}</td>
                </tr>
              ))}

              {snapshots.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-gray-400"
                  >
                    No snapshot data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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
