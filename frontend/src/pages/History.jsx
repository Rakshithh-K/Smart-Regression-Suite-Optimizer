import { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  FileClock,
} from "lucide-react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRun, setSelectedRun] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

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
    const utilization = Math.min(100, Math.round((run.execution_time / Math.max(run.time_budget, 1)) * 100));

    return (
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        <div>
          <button
            type="button"
            onClick={closeDetails}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft size={14} />
            <span>Back to Optimization History</span>
          </button>
        </div>

        {/* Run Summary Header */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded">
              RUN #{run.id}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {new Date(run.created_at).toLocaleString()}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {run.change_description}
          </h1>

          {/* Coherent Metrics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
                Tests Selected
              </span>
              <p className="mt-1 text-2xl font-black text-slate-900 font-mono">
                {tests.length}{" "}
                <span className="text-xs font-normal text-slate-400 font-sans">
                  / {run.total_tests ?? run.selected_tests}
                </span>
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
                Execution Time
              </span>
              <p className="mt-1 text-2xl font-black text-indigo-600 font-mono">
                {run.execution_time} <span className="text-xs font-normal text-slate-400 font-sans">min</span>
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
                Time Budget
              </span>
              <p className="mt-1 text-2xl font-black text-slate-800 font-mono">
                {run.time_budget} <span className="text-xs font-normal text-slate-400 font-sans">min</span>
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
                Budget Utilization
              </span>
              <p className="mt-1 text-2xl font-black text-emerald-600 font-mono">
                {utilization}%
              </p>
            </div>
          </div>
        </div>

        {/* Selected Tests Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Selected Tests in Run #{run.id}
            </h2>
            <span className="text-xs font-mono text-slate-500">
              {tests.length} tests
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 font-mono uppercase tracking-wider text-[11px] border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="py-2.5 px-3">Test ID</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Module</th>
                  <th className="py-2.5 px-3 text-right">Runtime</th>
                  <th className="py-2.5 px-3 text-right">Relevance</th>
                  <th className="py-2.5 px-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tests.map((test) => (
                  <tr key={test.test_id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">
                      {test.test_id}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">
                      {test.description || "Regression test"}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {test.module}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {test.duration}m
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                      {Number(test.relevance_score ?? 0).toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-700">
                      {Number(test.priority_score ?? 0).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block mb-1 font-mono">
            Audit Log
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Optimization History
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
            Historical log of regression suite knapsack optimization runs and test allocations.
          </p>
        </div>
        <button
          type="button"
          onClick={loadHistory}
          className="self-start sm:self-auto rounded-md border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
        >
          Refresh History
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
          <AlertCircle size={16} className="shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2.5 py-20 text-slate-500">
          <Loader2 size={18} className="animate-spin text-indigo-600" />
          <span className="text-xs font-semibold">Loading optimization runs...</span>
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-16 text-center shadow-xs">
          <FileClock size={28} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">No Optimization Runs Recorded</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Execute a regression suite optimization from the Dashboard to log your first run here.
          </p>
        </div>
      )}

      {detailLoading && (
        <div className="flex items-center justify-center gap-2.5 py-20 text-slate-500">
          <Loader2 size={18} className="animate-spin text-indigo-600" />
          <span className="text-xs font-semibold">Retrieving run details...</span>
        </div>
      )}

      {/* History Data Table */}
      {!loading && history.length > 0 && !selectedRun && !detailLoading && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Run</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Change Description</th>
                  <th className="py-3 px-4 font-bold text-right">Analyzed</th>
                  <th className="py-3 px-4 font-bold text-right">Selected</th>
                  <th className="py-3 px-4 font-bold text-right">Runtime / Budget</th>
                  <th className="py-3 px-4 font-bold text-right">Utilization</th>
                  <th className="py-3 px-4 w-8"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {history.map((run) => {
                  const utilization = Math.min(
                    100,
                    Math.round((run.execution_time / Math.max(run.time_budget, 1)) * 100)
                  );

                  return (
                    <tr
                      key={run.id}
                      onClick={() => openRun(run.id)}
                      className="group hover:bg-slate-50/80 transition cursor-pointer select-none"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                        #{run.id}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(run.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-slate-900 font-medium max-w-xs sm:max-w-md truncate">
                        {run.change_description}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                        {run.total_tests || "—"}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        {run.selected_tests}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-700 whitespace-nowrap">
                        {run.execution_time}m / {run.time_budget}m
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${
                            utilization >= 100
                              ? "text-amber-700 bg-amber-50 border border-amber-200"
                              : "text-emerald-700 bg-emerald-50 border border-emerald-200"
                          }`}
                        >
                          {utilization}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 group-hover:text-slate-700">
                        <ChevronRight size={14} />
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
  );
}

export default History;