import { Sparkles } from "lucide-react";

function AIReasoning({ explanations }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <div className="flex items-start gap-3">

        <div className="rounded-xl bg-purple-500/10 p-2.5">
          <Sparkles
            size={20}
            className="text-purple-400"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            AI Reasoning
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Explanations based on the deterministic optimization
            results.
          </p>
        </div>

      </div>

      {/* Overall Trade-off */}
      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5">

        <p className="text-xs font-semibold uppercase tracking-wide text-purple-400">
          Overall Trade-off
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {explanations.overall_tradeoff}
        </p>

      </div>

      {/* Reasons */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">

        {/* Selected */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-300">
            Selected Tests
          </h3>

          <div className="space-y-3">

            {Object.entries(
              explanations.selected_reasons
            ).map(([testId, reason]) => (
              <div
                key={testId}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="text-sm font-semibold text-blue-400">
                  {testId}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {reason}
                </p>
              </div>
            ))}

          </div>
        </div>

        {/* Excluded */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-300">
            Excluded Tests
          </h3>

          <div className="space-y-3">

            {Object.entries(
              explanations.excluded_reasons
            ).map(([testId, reason]) => (
              <div
                key={testId}
                className="rounded-xl border border-red-900/40 bg-red-950/10 p-4"
              >
                <p className="text-sm font-semibold text-red-400">
                  {testId}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {reason}
                </p>
              </div>
            ))}

          </div>
        </div>

      </div>

    </section>
  );
}

export default AIReasoning;