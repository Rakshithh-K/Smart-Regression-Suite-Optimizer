import { ArrowRight } from "lucide-react";

function WelcomeBanner() {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-slate-200">
      {/* Left Column: Eyebrow + Large Title + Description */}
      <div className="max-w-3xl">
        <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600 block mb-2 font-mono">
          Regression Optimization
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
          Smart Regression Suite Optimizer
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Mathematically select the highest-impact regression tests based on change relevance, historical defect signals, and execution budget.
        </p>
      </div>

      {/* Right Column: Compact Linear Workflow */}
      <div className="flex items-center gap-2.5 text-sm font-medium text-slate-500 shrink-0 pb-1">
        <span className="rounded-md bg-slate-100 border border-slate-200 px-3 py-1.5 text-slate-700 font-medium">
          Change
        </span>
        <ArrowRight size={15} className="text-slate-400 shrink-0" />
        <span className="rounded-md bg-slate-100 border border-slate-200 px-3 py-1.5 text-slate-700 font-medium">
          Risk
        </span>
        <ArrowRight size={15} className="text-slate-400 shrink-0" />
        <span className="rounded-md bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-indigo-700 font-semibold">
          Optimize
        </span>
      </div>
    </div>
  );
}

export default WelcomeBanner;