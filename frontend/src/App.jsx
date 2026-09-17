import { useState } from "react";
import {
  Upload,
  Play,
  FileText,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { optimizeRegressionSuite } from "./api";

function App() {
  const [file, setFile] = useState(null);
  const [changeDescription, setChangeDescription] = useState("");
  const [timeBudget, setTimeBudget] = useState(30);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleOptimize = async () => {
    setError("");
    setResult(null);

    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    if (!changeDescription.trim()) {
      setError("Please enter a change description.");
      return;
    }

    if (timeBudget <= 0) {
      setError("Time budget must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      const data = await optimizeRegressionSuite(
        file,
        changeDescription,
        timeBudget
      );

      setResult(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Something went wrong while optimizing the regression suite."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <h1 className="text-2xl font-bold">
            Smart Regression Suite Optimizer
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Select the highest-value regression tests within your
            execution-time budget.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Input Section */}
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
                    {file ? file.name : "Upload test cases CSV"}
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
            onClick={handleOptimize}
            disabled={loading}
            className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play size={18} />

            {loading
              ? "Optimizing..."
              : "Optimize Regression Suite"}
          </button>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}
        </section>

        {/* Results */}
        {result && (
          <section className="mt-8 space-y-6">

            {/* Overview */}
            <div>
              <h2 className="mb-4 text-lg font-semibold">
                Optimization Overview
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <StatCard
                  icon={<FileText size={20} />}
                  title="Total Tests"
                  value={result.summary.total_tests}
                />

                <StatCard
                  icon={<CheckCircle2 size={20} />}
                  title="Selected Tests"
                  value={result.summary.selected_count}
                />

                <StatCard
                  icon={<Clock size={20} />}
                  title="Execution Time"
                  value={`${result.recommendation.total_execution_time} min`}
                />

                <StatCard
                  icon={<ShieldAlert size={20} />}
                  title="High-Risk Excluded"
                  value={result.summary.excluded_high_risk_count}
                />

              </div>
            </div>

            {/* Selected Tests */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Selected Regression Tests
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tests selected by the deterministic optimizer.
                  </p>
                </div>

                <span className="rounded-full bg-green-950 px-3 py-1 text-xs font-medium text-green-400">
                  {result.recommendation.total_execution_time} /{" "}
                  {result.recommendation.time_budget} min
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">

                  <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Test ID</th>
                      <th className="px-4 py-3">Module</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Relevance</th>
                      <th className="px-4 py-3">Score</th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.selected_tests.map((test) => (
                      <tr
                        key={test.test_id}
                        className="border-b border-slate-800 last:border-0"
                      >
                        <td className="px-4 py-3 font-medium">
                          {test.test_id}
                        </td>

                        <td className="px-4 py-3 text-slate-300">
                          {test.module}
                        </td>

                        <td className="px-4 py-3">
                          <PriorityBadge
                            priority={test.priority}
                          />
                        </td>

                        <td className="px-4 py-3">
                          {test.duration} min
                        </td>

                        <td className="px-4 py-3">
                          {test.relevance_score}
                        </td>

                        <td className="px-4 py-3 font-semibold text-blue-400">
                          {test.priority_score}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>

            {/* High Risk Exclusions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <div className="mb-5">
                <h2 className="text-lg font-semibold">
                  High-Risk Exclusions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  High-priority relevant tests that could not fit
                  within the execution budget.
                </p>
              </div>

              {result.excluded_high_risk_tests.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No high-risk tests were excluded.
                </p>
              ) : (
                <div className="space-y-3">

                  {result.excluded_high_risk_tests.map((test) => (
                    <div
                      key={test.test_id}
                      className="flex flex-col gap-2 rounded-xl border border-red-900/50 bg-red-950/20 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-semibold">
                          {test.test_id}
                        </p>

                        <p className="text-sm text-slate-400">
                          {test.module}
                        </p>
                      </div>

                      <div className="flex gap-5 text-sm">
                        <span>
                          Relevance:{" "}
                          <strong>{test.relevance_score}</strong>
                        </span>

                        <span>
                          Failure Count:{" "}
                          <strong>
                            {test.historical_failure_count}
                          </strong>
                        </span>

                        <span>
                          Duration:{" "}
                          <strong>{test.duration} min</strong>
                        </span>
                      </div>
                    </div>
                  ))}

                </div>
              )}
            </div>

            {/* Coverage */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h2 className="text-lg font-semibold">
                Coverage
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Coverage represented by the selected regression tests.
              </p>

              <div className="mt-5 grid gap-6 md:grid-cols-2">

                <CoverageList
                  title="Modules"
                  data={result.coverage.module_coverage}
                />

                <CoverageList
                  title="Tags"
                  data={result.coverage.tag_coverage}
                />

              </div>
            </div>

            {/* AI Explanation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h2 className="text-lg font-semibold">
                AI Reasoning
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Explanations generated from the deterministic
                optimization results.
              </p>

              <div className="mt-5 rounded-xl bg-slate-950 p-5">

                <h3 className="mb-2 text-sm font-semibold text-blue-400">
                  Overall Trade-off
                </h3>

                <p className="text-sm leading-6 text-slate-300">
                  {result.ai_explanations.overall_tradeoff}
                </p>

              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                <ReasonList
                  title="Selected Tests"
                  reasons={
                    result.ai_explanations.selected_reasons
                  }
                />

                <ReasonList
                  title="Excluded Tests"
                  reasons={
                    result.ai_explanations.excluded_reasons
                  }
                />

              </div>
            </div>

          </section>
        )}
      </main>
    </div>
  );
}


/* -------------------------------- */
/* Reusable Components */
/* -------------------------------- */

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <div className="mb-4 text-slate-400">
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}


function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-red-950 text-red-400",
    Medium: "bg-yellow-950 text-yellow-400",
    Low: "bg-slate-800 text-slate-400",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[priority]
      }`}
    >
      {priority}
    </span>
  );
}


function CoverageList({ title, data }) {
  return (
    <div>

      <h3 className="mb-3 text-sm font-semibold">
        {title}
      </h3>

      <div className="space-y-2">

        {Object.entries(data).map(([name, count]) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-lg bg-slate-950 px-4 py-3"
          >
            <span className="text-sm text-slate-300">
              {name}
            </span>

            <span className="text-sm font-semibold">
              {count}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}


function ReasonList({ title, reasons }) {
  return (
    <div>

      <h3 className="mb-3 text-sm font-semibold">
        {title}
      </h3>

      <div className="space-y-3">

        {Object.entries(reasons).map(([testId, reason]) => (
          <div
            key={testId}
            className="rounded-xl bg-slate-950 p-4"
          >
            <p className="mb-1 text-sm font-semibold text-blue-400">
              {testId}
            </p>

            <p className="text-sm leading-6 text-slate-400">
              {reason}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}


export default App;