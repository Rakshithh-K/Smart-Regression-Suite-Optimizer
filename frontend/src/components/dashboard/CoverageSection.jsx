import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileSpreadsheet,
} from "lucide-react";

function CoverageSection({ coverage = {} }) {
  const [expandedHighRiskId, setExpandedHighRiskId] = useState(null);
  const [expandedUncoveredId, setExpandedUncoveredId] = useState(null);

  // Safe defaults from API response
  const totalTests = coverage?.total_tests ?? 0;
  const selectedTests = coverage?.total_selected_tests ?? 0;
  const uncoveredTests = coverage?.total_uncovered_tests ?? 0;

  const moduleCoverage = coverage?.module_coverage || {};
  const modulesList = Object.entries(moduleCoverage);
  const uncoveredModules = coverage?.uncovered_modules || [];
  const uncoveredTestsList = coverage?.uncovered_tests || [];
  const highRiskUncoveredList = coverage?.high_risk_uncovered_tests || [];
  const tagCoverage = Object.entries(coverage?.tag_coverage || {});

  // Separate modules into fully covered, partially covered, and completely uncovered
  const partiallyCoveredModules = modulesList.filter(
    ([, data]) => data.selected_tests > 0 && data.selected_tests < data.total_tests
  );
  const notCoveredModules = modulesList.filter(
    ([moduleName, data]) =>
      data.selected_tests === 0 || uncoveredModules.includes(moduleName)
  );

  return (
    <div className="space-y-8">
      {/* ---------------------------------------------------- */}
      {/* SECTION HEADER */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-semibold text-slate-900">
              Suite Coverage & Gap Analysis
            </h3>
            <span className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded">
              Coverage Audit
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Functional module coverage breakdown, untested regression paths, and high-risk coverage gaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-mono text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
            {modulesList.length} Modules · {uncoveredModules.length} Uncovered
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. COVERAGE OVERVIEW (Compact Metric Strip) */}
      {/* ---------------------------------------------------- */}
      <div>
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 block font-mono mb-3">
          Coverage Overview
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Tests */}
          <div className="p-4 sm:p-5 rounded-lg border border-slate-200 bg-slate-50/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block font-mono">
              Total Tests
            </span>
            <p className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {totalTests}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
              Catalog test cases
            </p>
          </div>

          {/* Selected Tests */}
          <div className="p-4 sm:p-5 rounded-lg border border-slate-200 bg-slate-50/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block font-mono">
              Selected Tests
            </span>
            <p className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-indigo-600 font-mono">
              {selectedTests}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
              Included in execution suite
            </p>
          </div>

          {/* Uncovered Tests */}
          <div className="p-4 sm:p-5 rounded-lg border border-slate-200 bg-slate-50/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block font-mono">
              Uncovered Tests
            </span>
            <p
              className={`mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight font-mono ${
                uncoveredTests > 0 ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              {uncoveredTests}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
              {uncoveredTests > 0 ? "Omitted from current budget" : "Full suite selected"}
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. MODULE COVERAGE & 3. COVERAGE GAPS */}
      {/* ---------------------------------------------------- */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Module Coverage (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 block font-mono">
              Module Coverage Breakdown
            </span>
            <span className="text-xs font-mono text-slate-500">
              {modulesList.length} total modules
            </span>
          </div>

          {modulesList.length === 0 ? (
            <p className="text-sm text-slate-500 py-3 font-normal">
              No module coverage data available.
            </p>
          ) : (
            <div className="space-y-4 divide-y divide-slate-100">
              {modulesList.map(([name, data]) => {
                const percentage = Number(data.coverage_percentage ?? 0);
                const status = data.status || (percentage === 100 ? "Fully Covered" : percentage > 0 ? "Partially Covered" : "Not Covered");

                // Badge styling
                const badgeStyle =
                  status === "Fully Covered"
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                    : status === "Partially Covered"
                    ? "text-amber-700 bg-amber-50 border-amber-200"
                    : "text-rose-700 bg-rose-50 border-rose-200";

                // Progress bar fill color
                const progressColor =
                  status === "Fully Covered"
                    ? "bg-emerald-500"
                    : status === "Partially Covered"
                    ? "bg-amber-500"
                    : "bg-slate-300";

                return (
                  <div key={name} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-slate-900 font-mono text-sm sm:text-base">
                          {name}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border font-mono ${badgeStyle}`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs sm:text-sm font-mono text-slate-600">
                        <span>
                          {data.selected_tests} / {data.total_tests} tests
                        </span>
                        <span className="font-bold text-slate-900">
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Coverage Gaps Callout Panel (5 Cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-600 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-700 block font-mono">
                Identified Coverage Gaps
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Functional modules with partial or zero test coverage in the current execution window.
            </p>

            {/* Completely Uncovered Modules */}
            {notCoveredModules.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-700 block">
                  Completely Uncovered Modules ({notCoveredModules.length})
                </span>
                <div className="space-y-1.5">
                  {notCoveredModules.map(([name, data]) => (
                    <div
                      key={name}
                      className="p-2.5 rounded-md border border-rose-200 bg-rose-50/50 text-xs sm:text-sm"
                    >
                      <div className="flex items-center justify-between font-mono font-semibold text-rose-900">
                        <span>{name}</span>
                        <span>0 / {data.total_tests} tests covered</span>
                      </div>
                      <p className="mt-0.5 text-xs text-rose-700 font-sans">
                        Entire module is currently uncovered.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Partially Covered Modules */}
            {partiallyCoveredModules.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-700 block">
                  Partially Covered Modules ({partiallyCoveredModules.length})
                </span>
                <div className="space-y-1.5">
                  {partiallyCoveredModules.map(([name, data]) => {
                    const remaining = data.total_tests - data.selected_tests;
                    return (
                      <div
                        key={name}
                        className="p-2.5 rounded-md border border-amber-200 bg-amber-50/50 text-xs sm:text-sm"
                      >
                        <div className="flex items-center justify-between font-mono font-semibold text-amber-900">
                          <span>{name}</span>
                          <span>{data.selected_tests} / {data.total_tests} covered</span>
                        </div>
                        <p className="mt-0.5 text-xs text-amber-700 font-sans">
                          {remaining} {remaining === 1 ? "test remains" : "tests remain"} uncovered.
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {notCoveredModules.length === 0 && partiallyCoveredModules.length === 0 && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 flex items-center gap-3 text-sm text-emerald-800">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                <span>All functional modules are fully covered in this regression suite.</span>
              </div>
            )}
          </div>

          {/* Behavioral Tags Summary */}
          {tagCoverage.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block font-mono mb-2">
                Behavioral Tags Covered
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tagCoverage.map(([name, count]) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 font-mono"
                  >
                    <span>#{name}</span>
                    <span className="text-indigo-600 font-semibold">{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 5. HIGH-RISK COVERAGE GAPS */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-semibold text-slate-900">
                High-Risk Coverage Gaps
              </h4>
              <span
                className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded border ${
                  highRiskUncoveredList.length > 0
                    ? "text-rose-700 bg-rose-50 border-rose-200"
                    : "text-emerald-700 bg-emerald-50 border-emerald-200"
                }`}
              >
                {highRiskUncoveredList.length} high-risk uncovered
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5 font-normal">
              These high-priority tests were not selected within the current regression budget.
            </p>
          </div>
        </div>

        {highRiskUncoveredList.length === 0 ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 flex items-center gap-3 text-sm text-emerald-800">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span>No high-risk coverage gaps for this regression run.</span>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-mono uppercase tracking-wider text-xs sm:text-sm">
                  <tr>
                    <th className="py-3 px-4 w-8"></th>
                    <th className="py-3 px-4 font-semibold">Test ID</th>
                    <th className="py-3 px-4 font-semibold">Module</th>
                    <th className="py-3 px-4 font-semibold">Description</th>
                    <th className="py-3 px-4 font-semibold">Priority</th>
                    <th className="py-3 px-4 font-semibold text-right">Duration</th>
                    <th className="py-3 px-4 font-semibold text-right">Historical Failures</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {highRiskUncoveredList.map((test) => {
                    const isExpanded = expandedHighRiskId === test.test_id;
                    const failures = test.historical_failure_count ?? 0;

                    return (
                      <tr key={test.test_id} className="group transition">
                        <td colSpan="7" className="p-0">
                          <div
                            onClick={() =>
                              setExpandedHighRiskId((prev) =>
                                prev === test.test_id ? null : test.test_id
                              )
                            }
                            className={`flex items-center px-4 py-3.5 cursor-pointer select-none transition ${
                              isExpanded ? "bg-rose-50/40" : "hover:bg-slate-50/80"
                            }`}
                          >
                            <div className="w-8 shrink-0 text-slate-400 group-hover:text-slate-700">
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </div>

                            <div className="w-32 shrink-0 pr-4 font-mono font-semibold text-rose-700 text-sm sm:text-base">
                              {test.test_id}
                            </div>

                            <div className="w-36 shrink-0 pr-4">
                              <span className="font-mono text-xs sm:text-sm text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                                {test.module}
                              </span>
                            </div>

                            <div className="flex-1 min-w-[200px] pr-4 text-slate-800 font-medium truncate text-sm">
                              {test.description || "Regression verification"}
                            </div>

                            <div className="w-28 shrink-0 pr-4">
                              <span className="rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border font-mono text-rose-700 bg-rose-50 border-rose-200">
                                {test.priority || "High"}
                              </span>
                            </div>

                            <div className="w-24 shrink-0 text-right pr-4 font-mono text-slate-700 text-sm">
                              {test.duration} min
                            </div>

                            <div className="w-32 shrink-0 text-right font-mono text-slate-700 text-sm">
                              <span
                                className={`font-semibold ${
                                  failures > 5
                                    ? "text-rose-600"
                                    : failures > 0
                                    ? "text-amber-600"
                                    : "text-slate-500"
                                }`}
                              >
                                {failures}
                              </span>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="px-12 py-3.5 bg-rose-50/20 border-t border-rose-100/60 text-xs sm:text-sm text-slate-700 space-y-1.5">
                              <p className="font-medium text-slate-900">
                                <span className="font-semibold font-mono text-rose-800">
                                  {test.test_id}:
                                </span>{" "}
                                {test.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                                <span>Module: {test.module}</span>
                                <span>•</span>
                                <span>Duration: {test.duration} min</span>
                                <span>•</span>
                                <span>Historical Failures: {failures}</span>
                                <span>•</span>
                                <span className="text-rose-700 font-semibold">
                                  Not executed due to budget constraint
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

      {/* ---------------------------------------------------- */}
      {/* 4. ALL UNCOVERED TESTS */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-slate-900">
              Uncovered Tests
            </h4>
            <p className="text-sm text-slate-500 mt-0.5 font-normal">
              Complete catalog of test cases omitted from the current optimization run.
            </p>
          </div>
          <span className="text-xs sm:text-sm font-mono text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-md">
            {uncoveredTestsList.length} tests omitted
          </span>
        </div>

        {uncoveredTestsList.length === 0 ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 flex items-center gap-3 text-sm text-emerald-800">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span>All tests are included in the regression suite.</span>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-mono uppercase tracking-wider text-xs sm:text-sm">
                  <tr>
                    <th className="py-3 px-4 w-8"></th>
                    <th className="py-3 px-4 font-semibold">Test ID</th>
                    <th className="py-3 px-4 font-semibold">Module</th>
                    <th className="py-3 px-4 font-semibold">Description</th>
                    <th className="py-3 px-4 font-semibold">Priority</th>
                    <th className="py-3 px-4 font-semibold text-right">Duration</th>
                    <th className="py-3 px-4 font-semibold text-right">Historical Failures</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {uncoveredTestsList.map((test) => {
                    const isExpanded = expandedUncoveredId === test.test_id;
                    const failures = test.historical_failure_count ?? 0;
                    const priority = test.priority || "Low";

                    const priorityStyle =
                      priority === "High"
                        ? "text-rose-700 bg-rose-50 border-rose-200"
                        : priority === "Medium"
                        ? "text-amber-700 bg-amber-50 border-amber-200"
                        : "text-slate-600 bg-slate-100 border-slate-200";

                    return (
                      <tr key={test.test_id} className="group transition">
                        <td colSpan="7" className="p-0">
                          <div
                            onClick={() =>
                              setExpandedUncoveredId((prev) =>
                                prev === test.test_id ? null : test.test_id
                              )
                            }
                            className={`flex items-center px-4 py-3 cursor-pointer select-none transition ${
                              isExpanded ? "bg-slate-100/60" : "hover:bg-slate-50/80"
                            }`}
                          >
                            <div className="w-8 shrink-0 text-slate-400 group-hover:text-slate-700">
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </div>

                            <div className="w-32 shrink-0 pr-4 font-mono font-semibold text-slate-800 text-sm sm:text-base">
                              {test.test_id}
                            </div>

                            <div className="w-36 shrink-0 pr-4">
                              <span className="font-mono text-xs sm:text-sm text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                                {test.module}
                              </span>
                            </div>

                            <div className="flex-1 min-w-[200px] pr-4 text-slate-800 font-medium truncate text-sm">
                              {test.description || "Regression verification"}
                            </div>

                            <div className="w-28 shrink-0 pr-4">
                              <span
                                className={`rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border font-mono ${priorityStyle}`}
                              >
                                {priority}
                              </span>
                            </div>

                            <div className="w-24 shrink-0 text-right pr-4 font-mono text-slate-700 text-sm">
                              {test.duration} min
                            </div>

                            <div className="w-32 shrink-0 text-right font-mono text-slate-700 text-sm">
                              <span
                                className={`font-semibold ${
                                  failures > 5
                                    ? "text-rose-600"
                                    : failures > 0
                                    ? "text-amber-600"
                                    : "text-slate-500"
                                }`}
                              >
                                {failures}
                              </span>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="px-12 py-3 bg-slate-50 border-t border-slate-200/80 text-xs sm:text-sm text-slate-700 space-y-1.5">
                              <p className="font-medium text-slate-900">
                                <span className="font-semibold font-mono text-indigo-700">
                                  {test.test_id}:
                                </span>{" "}
                                {test.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                                <span>Module: {test.module}</span>
                                <span>•</span>
                                <span>Duration: {test.duration} min</span>
                                <span>•</span>
                                <span>Historical Failures: {failures}</span>
                                {test.tags && (
                                  <>
                                    <span>•</span>
                                    <span>Tags: {test.tags}</span>
                                  </>
                                )}
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
    </div>
  );
}

export default CoverageSection;