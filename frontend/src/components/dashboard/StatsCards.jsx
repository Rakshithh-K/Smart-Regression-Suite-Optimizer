function StatsCards({ result }) {
  const timeUsed = result.recommendation?.total_execution_time ?? 0;
  const timeBudget = result.recommendation?.time_budget ?? 1;
  const pct = Math.min(100, Math.round((timeUsed / Math.max(timeBudget, 1)) * 100));
  const remaining = Math.max(0, timeBudget - timeUsed);
  const selectedCount = result.summary?.selected_count ?? 0;
  const highRiskExcluded = result.summary?.excluded_high_risk_count ?? 0;

  const formatCount = (n) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Coherent 4-column information system */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
        {/* Selected Tests */}
        <div className="p-5 sm:p-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
            Selected Tests
          </span>
          <p className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-mono">
            {formatCount(selectedCount)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Included in regression suite
          </p>
        </div>

        {/* Execution Time */}
        <div className="p-5 sm:p-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
            Execution
          </span>
          <p className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-indigo-600 font-mono">
            {timeUsed} <span className="text-base font-medium text-slate-500 font-sans">min</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {pct}% of allocated budget
          </p>
        </div>

        {/* Time Budget */}
        <div className="p-5 sm:p-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
            Time Budget
          </span>
          <p className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-slate-800 font-mono">
            {timeBudget} <span className="text-base font-medium text-slate-500 font-sans">min</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {remaining} min remaining capacity
          </p>
        </div>

        {/* High-Risk Excluded */}
        <div className="p-5 sm:p-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
            High-Risk Excluded
          </span>
          <p
            className={`mt-2 text-3xl sm:text-4xl font-black tracking-tight font-mono ${
              highRiskExcluded > 0 ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            {formatCount(highRiskExcluded)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {highRiskExcluded > 0 ? "Requires additional execution time" : "All critical tests fit"}
          </p>
        </div>
      </div>

      {/* Slim integrated budget progress bar */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
          <span>Budget Utilization:</span>
          <span className="text-slate-900 font-bold">{timeUsed}m / {timeBudget}m</span>
          <span>({pct}%)</span>
        </div>

        <div className="flex-1 max-w-xs h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              pct >= 100
                ? "bg-amber-500"
                : pct > 80
                ? "bg-indigo-600"
                : "bg-emerald-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default StatsCards;