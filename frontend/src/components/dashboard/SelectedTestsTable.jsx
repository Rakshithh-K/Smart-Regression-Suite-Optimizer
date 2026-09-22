import { useState, Fragment } from "react";
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
          <h3 className="text-lg font-semibold text-slate-900">
            Selected Regression Tests
          </h3>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            {recommendation?.total_execution_time ?? 0}m of {recommendation?.time_budget ?? 0}m budget utilized · Click row to inspect decision rationale
          </p>
        </div>
        <span className="text-sm font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md">
          {tests.length} tests selected
        </span>
      </div>

      {tests.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 font-normal">
          No tests selected within the current constraints.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              {/* Dense table header */}
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-mono uppercase tracking-wider text-xs sm:text-sm">
                <tr>
                  <th className="py-3 px-4 w-8"></th>
                  <th className="py-3 px-4 font-semibold">Test</th>
                  <th className="py-3 px-4 font-semibold">Module</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold text-right">Duration</th>
                  <th className="py-3 px-4 font-semibold text-right">Relevance</th>
                  <th className="py-3 px-4 font-semibold text-right">Failures</th>
                  <th className="py-3 px-4 font-semibold text-right">Score</th>
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
                    <Fragment key={test.test_id}>
                      <tr
                        onClick={() => toggleExpand(test.test_id)}
                        className={`group transition cursor-pointer select-none ${
                          isExpanded
                            ? "bg-indigo-50/40"
                            : "hover:bg-slate-50/80"
                        }`}
                      >
                        {/* 1. Expand icon */}
                        <td className="py-3.5 px-4 w-8 text-slate-400 group-hover:text-slate-700">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </td>

                        {/* 2. Test */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center">
                            <span className="font-mono font-semibold text-indigo-700 mr-2 text-sm sm:text-base shrink-0">
                              {test.test_id}
                            </span>
                            <span
                              className="text-slate-800 font-medium truncate inline-block max-w-[140px] sm:max-w-[200px] align-bottom text-sm"
                              title={test.description}
                            >
                              {test.description || "Regression verification"}
                            </span>
                          </div>
                        </td>

                        {/* 3. Module */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-xs sm:text-sm text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md inline-block">
                            {test.module}
                          </span>
                        </td>

                        {/* 4. Priority */}
                        <td className="py-3.5 px-4">
                          <PriorityBadge priority={test.priority} />
                        </td>

                        {/* 5. Duration */}
                        <td className="py-3.5 px-4 text-right font-mono text-slate-700 text-sm whitespace-nowrap">
                          {test.duration} min
                        </td>

                        {/* 6. Relevance */}
                        <td className="py-3.5 px-4 text-right font-mono text-slate-600 text-sm whitespace-nowrap">
                          {relevance}
                        </td>

                        {/* 7. Failures */}
                        <td className="py-3.5 px-4 text-right font-mono text-slate-600 text-sm whitespace-nowrap">
                          {failures}
                        </td>

                        {/* 8. Score */}
                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-indigo-700 text-sm sm:text-base whitespace-nowrap">
                          {priorityScore}
                        </td>
                      </tr>

                      {/* Expandable Engineering Notes Detail */}
                      {isExpanded && (
                        <tr className="bg-slate-50/70 border-t border-slate-200">
                          <td colSpan="8" className="px-6 py-4 text-sm">
                            <div className="max-w-3xl space-y-2">
                              <span className="text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-indigo-700 block">
                                Selection Rationale
                              </span>
                              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                                {reason ||
                                  `Selected for execution based on high payoff index (${priorityScore}) and relevance (${relevance}) to the specified change description. Duration of ${test.duration} min fits within the remaining execution budget.`}
                              </p>
                              <div className="pt-2 flex items-center gap-4 text-xs sm:text-sm text-slate-600 font-mono">
                                <span>Module: {test.module}</span>
                                <span>•</span>
                                <span>Historical Failures: {failures}</span>
                                <span>•</span>
                                <span>Runtime: {test.duration}m</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
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
      className={`rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border ${
        styles[priority] || styles.Low
      }`}
    >
      {priority || "Low"}
    </span>
  );
}

export default SelectedTestsTable;