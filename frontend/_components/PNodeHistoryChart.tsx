"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PNode } from "@/_lib/api";

interface Props {
  pnodes: PNode[]; // historical snapshots
}

type ChartPoint = {
  timestamp: number; // unix ms
  count: number;
};

export default function PNodeHistoryChart({ pnodes }: Props) {
  // Aggregate snapshots by minute
  const aggregated: Record<number, ChartPoint> = pnodes
    .filter((n) => n.fetchedAt)
    .map((n) => ({
      timestamp: new Date(n.fetchedAt!).getTime(),
      count: 1, // each snapshot counts as 1 node; adjust if storing batch counts
    }))
    .reduce<Record<number, ChartPoint>>((acc, point) => {
      const date = new Date(point.timestamp);
      const bucketTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes()
      ).getTime();

      acc[bucketTime] ??= { timestamp: bucketTime, count: 0 };
      acc[bucketTime].count += point.count;

      return acc;
    }, {});

  // Convert to sorted array
  let data: ChartPoint[] = Object.values(aggregated).sort((a, b) => a.timestamp - b.timestamp);

  // Auto-fill missing minutes for smooth curve
  if (data.length > 1) {
    const filled: ChartPoint[] = [];
    let lastCount = data[0].count;
    let current = data[0].timestamp;

    const end = data[data.length - 1].timestamp;

    while (current <= end) {
      if (aggregated[current]) {
        lastCount = aggregated[current].count;
      }
      filled.push({ timestamp: current, count: lastCount });
      current += 60_000; // next minute
    }

    data = filled;
  }

  const hasOffline = pnodes.some((n) => n.status === "offline");
  const lineColor = hasOffline ? "#ef4444" : "#3b82f6";

  if (!data.length) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No historical data yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        pNode Count Over Time
      </h2>

      <div className="w-full h-64 min-h-[16rem] bg-white rounded p-2 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

            <XAxis
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(ts) =>
                new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }
              stroke="#6b7280"
            />

            <YAxis allowDecimals={false} stroke="#6b7280" tick={{ fill: "#6b7280" }} />

            <Tooltip
              labelFormatter={(ts) => new Date(ts as number).toLocaleString()}
              contentStyle={{
                backgroundColor: "#f9fafb",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                color: "#111827",
              }}
            />

            <Line
              type="monotone"
              dataKey="count"
              stroke={lineColor}
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
