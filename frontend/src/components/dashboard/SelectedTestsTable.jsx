import { useState } from "react";
import { ChevronDown, ChevronRight, Clock, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

function SelectedTestsTable({ tests = [], recommendation = {}, aiExplanations = {} }) {
  const [expandedId, setExpandedId] = useState(null);
  const reasons = aiExplanations?.selected_reasons || {};

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-indigo-600" />
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Selected Regression Tests
            </h3>
            <span className="rounded-full bg-indigo-50 px-3 py-0.5 text-sm font-bold text-indigo-700 border border-indigo-200">
              {tests.length} tests
            </span>
          </div>
          <p className="mt-1 text-sm sm:text-base text-slate-600">
            {recommendation?.total_execution_time ?? 0} / {recommendation?.time_budget ?? 0} min execution budget utilized
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Click any row to view selection rationale
        </p>
      </div>

      {tests.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          No tests selected within the current constraints.
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map((test) => {
            const isExpanded = expandedId === test.test_id;
            const reason = reasons[test.test_id];
            const relevance = Number(test.relevance_score ?? 0).toFixed(1);
            const priorityScore = Number(test.priority_score ?? 0).toFixed(1);
            const failures = test.historical_failure_count ?? 0;

            return (
              <div
                key={test.test_id}
                className={`rounded-xl border bg-white transition-all shadow-xs overflow-hidden ${
                  isExpanded
                    ? "border-indigo-500 ring-2 ring-indigo-500/10"
                    : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                }`}
              >
                {/* Compact Clickable Row */}
                <button
                  type="button"
                  onClick={() => toggleExpand(test.test_id)}
                  className="w-full text-left p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isExpanded}
                >
                  {/* Left Column: ID + Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono text-sm font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100">
                        {test.test_id}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                        {test.module}
                      </span>
                      {test.priority && (
                        <PriorityBadge priority={test.priority} />
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
                      {test.description || "Regression verification test case"}
                    </h4>
                  </div>

                  {/* Right Column: Horizontally Aligned Metadata + Chevron */}
                  <div className="flex items-center flex-wrap sm:flex-nowrap gap-4 lg:gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Duration */}
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                      <Clock size={16} className="text-slate-400" />
                      <span>{test.duration} min</span>
                    </div>

                    {/* Relevance */}
                    <div className="text-sm font-medium text-slate-600">
                      <span className="text-slate-400 mr-1 text-xs uppercase font-semibold">Rel:</span>
                      <span className="font-semibold text-slate-800">{relevance}</span>
                    </div>

                    {/* Historical Failures */}
                    <div className="text-sm font-medium text-slate-600">
                      <span className="text-slate-400 mr-1 text-xs uppercase font-semibold">Failures:</span>
                      <span className="font-semibold text-slate-800">{failures}</span>
                    </div>

                    {/* Priority Score */}
                    <div className="rounded-md bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 text-xs sm:text-sm font-bold text-indigo-700">
                      Score {priorityScore}
                    </div>

                    {/* Chevron Indicator */}
                    <div className="text-slate-400 hover:text-indigo-600 transition-colors ml-auto sm:ml-0">
                      {isExpanded ? (
                        <ChevronDown size={22} className="text-indigo-600" />
                      ) : (
                        <ChevronRight size={22} />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="border-t border-slate-200/80 bg-slate-50/50 p-5 sm:p-6 transition-all">
                    {/* Full Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-white border border-slate-200 mb-5">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                          Test Identifier
                        </span>
                        <span className="font-mono text-sm font-bold text-slate-900">
                          {test.test_id}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                          Assigned Module
                        </span>
                        <span className="text-sm font-bold text-slate-800 capitalize">
                          {test.module}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                          Historical Failures
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {failures} detected
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                          Knapsack Priority
                        </span>
                        <span className="text-sm font-bold text-indigo-700">
                          {priorityScore} pts
                        </span>
                      </div>
                    </div>

                    {/* WHY SELECTED - Large, comfortable typography */}
                    <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-5">
                      <div className="flex items-center gap-2 mb-2 text-indigo-900">
                        <Sparkles size={18} className="text-indigo-600" />
                        <h5 className="text-sm font-bold uppercase tracking-wider text-indigo-800">
                          Why Selected
                        </h5>
                      </div>
                      <p className="text-base sm:text-[17px] text-slate-800 leading-relaxed max-w-4xl">
                        {reason ||
                          `TC${test.test_id} was selected because of its high payoff index (${priorityScore}) and direct relevance (${relevance}) to the specified change description. Its runtime of ${test.duration} min fits optimally into the execution budget.`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    High: "text-rose-700 bg-rose-50 border-rose-200",
    Medium: "text-amber-700 bg-amber-50 border-amber-200",
    Low: "text-slate-700 bg-slate-100 border-slate-200",
  };

  return (
    <span
      className={`rounded px-2.5 py-0.5 text-xs sm:text-sm font-semibold border ${
        styles[priority] || styles.Low
      }`}
    >
      {priority}
    </span>
  );
}

export default SelectedTestsTable;