import { useState } from "react";
import {
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Copy,
  Check,
  ChevronRight,
  GitCommit,
  Search,
  Trash2,
  Loader2,
} from "lucide-react";

function GitAutoHistoryTable({ runs = [], onViewRun, onDeleteRun, onRefresh }) {
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [runToDelete, setRunToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleCopy = (e, sha) => {
    e.stopPropagation();
    if (sha) {
      navigator.clipboard.writeText(sha);
      setCopiedId(sha);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs sm:text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={13} className="text-emerald-600" />
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs sm:text-sm font-semibold text-rose-700">
            <AlertCircle size={13} className="text-rose-600" />
            Failed
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs sm:text-sm font-semibold text-amber-700">
            <Clock3 size={13} className="text-amber-600 animate-spin" />
            Pending
          </span>
        );
    }
  };

  const filteredRuns = runs.filter((run) => {
    const matchesSearch =
      (run.commit_message || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (run.commit_sha || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (run.branch || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || (run.status || "").toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Git Auto Runs
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Automated regression pipeline executions triggered by repository changes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search commit or branch..."
              className="rounded-lg border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 w-52 sm:w-64"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter runs by status"
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {runs.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <GitCommit size={24} />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            No Git Auto runs yet
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto font-normal">
            Push a change to the connected GitHub repository to automatically generate a regression analysis.
          </p>
        </div>
      ) : filteredRuns.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-xs">
          No Git Auto runs match the current search filters.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Commit</th>
                    <th className="py-3.5 px-4 font-semibold">Branch</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Budget</th>
                    <th className="py-3.5 px-4 font-semibold">Created</th>
                    <th className="py-3.5 px-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRuns.map((run) => {
                    const shortSha = run.commit_sha
                      ? run.commit_sha.slice(0, 7)
                      : "—";
                    const isCopied = copiedId === run.commit_sha;

                    return (
                      <tr
                        key={run.id}
                        onClick={() => onViewRun(run.id)}
                        className="group hover:bg-slate-50 transition cursor-pointer select-none"
                      >
                        {/* Commit (SHA + Message) */}
                        <td className="py-4 px-4 max-w-md">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded shrink-0">
                              {shortSha}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCopy(e, run.commit_sha)}
                              title="Copy full SHA"
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition shrink-0 cursor-pointer"
                            >
                              {isCopied ? (
                                <Check size={13} className="text-emerald-600" />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                            <span className="text-sm font-medium text-slate-900 truncate">
                              {run.commit_message || "Commit change"}
                            </span>
                          </div>
                        </td>

                        {/* Branch */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
                            <GitBranch size={15} className="text-slate-400" />
                            {run.branch || "main"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {getStatusBadge(run.status)}
                        </td>

                        {/* Budget */}
                        <td className="py-4 px-4 text-right font-medium text-slate-800">
                          {run.budget ? `${run.budget} min` : "—"}
                        </td>

                        {/* Created Date */}
                        <td className="py-4 px-4 text-sm text-slate-500 whitespace-nowrap">
                          {run.created_at
                            ? new Date(run.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </td>

                        {/* Action */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewRun(run.id);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition shadow-xs cursor-pointer"
                            >
                              <span>View</span>
                              <ChevronRight size={14} />
                            </button>
                            {onDeleteRun && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRunToDelete(run);
                                  setDeleteError(null);
                                }}
                                title="Delete run"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition shadow-xs cursor-pointer"
                              >
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3">
            {filteredRuns.map((run) => {
              const shortSha = run.commit_sha
                ? run.commit_sha.slice(0, 7)
                : "—";
              const isCopied = copiedId === run.commit_sha;

              return (
                <div
                  key={run.id}
                  onClick={() => onViewRun(run.id)}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3 cursor-pointer hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                        {shortSha}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopy(e, run.commit_sha)}
                        title="Copy full SHA"
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {isCopied ? (
                          <Check size={13} className="text-emerald-600" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                    {getStatusBadge(run.status)}
                  </div>

                  <p className="text-sm font-semibold text-slate-900 leading-snug break-words">
                    {run.commit_message || "No commit message"}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <GitBranch size={13} />
                      {run.branch || "main"}
                    </span>
                    <span className="font-medium text-slate-800">
                      {run.budget ? `${run.budget} min` : "—"}
                    </span>
                    <span>
                      {run.created_at
                        ? new Date(run.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </span>
                    {onDeleteRun && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRunToDelete(run);
                          setDeleteError(null);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {runToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg max-w-md w-full space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Delete Run #{runToDelete.id}?
              </h3>
              <p className="text-sm text-slate-600 font-normal">
                This will permanently remove this Git Auto run and its stored results.
              </p>
            </div>

            {deleteError && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
                <AlertCircle size={15} className="shrink-0 text-rose-600" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  if (!isDeleting) {
                    setRunToDelete(null);
                    setDeleteError(null);
                  }
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  if (!onDeleteRun) return;
                  setIsDeleting(true);
                  setDeleteError(null);
                  const res = await onDeleteRun(runToDelete.id);
                  setIsDeleting(false);
                  if (res?.success) {
                    setRunToDelete(null);
                  } else {
                    setDeleteError(res?.error || "Failed to delete run.");
                  }
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GitAutoHistoryTable;
