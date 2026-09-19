import { Upload, Clock, ArrowRight, FileSpreadsheet, Loader2, X } from "lucide-react";

function OptimizationForm({
  file,
  setFile,
  changeDescription,
  setChangeDescription,
  timeBudget,
  setTimeBudget,
  loading,
  onOptimize,
}) {
  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs divide-y divide-slate-100">
      {/* Workspace Header */}
      <div className="px-6 py-4 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Optimization Workspace
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Define change diff, test catalog dataset, and maximum execution window.
          </p>
        </div>
        <span className="text-[11px] font-mono font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded">
          0/1 Knapsack Formulation
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Change Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Change Description or Commit Diff
            </label>
            <span className="text-[11px] text-slate-400">
              PR summary, modified files, or natural language diff
            </span>
          </div>
          <textarea
            value={changeDescription}
            onChange={(e) => setChangeDescription(e.target.value)}
            placeholder="e.g. Updated payment webhook handler for UPI gateway timeout retries, adjusted order validation logic, and refactored transaction status logging."
            rows="3"
            className="w-full rounded-lg border border-slate-300 bg-white p-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition resize-y font-normal leading-relaxed"
          />
        </div>

        {/* 2-Column Controls Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Test Catalog File Upload */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Test Catalog (CSV)
              </label>
              <span className="text-[11px] text-slate-400">
                Required: test_id, module, duration, priority
              </span>
            </div>

            <div
              className={`relative flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center transition min-h-[140px] ${
                file
                  ? "border-emerald-300 bg-emerald-50/40"
                  : "border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              {file ? (
                <div className="flex items-center gap-3 w-full max-w-sm justify-between bg-white border border-emerald-200 p-3 rounded-lg shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileSpreadsheet size={20} className="text-emerald-600 shrink-0" />
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {(file.size / 1024).toFixed(1)} KB · Ready for analysis
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="cursor-pointer text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 underline">
                      Change
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-slate-400 hover:text-rose-600 transition"
                      aria-label="Remove file"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
                  <Upload size={18} className="text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-700">
                    Click to select or drop CSV file
                  </span>
                  <span className="mt-0.5 text-[11px] text-slate-400">
                    CSV format test cases catalog
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Time Budget Control */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Execution Time Budget
              </label>
              <span className="text-[11px] text-slate-400">
                Max allowable run duration
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <div className="relative">
                <Clock
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="number"
                  min="1"
                  value={timeBudget}
                  onChange={(e) => setTimeBudget(Math.max(1, Number(e.target.value) || 0))}
                  className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-16 text-sm font-bold text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500">
                  min
                </span>
              </div>

              {/* Quick Presets */}
              <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Presets:</span>
                <div className="flex items-center gap-1.5">
                  {[15, 30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setTimeBudget(mins)}
                      className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                        timeBudget === mins
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-slate-500">
          Optimal knapsack dynamic programming solver guarantees exact budget adherence.
        </span>

        <button
          type="button"
          onClick={onOptimize}
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Optimizing Suite...</span>
            </>
          ) : (
            <>
              <span>Optimize Regression Suite</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default OptimizationForm;