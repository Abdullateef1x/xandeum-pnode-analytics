"use client";

import { useEffect, useState } from "react";
import { fetchHistoricalPNodes, PNodeSnapshot } from "@/_lib/api";

export default function HistoricalPNodesClient() {
  const [snapshots, setSnapshots] = useState<PNodeSnapshot[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(reset = false) {
    setLoading(true);
    try {
      const res = await fetchHistoricalPNodes(reset ? undefined : cursor ?? undefined, 25);
      setSnapshots((prev) => (reset ? res.pnodes : [...prev, ...res.pnodes]));
      setCursor(res.nextCursor);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setCursor(null);
    load(true);
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-xl shadow p-4 bg-gray-800">
        <h2 className="text-lg font-semibold mb-3 text-gray-100">
          Historical pNode Snapshots
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col className="w-1/3" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
            </colgroup>

            <thead className="border-b border-gray-600 text-gray-300">
              <tr>
                <th className="py-2">Time</th>
                <th>Status</th>
                <th>Online</th>
                <th>Offline</th>
              </tr>
            </thead>

            <tbody>
              {snapshots.map((s) => (
                <tr key={s.fetchedAt.toString()} className="border-b last:border-0">
                  <td className="py-2 text-gray-200">{new Date(s.fetchedAt).toLocaleString()}</td>
                  <td className="py-2 text-gray-200 text-center">{s.total === s.online + s.offline ? "✅" : "⚠️"}</td>
                  <td className="text-green-400 text-center">{s.online}</td>
                  <td className="text-red-400 text-center">{s.offline}</td>
                </tr>
              ))}
              {snapshots.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No snapshot data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
