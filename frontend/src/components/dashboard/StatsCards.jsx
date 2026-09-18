function StatsCards({ result }) {
  const timeUsed = result.recommendation?.total_execution_time ?? 0;
  const timeBudget = result.recommendation?.time_budget ?? 1;
  const pct = Math.min(100, Math.round((timeUsed / Math.max(timeBudget, 1)) * 100));
  const remaining = Math.max(0, timeBudget - timeUsed);
  const selectedCount = result.summary?.selected_count ?? 0;
  const highRiskExcluded = result.summary?.excluded_high_risk_count ?? 0;

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="SELECTED TESTS"
          value={selectedCount}
          subtext="Included in suite"
          accent="indigo"
        />
        <MetricCard
          label="EXECUTION TIME"
          value={`${timeUsed} min`}
          subtext="Planned runtime"
          accent="slate"
        />
        <MetricCard
          label="TIME BUDGET"
          value={`${timeBudget} min`}
          subtext="Allocated threshold"
          accent="slate"
        />
        <MetricCard
          label="HIGH-RISK EXCLUDED"
          value={highRiskExcluded}
          subtext={highRiskExcluded > 0 ? "Exceeded time budget" : "All critical tests fit"}
          accent={highRiskExcluded > 0 ? "amber" : "emerald"}
        />
      </div>

      {/* Budget Visualization */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-slate-900">
              Budget Utilization:
            </span>
            <span className="text-sm sm:text-base font-bold text-indigo-700 font-mono">
              {timeUsed} / {timeBudget} min
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
            <span className="rounded bg-emerald-50 px-2.5 py-1 text-emerald-700 border border-emerald-200">
              {pct}% used
            </span>
            <span className="text-slate-600">
              {remaining} min remaining
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              pct >= 100
                ? "bg-indigo-600"
                : pct > 75
                ? "bg-indigo-500"
                : "bg-emerald-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, subtext, accent }) {
  const accentClasses = {
    indigo: "text-indigo-600",
    amber: "text-amber-600",
    emerald: "text-emerald-600",
    slate: "text-slate-900",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <p className="text-xs sm:text-sm font-bold tracking-wider text-slate-500 uppercase">
        {label}
      </p>
      <p className={`mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight ${accentClasses[accent] || accentClasses.slate}`}>
        {value}
      </p>
      {subtext && (
        <p className="mt-1 text-xs sm:text-sm font-medium text-slate-400">
          {subtext}
        </p>
      )}
    </div>
  );
}

export default StatsCards;