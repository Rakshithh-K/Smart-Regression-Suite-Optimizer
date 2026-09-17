import {
  Upload,
  Clock,
  Play,
} from "lucide-react";

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
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-lg font-semibold">
        Regression Optimization
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Change Description */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Change Description
          </label>

          <textarea
            value={changeDescription}
            onChange={(event) =>
              setChangeDescription(event.target.value)
            }
            placeholder="Example: Payment UPI failure handling was changed"
            rows="4"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          />
        </div>

        {/* CSV Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Test Case CSV
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-4 transition hover:border-blue-500">
            <Upload size={20} />

            <div>
              <p className="text-sm font-medium">
                {file
                  ? file.name
                  : "Upload test cases CSV"}
              </p>

              <p className="text-xs text-slate-500">
                CSV files only
              </p>
            </div>

            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(event) =>
                setFile(event.target.files[0])
              }
            />
          </label>
        </div>

        {/* Time Budget */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Time Budget
          </label>

          <div className="relative">
            <Clock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="number"
              min="1"
              value={timeBudget}
              onChange={(event) =>
                setTimeBudget(Number(event.target.value))
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Maximum regression execution time in minutes.
          </p>
        </div>

      </div>

      {/* Optimize Button */}
      <button
        onClick={onOptimize}
        disabled={loading}
        className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Play size={18} />

        {loading
          ? "Optimizing..."
          : "Optimize Regression Suite"}
      </button>
    </section>
  );
}

export default OptimizationForm;