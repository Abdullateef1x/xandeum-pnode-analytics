"use client";

import { useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PNodeSnapshot } from "@/_lib/api";

interface Props {
  pnodes: PNodeSnapshot[];
}

type ChartPoint = {
  timestamp: number;
  total: number;
  online: number;
  offline: number;
};

export default function PNodeHistoryChart({ pnodes }: Props) {
  /**
   * Transform snapshots → continuous minute-by-minute chart data
   */
  const data: ChartPoint[] = useMemo(() => {
    if (!pnodes || pnodes.length === 0) return [];

    // Sort ascending (important for charts)
    const sorted = [...pnodes].sort(
      (a, b) =>
        new Date(a.fetchedAt).getTime() -
        new Date(b.fetchedAt).getTime()
    );

    // Aggregate by minute
    const buckets = new Map<number, ChartPoint>();

    for (const snap of sorted) {
      const ts = new Date(snap.fetchedAt);
      const bucketTs = new Date(
        ts.getFullYear(),
        ts.getMonth(),
        ts.getDate(),
        ts.getHours(),
        ts.getMinutes(),
        0,
        0
      ).getTime();

      buckets.set(bucketTs, {
        timestamp: bucketTs,
        total: snap.total,
        online: snap.online,
        offline: snap.offline,
      });
    }

    const times = Array.from(buckets.keys()).sort((a, b) => a - b);
    if (times.length === 0) return [];

    // Fill missing minutes for smooth lines
    const filled: ChartPoint[] = [];
    let current = times[0];
    const end = times[times.length - 1];

    let last = buckets.get(current)!;

    while (current <= end) {
      const existing = buckets.get(current);
      if (existing) last = existing;

      filled.push({
        timestamp: current,
        total: last.total,
        online: last.online,
        offline: last.offline,
      });

      current += 60_000;
    }

    return filled;
  }, [pnodes]);

  if (data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl shadow p-4">
        <p className="text-sm text-gray-400">
          No historical snapshot data yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-100">
        pNode Count Over Time
      </h2>

      <div className="w-full h-64 min-h-[16rem] bg-gray-900 rounded p-2 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="#374151" strokeDasharray="3 3" />

            <XAxis
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(ts) =>
                new Date(ts).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
              stroke="#9ca3af"
            />

            <YAxis
              allowDecimals={false}
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
            />

            <Tooltip
              labelFormatter={(ts) =>
                new Date(ts as number).toLocaleString()
              }
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
                color: "#f9fafb",
              }}
            />

            {/* Total */}
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />

            {/* Online */}
            <Line
              type="monotone"
              dataKey="online"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />

            {/* Offline */}
            <Line
              type="monotone"
              dataKey="offline"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
