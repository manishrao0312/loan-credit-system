import { useEffect, useState } from "react";
import client from "../../api/client.jsx";
import toast, { Toaster } from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#facc15", "#ef4444"]; // green, yellow, red

export default function BankerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApps = async () => {
    try {
      const res = await client.get("/banker/applications");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch applications.");
    }
  };

  useEffect(() => {
    fetchApps();
    const interval = setInterval(fetchApps, 8000); // auto-refresh every 8s
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (id) => {
    try {
      await client.post(`/banker/applications/${id}/verify`, { is_verified: true });
      toast.success("Application verified");
      fetchApps();
    } catch {
      toast.error("Verification failed");
    }
  };

  const handleAnalyze = async (id) => {
    try {
      await client.post(`/banker/applications/${id}/analyze`);
      toast.success("Analysis completed");
      fetchApps();
    } catch {
      toast.error("ML analysis failed");
    }
  };

  const handleDecision = async (id, approved) => {
    try {
      await client.post(`/banker/applications/${id}/decision`, { approved });
      toast.success(approved ? "Loan Approved" : "Loan Rejected");
      fetchApps();
    } catch {
      toast.error("Decision failed");
    }
  };

  const summary = {
    total: applications.length,
    verified: applications.filter(a => a.is_verified).length,
    approved: applications.filter(a => a.approved).length,
    riskData: [
      { name: "Low", value: applications.filter(a => a.risk_label === "Low").length },
      { name: "Medium", value: applications.filter(a => a.risk_label === "Medium").length },
      { name: "High", value: applications.filter(a => a.risk_label === "High").length },
    ],
  };

  return (
    <div className="p-8">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-6 text-center">🏦 Banker Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <SummaryCard title="Total Applications" value={summary.total} color="bg-blue-500" />
        <SummaryCard title="Verified" value={summary.verified} color="bg-yellow-500" />
        <SummaryCard title="Approved" value={summary.approved} color="bg-green-600" />
      </div>

      {/* Risk Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">Risk Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={summary.riskData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {summary.riskData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Applications Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Applications</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Income</th>
              <th className="p-2 border">Loan</th>
              <th className="p-2 border">Risk</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="text-sm border-t">
                <td className="p-2 border">{app.id}</td>
                <td className="p-2 border">{app.full_name}</td>
                <td className="p-2 border">₹{app.monthly_income}</td>
                <td className="p-2 border">₹{app.requested_loan_amount}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      app.risk_label === "High"
                        ? "bg-red-100 text-red-600"
                        : app.risk_label === "Medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {app.risk_label || "—"}
                  </span>
                </td>
                <td className="p-2 border space-x-2">
                  {!app.is_verified && (
                    <button
                      onClick={() => handleVerify(app.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Verify
                    </button>
                  )}
                  {app.is_verified && !app.analysis_run && (
                    <button
                      onClick={() => handleAnalyze(app.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Analyze
                    </button>
                  )}
                  {app.analysis_run && (
                    <button
                      onClick={() => handleDecision(app.id, true)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Approve
                    </button>
                  )}
                  {app.analysis_run && (
                    <button
                      onClick={() => handleDecision(app.id, false)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className={`p-4 text-white rounded-xl shadow ${color}`}>
      <h3 className="text-sm uppercase">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
