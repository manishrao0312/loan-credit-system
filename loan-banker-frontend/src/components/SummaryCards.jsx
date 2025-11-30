export default function SummaryCards({ stats }) {
  const { total, approved, pending, low, medium, high } = stats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
      <div className="bg-white p-4 rounded shadow">
        <p className="text-xs text-gray-500">Total Applications</p>
        <p className="text-2xl font-bold">{total}</p>
      </div>
      <div className="bg-green-50 p-4 rounded shadow">
        <p className="text-xs text-green-700">Approved</p>
        <p className="text-2xl font-bold text-green-800">{approved}</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded shadow">
        <p className="text-xs text-yellow-700">Pending</p>
        <p className="text-2xl font-bold text-yellow-800">{pending}</p>
      </div>
      <div className="bg-slate-50 p-4 rounded shadow text-xs">
        <p className="font-semibold mb-1">Risk Breakdown</p>
        <p>Low: {low}</p>
        <p>Medium: {medium}</p>
        <p>High: {high}</p>
      </div>
    </div>
  );
}
