function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-red-950 text-red-400",
    Medium: "bg-yellow-950 text-yellow-400",
    Low: "bg-slate-800 text-slate-400",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[priority] || styles.Low
      }`}
    >
      {priority}
    </span>
  );
}

function SelectedTestsTable({ tests, recommendation }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

        <div>
          <h2 className="text-lg font-semibold">
            Selected Regression Tests
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Tests selected by the deterministic optimizer.
          </p>
        </div>

        <span className="rounded-full bg-green-950 px-3 py-1 text-xs font-medium text-green-400">
          {recommendation.total_execution_time} /{" "}
          {recommendation.time_budget} min
        </span>

      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">

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
            {tests.map((test) => (
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
    </section>
  );
}

export default SelectedTestsTable;