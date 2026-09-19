import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";

function HighRiskTests({ tests = [], aiExplanations = {} }) {
  const [expandedId, setExpandedId] = useState(null);
  const reasons = aiExplanations?.excluded_reasons || {};

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            High-Risk Tests Not Selected
          </h3>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Critical test cases excluded due to execution budget threshold · Click to review risk profile
          </p>
        </div>
        <span
          className={`text-sm font-mono font-semibold px-3 py-1 rounded-md border ${
            tests.length > 0
              ? "text-amber-700 bg-amber-50 border-amber-200"
              : "text-emerald-700 bg-emerald-50 border-emerald-200"
          }`}
        >
          {tests.length} tests excluded
        </span>
      </div>

      {tests.length === 0 ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-5 flex items-center gap-3 text-sm text-emerald-800">
          <CheckCircle2 size={17} className="shrink-0 text-emerald-600" />
          <span>All high-priority and critical risk tests fit within the allocated execution budget.</span>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-mono uppercase tracking-wider text-xs sm:text-sm">
                <tr>
                  <th className="py-3 px-4 w-8"></th>
                  <th className="py-3 px-4 font-semibold">Test</th>
                  <th className="py-3 px-4 font-semibold">Module</th>
                  <th className="py-3 px-4 font-semibold">Risk Level</th>
                  <th className="py-3 px-4 font-semibold text-right">Duration</th>
                  <th className="py-3 px-4 font-semibold text-right">Relevance</th>
                  <th className="py-3 px-4 font-semibold text-right">Failures</th>
                  <th className="py-3 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {tests.map((test) => {
                  const isExpanded = expandedId === test.test_id;
                  const reason = reasons[test.test_id];
                  const relevance = Number(test.relevance_score ?? 0).toFixed(1);
                  const failures = test.historical_failure_count ?? 0;

                  return (
                    <tr
                      key={test.test_id}
                      className="group transition"
                    >
                      <td colSpan="8" className="p-0">
                        <div
                          onClick={() => toggleExpand(test.test_id)}
                          className={`flex items-center px-4 py-3.5 cursor-pointer select-none transition ${
                            isExpanded
                              ? "bg-amber-50/40"
                              : "hover:bg-slate-50/80"
                          }`}
                        >
                          <div className="w-8 shrink-0 text-slate-400 group-hover:text-slate-700">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </div>

                          <div className="w-52 sm:w-72 shrink-0 pr-4">
                            <span className="font-mono font-semibold text-amber-700 mr-2 text-sm sm:text-base">
                              {test.test_id}
                            </span>
                            <span className="text-slate-800 font-medium truncate inline-block max-w-[140px] sm:max-w-[200px] align-bottom text-sm">
                              {test.description || "Regression verification"}
                            </span>
                          </div>

                          <div className="w-36 shrink-0 pr-4">
                            <span className="font-mono text-xs sm:text-sm text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                              {test.module}
                            </span>
                          </div>

                          <div className="w-28 shrink-0 pr-4">
                            <span className="rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border text-rose-700 bg-rose-50 border-rose-200">
                              High Risk
                            </span>
                          </div>

                          <div className="w-24 shrink-0 text-right pr-4 font-mono text-slate-700 text-sm">
                            {test.duration} min
                          </div>

                          <div className="w-24 shrink-0 text-right pr-4 font-mono text-slate-600 text-sm">
                            {relevance}
                          </div>

                          <div className="w-24 shrink-0 text-right pr-4 font-mono text-rose-700 font-semibold text-sm">
                            {failures}
                          </div>

                          <div className="w-24 shrink-0 text-right font-mono text-xs sm:text-sm text-amber-700 font-semibold">
                            Omitted
                          </div>
                        </div>

                        {/* Expandable Engineering Risk Analysis */}
                        {isExpanded && (
                          <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200 text-sm space-y-3">
                            <div>
                              <span className="text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-amber-700 block mb-1">
                                Exclusion Cause
                              </span>
                              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                                {reason ||
                                  `Test runtime of ${test.duration} min exceeds available knapsack window. Higher marginal payoff test cases were chosen.`}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-rose-700 font-normal text-sm">
                              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                              <span>
                                Quality Risk: Test has {failures} historical failures. Consider scheduling for secondary or nightly verification.
                              </span>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default HighRiskTests;