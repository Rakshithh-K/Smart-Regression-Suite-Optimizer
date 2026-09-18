import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  FileClock,
  Loader2,
  TestTube2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRun, setSelectedRun] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/api/history`,
        {
          withCredentials: true,
        }
      );

      setHistory(response.data.history || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to load optimization history."
      );
    } finally {
      setLoading(false);
    }
  };

  const openRun = async (runId) => {
    try {
      setDetailLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/history/${runId}`,
        {
          withCredentials: true,
        }
      );

      setSelectedRun(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to load optimization details."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedRun(null);
  };

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-10 lg:py-8">

      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div className="mb-8">
        <p className="text-sm font-medium text-blue-400">
          Regression history
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          Optimization History
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Review previous regression suite optimization runs.
        </p>
      </div>


      {/* ================================================= */}
      {/* Error */}
      {/* ================================================= */}

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-900/70 bg-red-950/30 p-4">
          <AlertCircle
            size={20}
            className="mt-0.5 text-red-400"
          />

          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}


      {/* ================================================= */}
      {/* Loading */}
      {/* ================================================= */}

      {loading && (
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2
            size={20}
            className="animate-spin"
          />

          Loading history...
        </div>
      )}


      {/* ================================================= */}
      {/* Empty */}
      {/* ================================================= */}

      {!loading &&
        !error &&
        history.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

            <FileClock
              size={42}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-5 text-lg font-semibold text-white">
              No optimization runs yet
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Your completed optimization runs will appear here.
            </p>

          </div>
        )}


      {/* ================================================= */}
      {/* History list */}
      {/* ================================================= */}

      {!loading &&
        history.length > 0 &&
        !selectedRun && (

          <div className="space-y-3">

            {history.map((run) => (
              <button
                key={run.id}
                type="button"
                onClick={() => openRun(run.id)}
                className="group w-full rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-slate-700 hover:bg-slate-[850]"
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  {/* Run information */}

                  <div className="min-w-0">

                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Optimization Run #{run.id}
                    </p>

                    <h2 className="mt-2 break-words text-base font-semibold text-white sm:text-lg">
                      {run.change_description}
                    </h2>

                  </div>


                  {/* Metrics */}

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">

                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock3 size={16} />

                      {run.execution_time} /{" "}
                      {run.time_budget} min
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <TestTube2 size={16} />

                      {run.selected_tests} /{" "}
                      {run.total_tests} tests
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <CalendarDays size={16} />

                      {new Date(
                        run.created_at
                      ).toLocaleDateString()}
                    </div>

                    <ChevronRight
                      size={20}
                      className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-400"
                    />

                  </div>

                </div>

              </button>
            ))}

          </div>
        )}


      {/* ================================================= */}
      {/* Detail loading */}
      {/* ================================================= */}

      {detailLoading && (
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2
            size={20}
            className="animate-spin"
          />

          Loading optimization details...
        </div>
      )}


      {/* ================================================= */}
      {/* Run details */}
      {/* ================================================= */}

      {selectedRun && !detailLoading && (

        <div>

          {/* Back button */}

          <button
            type="button"
            onClick={closeDetails}
            className="mb-6 text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            ← Back to history
          </button>


          {/* Run header */}

          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Optimization Run #{selectedRun.run.id}
            </p>

            <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
              {selectedRun.run.change_description}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {new Date(
                selectedRun.run.created_at
              ).toLocaleString()}
            </p>

          </div>


          {/* Summary */}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <MetricCard
              label="Execution"
              value={`${selectedRun.run.execution_time} / ${selectedRun.run.time_budget} min`}
            />

            <MetricCard
              label="Selected Tests"
              value={`${selectedRun.run.selected_tests} / ${selectedRun.run.total_tests}`}
            />

            <MetricCard
              label="Tests Executed"
              value={selectedRun.selected_tests.length}
            />

          </div>


          {/* Selected tests */}

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 px-5 py-4">
              <h3 className="font-semibold text-white">
                Selected Regression Tests
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Tests selected by the deterministic optimizer.
              </p>
            </div>


            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px] text-left text-sm">

                <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">

                  <tr>
                    <th className="px-5 py-4">
                      Test ID
                    </th>

                    <th className="px-5 py-4">
                      Module
                    </th>

                    <th className="px-5 py-4">
                      Duration
                    </th>

                    <th className="px-5 py-4">
                      Relevance
                    </th>

                    <th className="px-5 py-4">
                      Priority Score
                    </th>
                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-800">

                  {selectedRun.selected_tests.map(
                    (test) => (

                      <tr
                        key={test.test_id}
                        className="hover:bg-slate-800/40"
                      >

                        <td className="px-5 py-4 font-medium text-white">
                          {test.test_id}
                        </td>

                        <td className="px-5 py-4 text-slate-400">
                          {test.module}
                        </td>

                        <td className="px-5 py-4 text-slate-400">
                          {test.duration} min
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {Number(
                            test.relevance_score
                          ).toFixed(1)}
                        </td>

                        <td className="px-5 py-4 font-medium text-blue-400">
                          {Number(
                            test.priority_score
                          ).toFixed(1)}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}


export default History; 