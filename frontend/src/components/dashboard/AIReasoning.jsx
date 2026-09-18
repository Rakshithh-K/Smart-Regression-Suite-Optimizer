import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Cpu, Scale, XCircle } from "lucide-react";

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
    <section className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Cpu size={20} className="text-indigo-600" />
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Optimization Decision Rationale
          </h3>
        </div>
        <p className="mt-1 text-sm sm:text-base text-slate-600">
          Deterministic trade-off formulation and individual case selection reasoning.
        </p>
      </div>

      {/* Overall Trade-off */}
      {explanations?.overall_tradeoff && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-indigo-900">
            <Scale size={20} className="text-indigo-600" />
            <h4 className="text-base font-bold uppercase tracking-wider text-indigo-950">
              System Trade-Off Analysis
            </h4>
          </div>
          <p className="text-base sm:text-[17px] text-slate-800 leading-relaxed max-w-4xl">
            {explanations.overall_tradeoff}
          </p>
        </div>
      )}

      {/* 2 Columns: Selected vs Excluded Reasoning */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Selected Reasoning */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <h4 className="text-base font-bold text-slate-900">
              Selected Test Cases ({selected.length})
            </h4>
          </div>

          <div className="space-y-2.5">
            {selected.map(([testId, reason]) => {
              const isExpanded = !!expandedSelected[testId];
              return (
                <div
                  key={testId}
                  className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleSelected(testId)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-sm font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {testId}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 truncate">
                        Selection Rationale
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown size={18} className="text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight size={18} className="text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50">
                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                        {reason}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Excluded Reasoning */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
            <XCircle size={18} className="text-slate-400" />
            <h4 className="text-base font-bold text-slate-900">
              Excluded Test Cases ({excluded.length})
            </h4>
          </div>

          <div className="space-y-2.5">
            {excluded.map(([testId, reason]) => {
              const isExpanded = !!expandedExcluded[testId];
              return (
                <div
                  key={testId}
                  className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleExcluded(testId)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {testId}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 truncate">
                        Exclusion Cause
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown size={18} className="text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight size={18} className="text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50">
                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                        {reason}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIReasoning;