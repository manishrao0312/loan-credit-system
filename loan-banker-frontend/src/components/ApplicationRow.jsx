import { motion } from "framer-motion";
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
    "p-5 rounded-2xl border shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm bg-opacity-80";

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.1 },
        },
      }}
    >
      {/* Total Applications */}
      <motion.div variants={fadeUp} className={`${cardBase} bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-semibold tracking-wide">Total Applications</p>
            <motion.p
              key={total}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-extrabold text-blue-800 mt-2 drop-shadow-sm"
            >
              {total}
            </motion.p>
            <p className="text-xs text-blue-500 mt-1">All loan requests received</p>
          </div>
          <div className="bg-blue-600 text-white p-3 rounded-xl shadow-inner shadow-blue-300/30">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      {/* Approved */}
      <motion.div variants={fadeUp} className={`${cardBase} bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-600 font-semibold tracking-wide">Approved</p>
            <motion.p
              key={approved}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-extrabold text-emerald-800 mt-2 drop-shadow-sm"
            >
              {approved}
            </motion.p>
            <p className="text-xs text-emerald-500 mt-1">Loans approved successfully</p>
          </div>
          <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-inner shadow-emerald-300/30">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      {/* Pending */}
      <motion.div variants={fadeUp} className={`${cardBase} bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-amber-600 font-semibold tracking-wide">Pending Review</p>
            <motion.p
              key={pending}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-extrabold text-amber-800 mt-2 drop-shadow-sm"
            >
              {pending}
            </motion.p>
            <p className="text-xs text-amber-500 mt-1">Awaiting verification or approval</p>
          </div>
          <div className="bg-amber-500 text-white p-3 rounded-xl shadow-inner shadow-amber-300/30">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      {/* Risk Breakdown */}
      <motion.div variants={fadeUp} className={`${cardBase} bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-slate-700 font-semibold tracking-wide">Risk Breakdown</p>
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
      </motion.div>
    </motion.div>
  );
}
