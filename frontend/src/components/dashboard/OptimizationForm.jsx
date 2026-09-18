import { Upload, Clock, ArrowRight, FileSpreadsheet, Loader2, X, CheckCircle } from "lucide-react";

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
    <div className="rounded-xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
      {/* Workspace Header */}
      <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4.5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Optimization Workspace
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Input change scope, upload current test catalog, and define total execution window.
            </p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
            Step 1 of 2
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Change Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm sm:text-base font-semibold text-slate-800">
              Change Description or Commit Diff
            </label>
            <span className="text-xs font-medium text-slate-400">
              Natural language or PR summary
            </span>
          </div>
          <textarea
            value={changeDescription}
            onChange={(e) => setChangeDescription(e.target.value)}
            placeholder="e.g. Updated payment webhook handler for UPI gateway timeout retries, adjusted order validation logic, and refactored transaction status logging."
            rows="4"
            className="w-full rounded-lg border border-slate-300 bg-white p-4 text-base text-slate-900 leading-relaxed placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15 transition resize-y"
          />
        </div>

        {/* 2-column grid for Test Catalog and Execution Budget */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Test Catalog File Upload */}
          <div className="flex flex-col">
            <label className="text-sm sm:text-base font-semibold text-slate-800 mb-2">
              Test Catalog (CSV)
            </label>
            <div
              className={`relative flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition min-h-[170px] ${
                file
                  ? "border-emerald-300 bg-emerald-50/20"
                  : "border-slate-300 bg-slate-50/60 hover:border-indigo-400 hover:bg-slate-50"
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-2.5">
                    <FileSpreadsheet size={24} />
                  </div>
                  <p className="text-base font-semibold text-slate-900 max-w-[280px] truncate">
                    {file.name}
                  </p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB · Ready for analysis
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <label className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline">
                      Replace file
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                      />
                    </label>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
                    >
                      <X size={14} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-2.5 group-hover:scale-105 transition">
                    <Upload size={22} />
                  </div>
                  <p className="text-base font-semibold text-slate-800">
                    Click to browse or drop CSV
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Requires: test_id, module, duration, priority
                  </p>
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

          {/* Time Budget */}
          <div className="flex flex-col">
            <label className="text-sm sm:text-base font-semibold text-slate-800 mb-2">
              Execution Time Budget
            </label>
            <div className="flex flex-1 flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-6">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-3">
                  Set maximum allowable runtime for regression suite execution.
                </p>
                <div className="relative">
                  <Clock
                    size={20}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="number"
                    min="1"
                    value={timeBudget}
                    onChange={(e) => setTimeBudget(Math.max(1, Number(e.target.value) || 0))}
                    className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-20 text-base font-bold text-slate-900 outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15 transition"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    minutes
                  </span>
                </div>
              </div>

              {/* Presets */}
              <div className="mt-4 pt-4 border-t border-slate-200/80">
                <span className="text-xs font-medium text-slate-500 block mb-2">
                  Quick Presets:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {[15, 30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setTimeBudget(mins)}
                      className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${
                        timeBudget === mins
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
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
      <div className="border-t border-slate-200 bg-slate-50/60 px-6 py-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>Deterministic dynamic programming knapsack solver</span>
        </div>

        <button
          type="button"
          onClick={onOptimize}
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-lg bg-indigo-600 px-8 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Optimizing Regression Suite...</span>
            </>
          ) : (
            <>
              <span>Optimize Regression Suite</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default OptimizationForm;