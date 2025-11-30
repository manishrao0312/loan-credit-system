export default function LandingPage() {
  return (
    <div className="text-white min-h-screen flex flex-col items-center justify-center relative overflow-hidden selection:bg-cyan-500 selection:text-white bg-[#030816]">
      {/* Background Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] -z-10"></div>

      {/* Main */}
      <main className="container mx-auto px-4 flex flex-col items-center py-12 z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-blue-500 mb-2 tracking-tight">
          FinFlow
        </h1>

        <h2 className="text-xl md:text-2xl font-semibold text-gray-100 mb-4">
          Smart Lending, Simplified
        </h2>

        <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm text-cyan-200 mb-8 font-medium">
          <span className="flex items-center"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></span> Lightning Fast</span>
          <span className="flex items-center"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></span> 100% Secure</span>
          <span className="flex items-center"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></span> Transparent</span>
        </div>

        <p className="text-slate-400 text-center max-w-lg mb-10 leading-relaxed text-sm md:text-base">
          Get instant loan approval in minutes. No hidden fees. No complex paperwork. Just you, us, and fair lending.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-12">
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 text-center hover:bg-slate-800/60 transition duration-300">
            <div className="text-3xl font-bold text-cyan-400 mb-1">500+</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Happy Borrowers</div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 text-center hover:bg-slate-800/60 transition duration-300">
            <div className="text-3xl font-bold text-cyan-400 mb-1">&lt;5min</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Quick Approval</div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 text-center hover:bg-slate-800/60 transition duration-300">
            <div className="text-3xl font-bold text-cyan-400 mb-1">₹50L+</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Loans Disbursed</div>
          </div>
        </div>

        {/* Button → Loan Form */}
        <a
          href="/apply"
          className="btn-glow bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 px-8 rounded-full transform transition hover:scale-105 duration-200 flex items-center group"
        >
          Start Your Application
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>

        <p className="text-slate-600 text-xs mt-3 mb-16">Takes just 5 minutes • Instant decision</p>

        <div className="w-full max-w-2xl bg-slate-900/40 border border-slate-800/50 rounded-xl py-6 px-4">
          <p className="text-center text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Trusted by leading Indian banks
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 font-bold text-lg md:text-xl">
            <span className="hover:text-slate-300 transition cursor-default">HDFC</span>
            <span className="hover:text-slate-300 transition cursor-default">ICICI</span>
            <span className="hover:text-slate-300 transition cursor-default">SBI</span>
            <span className="hover:text-slate-300 transition cursor-default">Axis</span>
          </div>
        </div>
      </main>
    </div>
  );
}
