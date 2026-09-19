import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

function RegressionRiskDebt({ riskDebt }) {
  if (!riskDebt) {
    return null;
  }

  const {
    has_debt,
    high_risk_excluded = 0,
    risk_debt_index = 0,
    deferred_time = 0,
    additional_time_required = 0,
    deferred_modules = [],
    deferred_tags = [],
  } = riskDebt;

  // No Debt State
  if (!has_debt) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                No Regression Risk Debt
              </h3>
              <p className="text-sm text-slate-600 mt-0.5 font-normal">
                All relevant high-risk regression tests are covered within the current test window.
              </p>
            </div>
          </div>
          <div className="sm:self-center">
            <span className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-emerald-800 bg-white border border-emerald-300 px-3.5 py-1.5 rounded-md shadow-2xs">
              <span>Risk Debt Index:</span>
              <span className="font-bold">0%</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Clamped index for horizontal progress bar
  const progressWidth = Math.min(100, Math.max(0, Number(risk_debt_index) || 0));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-semibold text-slate-900">
              Regression Risk Debt
            </h3>
            <span className="text-xs font-mono font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded">
              Attention Required
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            High-risk regression coverage deferred by the current test window.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-mono text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
            Deferred Runtime: <strong className="text-slate-900 font-semibold">{deferred_time} min</strong>
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Risk Debt Index */}
        <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 block font-mono">
            Risk Debt Index
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-amber-600 font-mono">
              {risk_debt_index}%
            </span>
          </div>
          {/* Progress Bar */}
          <div className="pt-1">
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: High-Risk Tests Unexecuted */}
        <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 block font-mono">
            Unexecuted Coverage
          </span>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-mono">
            {high_risk_excluded}
          </p>
          <p className="text-sm text-slate-600 font-normal">
            {high_risk_excluded} high-risk tests remain unexecuted
          </p>
        </div>

        {/* Metric 3: Additional Regression Time Required */}
        <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 block font-mono">
            Additional regression time required
          </span>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-indigo-600 font-mono">
            {additional_time_required} <span className="text-base font-medium text-slate-500 font-sans">min</span>
          </p>
          <p className="text-sm text-slate-600 font-normal">
            Required execution budget delta
          </p>
        </div>
      </div>

      {/* Explanatory Line */}
      <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-lg">
        <Info size={16} className="text-slate-400 shrink-0" />
        <span>
          Risk Debt Index is a measure of deferred high-risk regression coverage, not a failure probability.
        </span>
      </div>

      {/* Deferred Areas and Tags */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Deferred Areas */}
        <div className="space-y-2.5">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-700 block font-mono">
            Deferred areas
          </span>
          {deferred_modules.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {deferred_modules.map((module) => (
                <span
                  key={module}
                  className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-mono font-medium text-slate-800"
                >
                  {module}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">None</p>
          )}
        </div>

        {/* Deferred Tags */}
        <div className="space-y-2.5">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-700 block font-mono">
            Deferred Tags
          </span>
          {deferred_tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {deferred_tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-mono text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">None</p>
          )}
        </div>
      </div>

      {/* Recommendation Callout */}
      {additional_time_required > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 sm:p-5 flex items-start gap-3 text-amber-900">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-800 block mb-0.5">
              Budget Recommendation
            </span>
            <p className="text-sm font-medium leading-relaxed">
              Increase the regression window by {additional_time_required} minutes to execute all currently deferred high-risk tests.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegressionRiskDebt;
