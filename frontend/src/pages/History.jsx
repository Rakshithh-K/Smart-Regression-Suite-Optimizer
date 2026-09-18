import { useEffect, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Clock,
  Loader2,
  TestTube2,
  AlertCircle,
  ArrowLeft,
  FileClock,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRun, setSelectedRun] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [expandedTestId, setExpandedTestId] = useState(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/api/history`, { withCredentials: true });
      setHistory(response.data.history || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Unable to load optimization history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const openRun = async (runId) => {
    try {
      setDetailLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/api/history/${runId}`, { withCredentials: true });
      setSelectedRun(response.data);
      setExpandedTestId(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Unable to load optimization details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => setSelectedRun(null);

  // Detail view
  if (selectedRun && !detailLoading) {
    const run = selectedRun.run;
    const tests = selectedRun.selected_tests || [];

    return (
      <div className="w-full max-w-[1680px] mx-auto px-5 py-6 sm:px-8 sm:py-8 lg:px-10 space-y-8">
        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={closeDetails}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            <ArrowLeft size={16} />
            <span>Back to Optimization History</span>
          </button>
        </div>

        {/* Saved Run Header Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="font-mono text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded border border-indigo-200">
              RUN {run.id}
            </span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
              <Calendar size={15} />
              <span>{new Date(run.created_at).toLocaleString()}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {run.change_description}
          </h1>

          {/* Metric Summary Blocks */}
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tests Selected
              </span>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-indigo-600">
                {tests.length}{" "}
                <span className="text-base font-semibold text-slate-400">
                  / {run.total_tests ?? run.selected_tests}
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Execution Time
              </span>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
                {run.execution_time} min
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Time Budget
              </span>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
                {run.time_budget} min
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Budget Utilization
              </span>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-600">
                {Math.min(100, Math.round((run.execution_time / Math.max(run.time_budget, 1)) * 100))}%
              </p>
            </div>
          </div>
        </div>

        {/* Selected Tests in same compact clickable row list design */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Selected Tests in Run {run.id}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Click any row to reveal priority index and module details
              </p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700 border border-indigo-200">
              {tests.length} tests
            </span>
          </div>

          <div className="space-y-3">
            {tests.map((test) => {
              const isExpanded = expandedTestId === test.test_id;
              const relevance = Number(test.relevance_score ?? 0).toFixed(1);
              const score = Number(test.priority_score ?? 0).toFixed(1);

              return (
                <div
                  key={test.test_id}
                  className={`rounded-xl border bg-white transition-all shadow-xs overflow-hidden ${
                    isExpanded
                      ? "border-indigo-500 ring-2 ring-indigo-500/10"
                      : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedTestId((prev) => (prev === test.test_id ? null : test.test_id))}
                    className="w-full text-left p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-sm font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100">
                          {test.test_id}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                          {test.module}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-slate-900">
                        {test.description || "Regression verification test case"}
                      </h4>
                    </div>

                    <div className="flex items-center flex-wrap sm:flex-nowrap gap-4 lg:gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                        <Clock size={16} className="text-slate-400" />
                        <span>{test.duration} min</span>
                      </div>
                      <div className="text-sm font-medium text-slate-600">
                        <span className="text-slate-400 mr-1 text-xs uppercase font-semibold">Rel:</span>
                        <span className="font-semibold text-slate-800">{relevance}</span>
                      </div>
                      <div className="rounded-md bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 text-xs sm:text-sm font-bold text-indigo-700">
                        Score {score}
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronDown size={22} className="text-indigo-600" /> : <ChevronRight size={22} />}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-200/80 bg-slate-50/50 p-5 sm:p-6 transition-all">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-white border border-slate-200">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                            Test ID
                          </span>
                          <span className="font-mono text-sm font-bold text-slate-900">{test.test_id}</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                            Module
                          </span>
                          <span className="text-sm font-bold text-slate-800 capitalize">{test.module}</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                            Runtime
                          </span>
                          <span className="text-sm font-bold text-slate-800">{test.duration} minutes</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                            Payoff Score
                          </span>
                          <span className="text-sm font-bold text-indigo-700">{score} pts</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="w-full max-w-[1680px] mx-auto px-5 py-6 sm:px-8 sm:py-8 lg:px-10 space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Optimization Run History
            </h1>
            <p className="mt-1 text-base text-slate-600">
              Audit log of previous regression suite knapsack optimization runs and test selections.
            </p>
          </div>
          <button
            type="button"
            onClick={loadHistory}
            className="self-start sm:self-auto rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Refresh History
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-base font-medium text-rose-800">
          <AlertCircle size={20} className="shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-20 text-slate-600">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
          <span className="text-base font-semibold">Loading optimization runs...</span>
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-16 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
            <FileClock size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Optimization Runs Yet</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Execute a regression suite optimization from the Dashboard to record your first run here.
          </p>
        </div>
      )}

      {detailLoading && (
        <div className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-20 text-slate-600">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
          <span className="text-base font-semibold">Retrieving run details...</span>
        </div>
      )}

      {/* History Rows List */}
      {!loading && history.length > 0 && !selectedRun && !detailLoading && (
        <div className="space-y-3">
          {history.map((run) => (
            <button
              key={run.id}
              type="button"
              onClick={() => openRun(run.id)}
              className="group w-full text-left rounded-xl border border-slate-200 bg-white p-5 sm:p-6 transition-all hover:border-indigo-400 hover:shadow-sm focus:outline-none"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: ID + Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                      RUN {run.id}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-400">
                      {new Date(run.created_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {run.change_description}
                  </h3>
                </div>

                {/* Right: Metrics + Chevron */}
                <div className="flex items-center flex-wrap sm:flex-nowrap gap-5 lg:gap-8 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Clock size={18} className="text-slate-400" />
                    <span>
                      <strong className="text-slate-900 font-bold">{run.execution_time} min</strong>{" "}
                      <span className="text-slate-400">/ {run.time_budget}m budget</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <TestTube2 size={18} className="text-slate-400" />
                    <span>
                      <strong className="text-indigo-600 font-bold">{run.selected_tests}</strong>{" "}
                      <span className="text-slate-400">
                        {run.total_tests ? `/ ${run.total_tests} tests` : "selected"}
                      </span>
                    </span>
                  </div>

                  <div className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;