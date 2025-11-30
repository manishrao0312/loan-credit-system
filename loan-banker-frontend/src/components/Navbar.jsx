export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center shadow">
      <span className="font-bold text-lg">Loan Management – Banker</span>
      <span className="text-xs text-slate-300">
        Auto-refreshing dashboard
      </span>
    </nav>
  );
}
