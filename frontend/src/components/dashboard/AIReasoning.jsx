import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

function AIReasoning({ explanations = {} }) {
  const selected = Object.entries(explanations?.selected_reasons || {});
  const excluded = Object.entries(explanations?.excluded_reasons || {});
  const [expandedSelected, setExpandedSelected] = useState({});
  const [expandedExcluded, setExpandedExcluded] = useState({});

  const toggleSelected = (testId) => {
    setExpandedSelected((prev) => ({ ...prev, [testId]: !prev[testId] }));
  };

  const toggleExcluded = (testId) => {
    setExpandedExcluded((prev) => ({ ...prev, [testId]: !prev[testId] }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Decision Rationale & Engineering Notes
        </h3>
        <p className="text-sm text-slate-500 mt-1 font-normal">
          Mathematical optimization trade-offs and individual test selection notes.
        </p>
      </div>

      {/* System Trade-off Box */}
      {explanations?.overall_tradeoff && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 sm:p-6 space-y-2 shadow-xs">
          <span className="text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-indigo-700 block">
            Budget Trade-Off Analysis
          </span>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            {explanations.overall_tradeoff}
          </p>
        </div>
      )}

      {/* 2 Columns: Selected vs Excluded Rationale */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Selected Tests Rationale */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-800">
              Why Selected ({selected.length})
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-mono">Payoff Priority</span>
          </div>

          <div className="space-y-2">
            {selected.map(([testId, reason]) => {
              const isExpanded = !!expandedSelected[testId];
              return (
                <div
                  key={testId}
                  className="rounded-lg border border-slate-200 bg-slate-50/50 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleSelected(testId)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-2 hover:bg-slate-100/70 transition"
                  >
                    <span className="font-mono text-sm sm:text-base font-semibold text-indigo-700">
                      {testId}
                    </span>
                    <span className="text-slate-400">
                      {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-3.5 pt-1.5 border-t border-slate-200 bg-white text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                      {reason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Excluded Tests Rationale */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-800">
              Why Excluded ({excluded.length})
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-mono">Budget Constraint</span>
          </div>

          <div className="space-y-2">
            {excluded.map(([testId, reason]) => {
              const isExpanded = !!expandedExcluded[testId];
              return (
                <div
                  key={testId}
                  className="rounded-lg border border-slate-200 bg-slate-50/50 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleExcluded(testId)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-2 hover:bg-slate-100/70 transition"
                  >
                    <span className="font-mono text-sm sm:text-base font-semibold text-amber-700">
                      {testId}
                    </span>
                    <span className="text-slate-400">
                      {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-3.5 pt-1.5 border-t border-slate-200 bg-white text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                      {reason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIReasoning;