import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

function SelectedTestsTable({ tests = [], recommendation = {}, aiExplanations = {} }) {
  const [expandedId, setExpandedId] = useState(null);
  const reasons = aiExplanations?.selected_reasons || {};

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Selected Regression Tests
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {recommendation?.total_execution_time ?? 0}m of {recommendation?.time_budget ?? 0}m budget utilized · Click row to inspect decision rationale
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
          {tests.length} tests selected
        </span>
      </div>

      {tests.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500">
          No tests selected within the current constraints.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              {/* Dense table header */}
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-8"></th>
                  <th className="py-3 px-4 font-bold">Test</th>
                  <th className="py-3 px-4 font-bold">Module</th>
                  <th className="py-3 px-4 font-bold">Priority</th>
                  <th className="py-3 px-4 font-bold text-right">Duration</th>
                  <th className="py-3 px-4 font-bold text-right">Relevance</th>
                  <th className="py-3 px-4 font-bold text-right">Failures</th>
                  <th className="py-3 px-4 font-bold text-right">Score</th>
                </tr>
              </thead>

              {/* Table rows */}
              <tbody className="divide-y divide-slate-100">
                {tests.map((test) => {
                  const isExpanded = expandedId === test.test_id;
                  const reason = reasons[test.test_id];
                  const relevance = Number(test.relevance_score ?? 0).toFixed(1);
                  const priorityScore = Number(test.priority_score ?? 0).toFixed(1);
                  const failures = test.historical_failure_count ?? 0;

                  return (
                    <tr
                      key={test.test_id}
                      className="group transition"
                    >
                      <td colSpan="8" className="p-0">
                        {/* Interactive Row Header */}
                        <div
                          onClick={() => toggleExpand(test.test_id)}
                          className={`flex items-center px-4 py-3 cursor-pointer select-none transition ${
                            isExpanded
                              ? "bg-indigo-50/40"
                              : "hover:bg-slate-50/80"
                          }`}
                        >
                          <div className="w-8 shrink-0 text-slate-400 group-hover:text-slate-700">
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </div>

                          <div className="w-48 sm:w-64 shrink-0 pr-4">
                            <span className="font-mono font-bold text-indigo-700 mr-2">
                              {test.test_id}
                            </span>
                            <span className="text-slate-800 font-medium truncate inline-block max-w-[140px] sm:max-w-[180px] align-bottom">
                              {test.description || "Regression verification"}
                            </span>
                          </div>

                          <div className="w-32 shrink-0 pr-4">
                            <span className="font-mono text-[11px] text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                              {test.module}
                            </span>
                          </div>

                          <div className="w-24 shrink-0 pr-4">
                            <PriorityBadge priority={test.priority} />
                          </div>

                          <div className="w-24 shrink-0 text-right pr-4 font-mono text-slate-700">
                            {test.duration} min
                          </div>

                          <div className="w-24 shrink-0 text-right pr-4 font-mono text-slate-600">
                            {relevance}
                          </div>

                          <div className="w-24 shrink-0 text-right pr-4 font-mono text-slate-600">
                            {failures}
                          </div>

                          <div className="w-24 shrink-0 text-right font-mono font-bold text-indigo-700">
                            {priorityScore}
                          </div>
                        </div>

                        {/* Expandable Engineering Notes Detail */}
                        {isExpanded && (
                          <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200 text-xs">
                            <div className="max-w-3xl space-y-2">
                              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700 block">
                                Selection Rationale
                              </span>
                              <p className="text-slate-700 leading-relaxed font-normal">
                                {reason ||
                                  `Selected for execution based on high payoff index (${priorityScore}) and relevance (${relevance}) to the specified change description. Duration of ${test.duration} min fits within the remaining execution budget.`}
                              </p>
                              <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-500 font-mono">
                                <span>Module: {test.module}</span>
                                <span>•</span>
                                <span>Historical Failures: {failures}</span>
                                <span>•</span>
                                <span>Runtime: {test.duration}m</span>
                              </div>
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

function PriorityBadge({ priority }) {
  const styles = {
    High: "text-rose-700 bg-rose-50 border-rose-200",
    Medium: "text-amber-700 bg-amber-50 border-amber-200",
    Low: "text-slate-600 bg-slate-100 border-slate-200",
  };

  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
        styles[priority] || styles.Low
      }`}
    >
      {priority || "Low"}
    </span>
  );
}

export default SelectedTestsTable;