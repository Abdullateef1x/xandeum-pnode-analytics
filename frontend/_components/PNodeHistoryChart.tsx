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
  pnodes: PNode[]; // historical snapshots
}

type ChartPoint = {
  timestamp: number;
  count: number;
};

export default function PNodeHistoryChart({ pnodes }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<ChartPoint[]>([]);
  const [hasOffline, setHasOffline] = useState(false);
  const [containerHeight, setContainerHeight] = useState(300);

  useEffect(() => {
    if (!pnodes || !pnodes.length) return;

    const aggregated: Record<number, ChartPoint> = {};
    let offlineFlag = false;

    pnodes.forEach((n) => {
      if (!n.fetchedAt) return;

      const ts = new Date(n.fetchedAt).getTime();
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

      if (n.status === "offline") offlineFlag = true;
    });

    // Sort
    let chartData: ChartPoint[] = Object.values(aggregated).sort(
      (a, b) => a.timestamp - b.timestamp
    );

    // Auto-fill missing minutes
    if (chartData.length > 1) {
      const filled: ChartPoint[] = [];
      let lastCount = chartData[0].count;
      let current = chartData[0].timestamp;
      const end = chartData[chartData.length - 1].timestamp;

      while (current <= end) {
        if (aggregated[current]) lastCount = aggregated[current].count;
        filled.push({ timestamp: current, count: lastCount });
        current += 60_000;
      }
      chartData = filled;
    }

    setData(chartData);
    setHasOffline(offlineFlag);
  }, [pnodes]);

  useEffect(() => {
    if (containerRef.current) setContainerHeight(containerRef.current.clientHeight);
  }, []);

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
        )}
      </div>
    </div>
  );
}
