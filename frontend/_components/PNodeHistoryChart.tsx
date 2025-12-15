"use client";

import { useEffect, useRef, useState } from "react";
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
  pnodes: PNode[]; // historical snapshots passed from server
}

type ChartPoint = {
  timestamp: number; // unix ms
  count: number;
};

export default function PNodeHistoryChart({ pnodes }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(300); // fallback

  // Measure container height to avoid width/height -1 warning
  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.clientHeight;
      if (height > 0) setContainerHeight(height);
    }
  }, []);

  // Aggregate pNodes per minute
  let aggregated: Record<number, ChartPoint> = {};
  let hasOffline = false;

  pnodes.forEach((node) => {
    if (!node.fetchedAt) return;

    const ts = new Date(node.fetchedAt).getTime();
    const date = new Date(ts);
    const bucketTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    ).getTime();

    aggregated[bucketTime] ??= { timestamp: bucketTime, count: 0 };
    aggregated[bucketTime].count += 1;

    if (node.status === "offline") hasOffline = true;
  });

  // Convert to sorted array
  let data: ChartPoint[] = Object.values(aggregated).sort(
    (a, b) => a.timestamp - b.timestamp
  );

  // Auto-fill missing minutes for smooth wavy line
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

  if (!data.length) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No historical data yet
        </p>
      </div>
    );
  }

  const lineColor = hasOffline ? "#ef4444" : "#3b82f6";

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        pNode Count Over Time
      </h2>

      <div
        ref={containerRef}
        className="w-full h-64 min-h-[16rem] bg-white rounded p-2 shadow-inner"
      >
        {containerHeight > 0 && (
          <ResponsiveContainer width="100%" height={containerHeight}>
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
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
        )}
      </div>
    </div>
  );
}
