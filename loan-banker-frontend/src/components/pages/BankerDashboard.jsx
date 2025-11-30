import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CheckCircle, Clock, TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react";
import SummaryCards from "../SummaryCards";
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8000",
});

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export default function BankerDashboard() {
  const [applications, setApplications] = useState([]);

  const fetchApps = async () => {
    try {
      const res = await client.get("/banker/applications");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApps();
    const interval = setInterval(fetchApps, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (id) => {
    try {
      await client.post(`/banker/applications/${id}/verify`, { is_verified: true });
      fetchApps();
    } catch {}
  };

  const handleAnalyze = async (id) => {
    try {
      await client.post(`/banker/applications/${id}/analyze`);
      fetchApps();
    } catch {}
  };

  const handleDecision = async (id, approved) => {
    try {
      await client.post(`/banker/applications/${id}/decision`, { approved });
      fetchApps();
    } catch {}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-2.5 rounded-xl shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Loan Management
              </h1>
              <p className="text-sm text-slate-500">Banker Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-700">Live Updates</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary Section */}
        <SummaryCards
          stats={{
            total: applications.length,
            approved: applications.filter(a => a.approved).length,
            pending: applications.filter(a => !a.approved && a.is_verified).length,
            low: applications.filter(a => a.risk_label === "Low").length,
            medium: applications.filter(a => a.risk_label === "Medium").length,
            high: applications.filter(a => a.risk_label === "High").length,
          }}
        />

        {/* Risk Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-800">Risk Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summary.riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {summary.riskData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Loan Applications</h2>
            <p className="text-sm text-slate-500 mt-1">Review and process customer applications</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Income</th>
                  <th className="px-6 py-4">Loan Amount</th>
                  <th className="px-6 py-4">Risk</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4 font-mono text-slate-700">#{app.id}</td>
                    <td className="px-6 py-4">{app.full_name}</td>
                    <td className="px-6 py-4">₹{app.monthly_income?.toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold">₹{app.requested_loan_amount?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {app.risk_label ? (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            app.risk_label === "Low"
                              ? "bg-emerald-100 text-emerald-700"
                              : app.risk_label === "Medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {app.risk_label}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {!app.is_verified && (
                          <button
                            onClick={() => handleVerify(app.id)}
                            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                          >
                            Verify
                          </button>
                        )}
                        {app.is_verified && !app.analysis_run && (
                          <button
                            onClick={() => handleAnalyze(app.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                          >
                            Analyze
                          </button>
                        )}
                        {app.analysis_run && !app.approved && (
                          <>
                            <button
                              onClick={() => handleDecision(app.id, true)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDecision(app.id, false)}
                              className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {app.approved && (
                          <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-lg flex items-center">
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Approved
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
