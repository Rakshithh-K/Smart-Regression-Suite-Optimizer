import { useState } from "react";
import {
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";

function LatestGitRunCard({ run, runDetail, onViewRun }) {
  const [copied, setCopied] = useState(false);

  if (!run) return null;

  const shortSha = run.commit_sha ? run.commit_sha.slice(0, 7) : "—";
  const branch = run.branch || "main";

  // Detailed metrics from backend runDetail
  const changedFilesCount = runDetail?.changed_files?.length ?? "Not available";
  const selectedTestsCount = runDetail?.result?.selected_tests?.length ?? "Not available";
  const executionTime = runDetail?.result?.recommendation?.total_execution_time != null
    ? `${runDetail.result.recommendation.total_execution_time} min`
    : run.budget ? `${run.budget} min` : "Not available";

  // Coverage percentage
  let coverageDisplay = "Not available";
  if (runDetail?.result?.coverage?.total_tests > 0) {
    const total = runDetail.result.coverage.total_tests;
    const selected = runDetail.result.coverage.total_selected_tests ?? runDetail.result.selected_tests?.length ?? 0;
    coverageDisplay = `${Math.round((selected / total) * 100)}%`;
  }

  // Risk Debt
  let riskDebtDisplay = "Not available";
  if (runDetail?.result?.risk_debt) {
    const idx = runDetail.result.risk_debt.risk_debt_index;
    if (idx != null) {
      if (idx > 50) riskDebtDisplay = "High";
      else if (idx > 20) riskDebtDisplay = "Medium";
      else riskDebtDisplay = "Low";
    }
  }

  const handleCopy = (e) => {
    e.stopPropagation();
    if (run.commit_sha) {
      navigator.clipboard.writeText(run.commit_sha);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
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

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Latest Git Change
        </span>

        <div className="flex items-center gap-3">
          {getStatusBadge(run.status)}
          <button
            type="button"
            onClick={() => onViewRun(run.id)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-xs cursor-pointer"
          >
            <span>View Run</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Commit Message & Metadata */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug break-words">
          {run.commit_message || "No commit message provided"}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <GitBranch size={15} className="text-slate-400" />
            {branch}
          </span>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              {shortSha}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              title="Copy commit SHA"
              className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              {copied ? (
                <Check size={13} className="text-emerald-600" />
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>
          {run.created_at && (
            <>
              <span>•</span>
              <span>
                {new Date(run.created_at).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 5-Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-slate-100">
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Changed Files
          </span>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 block">
            {changedFilesCount}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Selected Tests
          </span>
          <span className="text-xl sm:text-2xl font-bold text-indigo-700 block">
            {selectedTestsCount}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Execution Time
          </span>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 block">
            {executionTime}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Coverage
          </span>
          <span className="text-xl sm:text-2xl font-bold text-emerald-700 block">
            {coverageDisplay}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Risk Debt
          </span>
          <span className={`text-xl sm:text-2xl font-bold block ${
            riskDebtDisplay === "High" ? "text-rose-600" : riskDebtDisplay === "Medium" ? "text-amber-600" : riskDebtDisplay === "Low" ? "text-emerald-700" : "text-slate-700"
          }`}>
            {riskDebtDisplay}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LatestGitRunCard;
