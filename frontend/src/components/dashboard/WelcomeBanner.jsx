import { ArrowRight, Sparkles, SlidersHorizontal, ShieldCheck, CheckCircle2 } from "lucide-react";

function WelcomeBanner() {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md bg-indigo-50 border border-indigo-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-3">
             
            Deterministic Test Suite Optimization
          </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                Smart Regression Suite Optimizer
            </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Prioritize and select high-impact regression tests based on change relevance, defect history, and execution runtime constraints.
          </p>
        </div>

        {/* Workflow steps */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium">
          <WorkflowBadge icon={<SlidersHorizontal size={14} />} text="1. Change Diff" />
          <ArrowRight size={14} className="text-slate-300 shrink-0" />
          <WorkflowBadge icon={<ShieldCheck size={14} />} text="2. Risk Scoring" />
          <ArrowRight size={14} className="text-slate-300 shrink-0" />
          <div className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 font-semibold text-white shadow-xs">
            <CheckCircle2 size={16} />
            3. Optimized Suite
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowBadge({ icon, text }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 font-medium">
      {icon}
      <span>{text}</span>
    </div>
  );
}

export default WelcomeBanner;