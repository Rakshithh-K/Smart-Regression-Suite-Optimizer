import { AlertTriangle } from "lucide-react";

function HighRiskTests({ tests }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <div className="mb-5">
        <h2 className="text-lg font-semibold">
          High-Risk Exclusions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          High-priority relevant tests that could not fit
          within the execution budget.
        </p>
      </div>

      {tests.length === 0 ? (
        <p className="text-sm text-slate-500">
          No high-risk tests were excluded.
        </p>
      ) : (
        <div className="space-y-3">

          {tests.map((test) => (
            <div
              key={test.test_id}
              className="rounded-xl border border-red-900/50 bg-red-950/20 p-4"
            >

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={20}
                    className="mt-0.5 text-red-400"
                  />

                  <div>
                    <p className="font-semibold">
                      {test.test_id}
                    </p>

                    <p className="text-sm text-slate-400">
                      {test.module}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-400">

                  <span>
                    Relevance:{" "}
                    <strong className="text-white">
                      {test.relevance_score}
                    </strong>
                  </span>

                  <span>
                    Failures:{" "}
                    <strong className="text-white">
                      {test.historical_failure_count}
                    </strong>
                  </span>

                  <span>
                    Duration:{" "}
                    <strong className="text-white">
                      {test.duration} min
                    </strong>
                  </span>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}
    </section>
  );
}

export default HighRiskTests;