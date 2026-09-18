import { useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, Clock, ShieldAlert, XCircle } from "lucide-react";

function HighRiskTests({ tests = [], aiExplanations = {} }) {
  const [expandedId, setExpandedId] = useState(null);
  const reasons = aiExplanations?.excluded_reasons || {};

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-amber-500" />
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            High-Risk Tests Not Selected
          </h3>
          {tests.length > 0 ? (
            <span className="rounded-full bg-amber-50 px-3 py-0.5 text-sm font-bold text-amber-700 border border-amber-200">
              {tests.length} excluded
            </span>
          ) : (
            <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-sm font-bold text-emerald-700 border border-emerald-200">
              0 excluded
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Critical tests omitted due to time budget limits
        </p>
      </div>

      {tests.length === 0 ? (
        <div className="flex items-center gap-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
          <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
          <div>
            <h4 className="text-base font-bold text-emerald-900">
              Zero High-Risk Tests Excluded
            </h4>
            <p className="text-sm text-emerald-700 mt-0.5">
              All high-priority and critical risk tests fit within the allocated execution time window.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map((test) => {
            const isExpanded = expandedId === test.test_id;
            const reason = reasons[test.test_id];
            const relevance = Number(test.relevance_score ?? 0).toFixed(1);
            const failures = test.historical_failure_count ?? 0;

            return (
              <div
                key={test.test_id}
                className={`rounded-xl border bg-white transition-all shadow-xs overflow-hidden ${
                  isExpanded
                    ? "border-amber-400 ring-2 ring-amber-400/10"
                    : "border-slate-200 hover:border-amber-300 hover:shadow-sm"
                }`}
              >
                {/* Compact Clickable Row */}
                <button
                  type="button"
                  onClick={() => toggleExpand(test.test_id)}
                  className="w-full text-left p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isExpanded}
                >
                  {/* Left Column */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                        {test.test_id}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                        {test.module}
                      </span>
                      <span className="rounded px-2.5 py-0.5 text-xs sm:text-sm font-semibold border text-rose-700 bg-rose-50 border-rose-200">
                        High Risk
                      </span>
                      <span className="rounded px-2 py-0.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200">
                        Omitted by Budget
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
                      {test.description || "High priority regression verification"}
                    </h4>
                  </div>

                  {/* Right Column: Horizontally Aligned Metadata + Chevron */}
                  <div className="flex items-center flex-wrap sm:flex-nowrap gap-4 lg:gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                      <Clock size={16} className="text-slate-400" />
                      <span>{test.duration} min</span>
                    </div>

                    <div className="text-sm font-medium text-slate-600">
                      <span className="text-slate-400 mr-1 text-xs uppercase font-semibold">Rel:</span>
                      <span className="font-semibold text-slate-800">{relevance}</span>
                    </div>

                    <div className="text-sm font-medium text-slate-600">
                      <span className="text-slate-400 mr-1 text-xs uppercase font-semibold">Failures:</span>
                      <span className="font-semibold text-rose-600">{failures}</span>
                    </div>

                    <div className="text-slate-400 hover:text-amber-600 transition-colors ml-auto sm:ml-0">
                      {isExpanded ? (
                        <ChevronDown size={22} className="text-amber-600" />
                      ) : (
                        <ChevronRight size={22} />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-amber-50/20 p-5 sm:p-6 transition-all space-y-4">
                    {/* Why Excluded */}
                    <div className="rounded-lg border border-amber-200 bg-white p-5">
                      <div className="flex items-center gap-2 mb-2 text-amber-900">
                        <XCircle size={18} className="text-amber-600" />
                        <h5 className="text-sm font-bold uppercase tracking-wider text-amber-800">
                          Why Excluded
                        </h5>
                      </div>
                      <p className="text-base sm:text-[17px] text-slate-800 leading-relaxed max-w-4xl">
                        {reason ||
                          `Test duration (${test.duration} min) exceeds remaining runtime capacity in the time budget. Other tests provided a higher marginal score per execution minute.`}
                      </p>
                    </div>

                    {/* Remaining Risk */}
                    <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50/70 p-5">
                      <ShieldAlert size={20} className="text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-sm font-bold uppercase tracking-wider text-rose-800">
                          Remaining Quality Risk
                        </h5>
                        <p className="text-base sm:text-[16px] text-slate-800 leading-relaxed mt-1">
                          This test validates critical failure modes and has recorded{" "}
                          <span className="font-bold text-rose-700">{failures} historical failures</span>. Consider scheduling this test in an asynchronous overnight suite or secondary pipeline.
                        </p>
                      </div>
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

export default HighRiskTests;