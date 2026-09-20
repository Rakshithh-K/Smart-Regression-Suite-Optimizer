import { useState } from "react";
import {
  ArrowLeft,
  GitBranch,
  Clock,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

function GitRunDetails({ runData, onBack }) {
  const [copiedSha, setCopiedSha] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState({});
  const [expandedTestId, setExpandedTestId] = useState(null);
  const [expandedExcludedId, setExpandedExcludedId] = useState(null);

  if (!runData) return null;

  const {
    id,
    commit_sha,
    branch,
    commit_message,
    changed_files = [],
    change_description = {},
    result = {},
    budget,
    status,
    created_at,
  } = runData;

  const isFailed = (status || "").toLowerCase() === "failed";
  const shortSha = commit_sha ? commit_sha.slice(0, 7) : "—";

  const handleCopySha = () => {
    if (commit_sha) {
      navigator.clipboard.writeText(commit_sha);
      setCopiedSha(true);
      setTimeout(() => setCopiedSha(false), 2000);
    }
  };

  const toggleFile = (index) => {
    setExpandedFiles((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Safe extractions from result
  const selectedTests = result?.selected_tests || [];
  const exclusions = result?.exclusions || [];
  const summary = result?.summary || {};
  const coverage = result?.coverage || {};
  const recommendation = result?.recommendation || {};
  const aiExplanations = result?.ai_explanations || {};
  const riskDebt = result?.risk_debt || {};

  // Budget calculations
  const totalBudget = recommendation?.time_budget ?? budget ?? 0;
  const usedBudget = recommendation?.total_execution_time ?? 0;
  const remainingBudget = Math.max(0, totalBudget - usedBudget);
  const budgetUtilization = totalBudget > 0 ? Math.min(100, Math.round((usedBudget / totalBudget) * 100)) : 0;

  const getStatusBadge = (st) => {
    switch (st?.toLowerCase()) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs sm:text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={14} className="text-emerald-600" />
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs sm:text-sm font-semibold text-rose-700">
            <AlertCircle size={14} className="text-rose-600" />
            Failed
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs sm:text-sm font-semibold text-amber-700">
            <Clock3 size={14} className="text-amber-600 animate-spin" />
            Pending
          </span>
        );
    }
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || "").toLowerCase();
    if (p === "high") {
      return (
        <span className="rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border text-rose-700 bg-rose-50 border-rose-200">
          High
        </span>
      );
    }
    if (p === "medium") {
      return (
        <span className="rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border text-amber-700 bg-amber-50 border-amber-200">
          Medium
        </span>
      );
    }
    return (
      <span className="rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border text-slate-600 bg-slate-100 border-slate-200">
        {priority || "Low"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Git Auto</span>
        </button>
      </div>

      {/* ======================================================= */}
      {/* RUN HEADER & SUMMARY */}
      {/* ======================================================= */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-md">
              Run #{id}
            </span>
            <span className="text-sm text-slate-500">
              {created_at ? new Date(created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }) : "—"}
            </span>
          </div>

          <div>{getStatusBadge(status)}</div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug break-words">
            {commit_message || "No commit message"}
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-sm">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Commit SHA
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded truncate max-w-[150px]" title={commit_sha}>
                {shortSha}
              </span>
              <button
                type="button"
                onClick={handleCopySha}
                title="Copy full SHA"
                className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                {copiedSha ? (
                  <Check size={13} className="text-emerald-600" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Branch
            </span>
            <span className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
              <GitBranch size={15} className="text-slate-400" />
              {branch || "main"}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Budget
            </span>
            <span className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
              <Clock size={15} className="text-slate-400" />
              {budget} min
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Changed Files
            </span>
            <span className="text-sm font-medium text-slate-800">
              {changed_files.length} file{changed_files.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* FAILED RUN STATE */}
      {/* ======================================================= */}
      {isFailed && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-6 shadow-xs space-y-3">
          <div className="flex items-start gap-3 text-rose-800">
            <AlertCircle size={22} className="shrink-0 mt-0.5 text-rose-600" />
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-rose-900">
                Run Failed
              </h2>
              <p className="text-sm text-rose-700 font-normal leading-relaxed">
                The automated regression analysis pipeline failed during execution. No optimization results or test allocations were generated.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                >
                  Back to Git Auto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 1. CHANGE IMPACT SECTION */}
      {/* ======================================================= */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Change Impact
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Overview of modified files, affected functionality, and identified risk areas.
          </p>
        </div>

        {/* Change Impact Coordinates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Primary Module
            </span>
            <span className="text-base font-semibold text-slate-900 block">
              {change_description.module || "Unknown"}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Change Type
            </span>
            <span className="text-base font-semibold text-slate-900 block">
              {Array.isArray(change_description.change_type) && change_description.change_type.length > 0
                ? change_description.change_type.join(", ")
                : "Modified"}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Affected Features
            </span>
            <span className="text-base font-semibold text-slate-900 block truncate">
              {Array.isArray(change_description.features) && change_description.features.length > 0
                ? change_description.features.join(", ")
                : "—"}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Risk Areas
            </span>
            <span className="text-base font-semibold text-amber-800 block truncate">
              {Array.isArray(change_description.risk_areas) && change_description.risk_areas.length > 0
                ? change_description.risk_areas.join(", ")
                : "—"}
            </span>
          </div>
        </div>

        {/* Changed Files Table */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Changed Files ({changed_files.length})</span>
            <span className="text-xs text-slate-500">Click row to view diff</span>
          </div>

          {changed_files.length === 0 ? (
            <p className="text-sm text-slate-400 py-3 font-normal">
              No changed file data reported for this commit.
            </p>
          ) : (
            <div className="rounded-lg border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {changed_files.map((file, idx) => {
                const isExpanded = Boolean(expandedFiles[idx]);
                const hasPatch = Boolean(file.patch);

                return (
                  <div key={file.filename || idx} className="text-sm">
                    <div
                      onClick={() => hasPatch && toggleFile(idx)}
                      className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 select-none transition ${
                        hasPatch
                          ? "cursor-pointer hover:bg-slate-50"
                          : "cursor-default bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {hasPatch ? (
                          <span className="text-slate-400">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </span>
                        ) : (
                          <span className="w-4" />
                        )}
                        <span className="font-medium text-slate-900 truncate" title={file.filename}>
                          {file.filename}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          {file.status || "modified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-xs">
                        {typeof file.additions === "number" && (
                          <span className="text-emerald-600 font-semibold">
                            +{file.additions}
                          </span>
                        )}
                        {typeof file.deletions === "number" && (
                          <span className="text-rose-600 font-semibold">
                            -{file.deletions}
                          </span>
                        )}
                        {typeof file.changes === "number" && (
                          <span className="text-slate-500">
                            ({file.changes} changes)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Diff viewer (monospace strictly for code/diff) */}
                    {isExpanded && hasPatch && (
                      <div className="border-t border-slate-200 bg-slate-900 p-4 text-xs font-mono overflow-x-auto text-slate-200">
                        <pre className="space-y-0.5 leading-5 whitespace-pre">
                          {file.patch.split("\n").map((line, lIdx) => {
                            const isAdd = line.startsWith("+");
                            const isDel = line.startsWith("-");
                            const isHunk = line.startsWith("@@");

                            let colorClass = "text-slate-300";
                            if (isAdd) colorClass = "text-emerald-400 bg-emerald-950/40";
                            if (isDel) colorClass = "text-rose-400 bg-rose-950/40";
                            if (isHunk) colorClass = "text-indigo-400 bg-indigo-950/30";

                            return (
                              <div key={lIdx} className={`${colorClass} px-2 py-0.5 rounded-xs`}>
                                {line}
                              </div>
                            );
                          })}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================= */}
      {/* 2. AI CHANGE ANALYSIS */}
      {/* ======================================================= */}
      {!isFailed && change_description && Object.keys(change_description).length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  AI Change Analysis
                </h2>
                <span className="text-xs sm:text-sm text-slate-500">
                  Commit and diff interpretation
                </span>
              </div>
              <p className="text-sm text-slate-500 font-normal mt-1">
                Summary of changes extracted from commit message and diff patch. Regression suite selection is executed deterministically by the optimizer.
              </p>
            </div>
          </div>

          {/* Summary Text */}
          {change_description.summary && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
              {change_description.summary}
            </div>
          )}

          {/* Features and Risks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                Affected Features
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(change_description.features) && change_description.features.length > 0 ? (
                  change_description.features.map((feat, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs sm:text-sm font-medium text-slate-800"
                    >
                      {feat}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400 italic">None specified</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                Identified Risk Areas
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(change_description.risk_areas) && change_description.risk_areas.length > 0 ? (
                  change_description.risk_areas.map((risk, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs sm:text-sm font-medium text-amber-800"
                    >
                      {risk}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400 italic">None specified</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 3. RECOMMENDED REGRESSION SUITE (MOST IMPORTANT PART) */}
      {/* ======================================================= */}
      {!isFailed && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Recommended Regression Suite
              </h2>
              <p className="text-sm text-slate-500 font-normal mt-1">
                Tests selected by the deterministic SRSO optimization engine.
              </p>
            </div>

            <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-lg">
              {selectedTests.length} tests selected
            </span>
          </div>

          {/* Budget Progress Bar */}
          <div className="p-4 sm:p-5 rounded-lg bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-slate-700">
              <span>Regression Budget Allocation</span>
              <span>
                <strong className="text-slate-900">{totalBudget} min</strong> budget ·{" "}
                <strong className="text-emerald-700">{usedBudget} min</strong> used ·{" "}
                <strong className="text-slate-700">{remainingBudget} min</strong> remaining
              </span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  budgetUtilization > 95 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${budgetUtilization}%` }}
              />
            </div>
          </div>

          {/* Test Table */}
          {selectedTests.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 font-normal">
              No tests selected within the current execution budget.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 w-8"></th>
                      <th className="py-3 px-4 font-semibold">Test ID</th>
                      <th className="py-3 px-4 font-semibold">Module</th>
                      <th className="py-3 px-4 font-semibold">Description</th>
                      <th className="py-3 px-4 font-semibold">Priority</th>
                      <th className="py-3 px-4 font-semibold text-right">Duration</th>
                      <th className="py-3 px-4 font-semibold text-right">Failures</th>
                      <th className="py-3 px-4 font-semibold text-right">Relevance</th>
                      <th className="py-3 px-4 font-semibold text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedTests.map((test) => {
                      const isExpanded = expandedTestId === test.test_id;
                      const reason = aiExplanations?.selected_reasons?.[test.test_id];
                      const priorityScore = Number(test.priority_score ?? test.score ?? 0).toFixed(1);
                      const relevanceScore = Number(test.relevance_score ?? 0).toFixed(1);

                      return (
                        <tr key={test.test_id} className="group transition">
                          <td colSpan="9" className="p-0">
                            <div
                              onClick={() => setExpandedTestId((prev) => (prev === test.test_id ? null : test.test_id))}
                              className={`flex items-center px-4 py-3.5 cursor-pointer select-none transition ${
                                isExpanded ? "bg-slate-50" : "hover:bg-slate-50/70"
                              }`}
                            >
                              <div className="w-8 shrink-0 text-slate-400">
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              </div>

                              <div className="w-28 sm:w-32 shrink-0 pr-3 font-mono font-semibold text-indigo-700">
                                {test.test_id}
                              </div>

                              <div className="w-32 sm:w-36 shrink-0 pr-3">
                                <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs sm:text-sm">
                                  {test.module}
                                </span>
                              </div>

                              <div className="flex-1 min-w-[160px] pr-4 text-slate-900 font-medium truncate">
                                {test.description || "Regression verification"}
                              </div>

                              <div className="w-24 shrink-0 pr-3">
                                {getPriorityBadge(test.priority)}
                              </div>

                              <div className="w-20 shrink-0 text-right pr-3 font-medium text-slate-800">
                                {test.duration}m
                              </div>

                              <div className="w-20 shrink-0 text-right pr-3 font-medium text-slate-700">
                                {test.historical_failure_count ?? 0}
                              </div>

                              <div className="w-20 shrink-0 text-right pr-3 text-slate-600">
                                {relevanceScore}
                              </div>

                              <div className="w-20 shrink-0 text-right font-bold text-indigo-700">
                                {priorityScore}
                              </div>
                            </div>

                            {/* Expandable rationale */}
                            {isExpanded && (
                              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-sm space-y-1.5">
                                <span className="font-semibold text-slate-700 block">
                                  Selection Rationale
                                </span>
                                <p className="text-slate-700 leading-relaxed font-normal">
                                  {reason ||
                                    `Selected for execution based on high payoff index (${priorityScore}) and relevance (${relevanceScore}) to the commit change. Duration of ${test.duration} min fits within the remaining execution budget.`}
                                </p>
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
      )}

      {/* ======================================================= */}
      {/* 4. EXCLUDED HIGH-RISK TESTS */}
      {/* ======================================================= */}
      {!isFailed && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Excluded High-Risk Tests
              </h2>
              <p className="text-sm text-slate-500 font-normal mt-1">
                High-risk tests not selected because of the available execution budget.
              </p>
            </div>

            <span
              className={`text-sm font-semibold px-3 py-1 rounded-lg border ${
                exclusions.length > 0
                  ? "text-amber-700 bg-amber-50 border-amber-200"
                  : "text-emerald-700 bg-emerald-50 border-emerald-200"
              }`}
            >
              {exclusions.length} tests excluded
            </span>
          </div>

          {/* Warning Banner / Clean State */}
          {exclusions.length > 0 ? (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900 flex items-start gap-3">
              <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-600" />
              <span>
                Excluded tests are not necessarily safe to skip. They represent deferred regression coverage.
              </span>
            </div>
          ) : (
            <div className="p-5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-sm text-emerald-800 flex items-center gap-2.5">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
              <span>No high-risk tests were excluded by the optimizer.</span>
            </div>
          )}

          {exclusions.length > 0 && (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 w-8"></th>
                      <th className="py-3 px-4 font-semibold">Test ID</th>
                      <th className="py-3 px-4 font-semibold">Module</th>
                      <th className="py-3 px-4 font-semibold">Priority</th>
                      <th className="py-3 px-4 font-semibold text-right">Duration</th>
                      <th className="py-3 px-4 font-semibold text-right">Failures</th>
                      <th className="py-3 px-4 font-semibold">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {exclusions.map((test) => {
                      const isExpanded = expandedExcludedId === test.test_id;
                      const reason = aiExplanations?.excluded_reasons?.[test.test_id] || test.exclusion_reason || `Duration exceeds available window`;

                      return (
                        <tr key={test.test_id} className="group transition">
                          <td colSpan="7" className="p-0">
                            <div
                              onClick={() => setExpandedExcludedId((prev) => (prev === test.test_id ? null : test.test_id))}
                              className={`flex items-center px-4 py-3.5 cursor-pointer select-none transition ${
                                isExpanded ? "bg-slate-50" : "hover:bg-slate-50/70"
                              }`}
                            >
                              <div className="w-8 shrink-0 text-slate-400">
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              </div>

                              <div className="w-28 sm:w-32 shrink-0 pr-3 font-mono font-semibold text-amber-700">
                                {test.test_id}
                              </div>

                              <div className="w-32 sm:w-36 shrink-0 pr-3">
                                <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs sm:text-sm">
                                  {test.module}
                                </span>
                              </div>

                              <div className="w-24 shrink-0 pr-3">
                                {getPriorityBadge(test.priority)}
                              </div>

                              <div className="w-20 shrink-0 text-right pr-3 font-medium text-slate-800">
                                {test.duration}m
                              </div>

                              <div className="w-20 shrink-0 text-right pr-4 font-bold text-rose-700">
                                {test.historical_failure_count ?? 0}
                              </div>

                              <div className="flex-1 min-w-[180px] text-slate-600 truncate font-normal">
                                {reason}
                              </div>
                            </div>

                            {/* Expandable details */}
                            {isExpanded && (
                              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-sm space-y-1.5">
                                <span className="font-semibold text-slate-700 block">
                                  Exclusion Details
                                </span>
                                <p className="text-slate-700 leading-relaxed font-normal">
                                  {reason}
                                </p>
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
      )}

      {/* ======================================================= */}
      {/* 5. COVERAGE */}
      {/* ======================================================= */}
      {!isFailed && coverage && Object.keys(coverage).length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Coverage
              </h2>
              <p className="text-sm text-slate-500 font-normal mt-1">
                Module coverage breakdown and uncovered functional paths.
              </p>
            </div>

            <span className="text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              {coverage.total_selected_tests ?? selectedTests.length} / {coverage.total_tests ?? summary.total_tests ?? 0} tests covered
            </span>
          </div>

          {/* Module Coverage Bars */}
          {coverage.module_coverage && Object.keys(coverage.module_coverage).length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Module Coverage
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(coverage.module_coverage).map(([modName, modData]) => {
                  const pct = modData.coverage_percentage ?? (
                    modData.total_tests > 0 ? Math.round((modData.selected_tests / modData.total_tests) * 100) : 0
                  );

                  return (
                    <div key={modName} className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{modName}</span>
                        <span className="font-medium text-slate-700">{pct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            pct >= 80 ? "bg-emerald-500" : pct > 0 ? "bg-indigo-500" : "bg-slate-300"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Coverage Gaps */}
          <div className="p-5 rounded-lg bg-slate-50 border border-slate-100 space-y-4 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 block">
              Coverage Gaps
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-slate-500 block mb-1 font-medium">Uncovered Modules</span>
                {Array.isArray(coverage.uncovered_modules) && coverage.uncovered_modules.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {coverage.uncovered_modules.map((m, i) => {
                      const modName = typeof m === "object" && m !== null ? m.name || m.module || String(m) : String(m);
                      return (
                        <span key={i} className="font-medium text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          {modName}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-emerald-700 font-medium text-sm">None</span>
                )}
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-1 font-medium">Uncovered Tests</span>
                {Array.isArray(coverage.uncovered_tests) && coverage.uncovered_tests.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {coverage.uncovered_tests.slice(0, 8).map((t, i) => {
                      const testId = typeof t === "object" && t !== null ? t.test_id || t.name || String(t) : String(t);
                      return (
                        <span key={i} className="font-mono text-xs text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">
                          {testId}
                        </span>
                      );
                    })}
                    {coverage.uncovered_tests.length > 8 && (
                      <span className="text-slate-500 text-xs font-medium">+{coverage.uncovered_tests.length - 8} more</span>
                    )}
                  </div>
                ) : (
                  <span className="text-emerald-700 font-medium text-sm">0 tests</span>
                )}
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-1 font-medium">High-Risk Uncovered Tests</span>
                {Array.isArray(coverage.high_risk_uncovered_tests) && coverage.high_risk_uncovered_tests.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {coverage.high_risk_uncovered_tests.map((t, i) => {
                      const testId = typeof t === "object" && t !== null ? t.test_id || t.name || String(t) : String(t);
                      return (
                        <span key={i} className="font-mono text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                          {testId}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-emerald-700 font-medium text-sm">0 tests</span>
                )}
              </div>
            </div>
          </div>

          {/* Tag Coverage */}
          {coverage.tag_coverage && Object.keys(coverage.tag_coverage).length > 0 && (
            <div className="pt-2 text-sm space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Tag Coverage
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(coverage.tag_coverage).map(([tag, tData]) => {
                  const displayValue = typeof tData === "object" && tData !== null
                    ? `${tData.selected_tests ?? 0}/${tData.total_tests ?? 0}`
                    : tData;

                  return (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      <span className="font-semibold text-slate-900">{tag}:</span>
                      <span>{displayValue}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================= */}
      {/* 6. RISK & REGRESSION DEBT */}
      {/* ======================================================= */}
      {!isFailed && riskDebt && Object.keys(riskDebt).length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Risk & Regression Debt
            </h2>
            <p className="text-sm text-slate-500 font-normal mt-1">
              Quantification of deferred regression risk resulting from execution constraints.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-medium text-slate-500 block mb-1">
                Risk Debt Index
              </span>
              <span className="text-2xl font-bold text-amber-600 block">
                {riskDebt.risk_debt_index ?? 0}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-medium text-slate-500 block mb-1">
                High-Risk Excluded
              </span>
              <span className="text-2xl font-bold text-rose-600 block">
                {riskDebt.high_risk_excluded ?? exclusions.length}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-medium text-slate-500 block mb-1">
                Deferred Runtime
              </span>
              <span className="text-2xl font-bold text-slate-900 block">
                {riskDebt.deferred_time ?? 0} min
              </span>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-medium text-slate-500 block mb-1">
                Coverage Gaps
              </span>
              <span className="text-2xl font-bold text-slate-900 block">
                {Array.isArray(coverage.uncovered_modules) ? `${coverage.uncovered_modules.length} modules` : "—"}
              </span>
            </div>
          </div>

          {/* Debt Mitigation Recommendation */}
          {riskDebt.recommendation && (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
              <span className="font-semibold block text-amber-900 mb-1">
                Debt Mitigation
              </span>
              <p className="font-normal text-amber-900 leading-relaxed">
                {riskDebt.recommendation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================= */}
      {/* 7. REGRESSION RECOMMENDATION */}
      {/* ======================================================= */}
      {!isFailed && recommendation && Object.keys(recommendation).length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Regression Recommendation
            </h2>
            <p className="text-sm text-slate-500 font-normal mt-1">
              Synthesis of test coverage sufficiency, defect risk, and release confidence.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            {recommendation.action && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Action
                </span>
                <p className="text-base font-semibold text-slate-900">
                  {recommendation.action}
                </p>
              </div>
            )}

            {recommendation.confidence && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Confidence
                </span>
                <span className="text-sm font-medium text-slate-800">
                  {recommendation.confidence}
                </span>
              </div>
            )}

            {recommendation.notes && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Notes
                </span>
                <p className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  {recommendation.notes}
                </p>
              </div>
            )}

            {recommendation.optimal_budget && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Budget Advice
                </span>
                <span className="text-sm font-medium text-slate-800">
                  Suggested optimal budget: <strong>{recommendation.optimal_budget} minutes</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GitRunDetails;
