import { TrendingUp, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function SummaryCards({ stats }) {
  const {
    total = 0,
    approved = 0,
    pending = 0,
    low = 0,
    medium = 0,
    high = 0,
  } = stats || {};

  const riskTotal = low + medium + high;

  const cardBase =
    "flex flex-col justify-between h-full p-6 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-opacity-90 backdrop-blur-sm";

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 my-10 px-6">
      {/* Total Applications */}
      <div className={`${cardBase} bg-gradient-to-br from-blue-50 to-white border-blue-200`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-blue-600">Total Applications</p>
          <div className="bg-blue-600 text-white p-2.5 rounded-lg shadow-inner">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <p className="text-5xl font-extrabold text-blue-800 mt-1">{total}</p>
        <p className="text-xs text-blue-500 mt-1">All loan requests received</p>
      </div>

      {/* Approved */}
      <div className={`${cardBase} bg-gradient-to-br from-emerald-50 to-white border-emerald-200`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-emerald-600">Approved</p>
          <div className="bg-emerald-600 text-white p-2.5 rounded-lg shadow-inner">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
        <p className="text-5xl font-extrabold text-emerald-800 mt-1">{approved}</p>
        <p className="text-xs text-emerald-500 mt-1">Loans approved successfully</p>
      </div>

      {/* Pending */}
      <div className={`${cardBase} bg-gradient-to-br from-amber-50 to-white border-amber-200`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-amber-600">Pending Review</p>
          <div className="bg-amber-500 text-white p-2.5 rounded-lg shadow-inner">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <p className="text-5xl font-extrabold text-amber-800 mt-1">{pending}</p>
        <p className="text-xs text-amber-500 mt-1">Awaiting verification or approval</p>
      </div>

      {/* Risk Breakdown */}
      <div className={`${cardBase} bg-gradient-to-br from-slate-50 to-white border-slate-200`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-slate-700 font-semibold">Risk Breakdown</p>
          <AlertTriangle className="w-5 h-5 text-slate-500" />
        </div>

        <div className="space-y-1 text-sm text-slate-700">
          <p className="flex justify-between">
            <span className="font-medium text-emerald-600">Low</span>
            <span className="font-semibold">{low}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium text-amber-600">Medium</span>
            <span className="font-semibold">{medium}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium text-red-600">High</span>
            <span className="font-semibold">{high}</span>
          </p>
          <div className="mt-3 text-xs text-slate-500 border-t border-slate-200 pt-2 flex justify-between">
            <span>Total analyzed</span>
            <span className="font-semibold text-slate-700">{riskTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
