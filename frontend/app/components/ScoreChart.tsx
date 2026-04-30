"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ScoreChart({ results }: any) {
  const data = results.map((r: any, i: number) => ({
    name: `C${i + 1}`,
    score: r.score,
  }));

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
      <h3 className="mb-4">Score Distribution</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#4ade80"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}