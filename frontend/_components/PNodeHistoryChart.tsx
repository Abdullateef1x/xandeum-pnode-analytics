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
  pnodes: PNode[];
}

export default function PNodeHistoryChart({ pnodes }: Props) {
  // Transform historical pNodes into [{ time, count }]
  const data = Object.values(
    pnodes.reduce<Record<string, { time: string; count: number }>>(
      (acc, node) => {
        if (!node.fetchedAt) return acc;

        const time = new Date(node.fetchedAt).toLocaleTimeString();
        acc[time] = acc[time] || { time, count: 0 };
        acc[time].count += 1;

        return acc;
      },
      {}
    )
  );

  // Detect if there are any offline nodes to color the line
  const hasOffline = pnodes.some((n) => n.status === "offline");
  const lineColor = hasOffline ? "#ef4444" : "#3b82f6"; // red if offline, blue otherwise

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

      {/* Chart container with white background for readability */}
      <div className="w-full h-64 min-h-[16rem] bg-white rounded p-2 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            {/* Grid */}
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            {/* Axes */}
            <XAxis dataKey="time" stroke="#6b7280" tick={{ fill: "#6b7280" }} />
            <YAxis allowDecimals={false} stroke="#6b7280" tick={{ fill: "#6b7280" }} />
            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#f9fafb",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                color: "#111827",
              }}
            />
            {/* Line */}
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
