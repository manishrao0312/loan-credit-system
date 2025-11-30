import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#eab308", "#ef4444"]; // low, medium, high

export default function RiskChart({ stats }) {
  const data = [
    { name: "Low", value: stats.low },
    { name: "Medium", value: stats.medium },
    { name: "High", value: stats.high },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow text-sm text-gray-500">
        No analyzed applications yet to show risk chart.
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow h-64">
      <h3 className="font-semibold mb-2 text-sm">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
