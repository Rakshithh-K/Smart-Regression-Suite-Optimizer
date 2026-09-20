import { GitBranch, Sliders, CheckCircle2 } from "lucide-react";

function GitAutoHeader({ project, onEditConfig }) {
  const repository = project?.repository || "Rakshithh-K/Smart-Regression-Suite-Optimizer";
  const defaultBudget = project?.default_budget ?? 30;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Git Auto
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600 font-normal">
            Automated regression analysis triggered by GitHub changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEditConfig}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
          >
            <Sliders size={16} className="text-slate-500" />
            <span>Edit Configuration</span>
          </button>
        </div>
      </div>

      {/* Repository Metadata Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Repository
          </span>
          <span className="text-sm sm:text-base font-semibold text-slate-900 break-all">
            {repository}
          </span>
        </div>

        <div>
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Branch
          </span>
          <span className="text-sm sm:text-base font-medium text-slate-800 flex items-center gap-1.5">
            <GitBranch size={16} className="text-slate-400 shrink-0" />
            main
          </span>
        </div>

        <div>
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Regression Budget
          </span>
          <span className="text-sm sm:text-base font-medium text-slate-900">
            {defaultBudget} min
          </span>
        </div>

        <div>
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Connection
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs sm:text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={14} className="text-emerald-600" />
            Connected
          </span>
        </div>
      </div>
    </div>
  );
}

export default GitAutoHeader;
