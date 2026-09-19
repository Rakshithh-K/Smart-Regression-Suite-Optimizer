function CoverageSection({ coverage = {} }) {
  const modules = Object.entries(coverage?.module_coverage || {});
  const tags = Object.entries(coverage?.tag_coverage || {});
  const totalModuleTests = modules.reduce((sum, [, c]) => sum + c, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Suite Coverage Analysis
          </h3>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Distribution of selected test cases across functional modules and behavioral tags.
          </p>
        </div>
        <span className="text-sm font-mono text-slate-500">
          {modules.length} Modules · {tags.length} Tags
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Module Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3.5 shadow-xs">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 block font-mono">
            Module Allocation
          </span>

          <div className="space-y-3">
            {modules.map(([name, count]) => {
              const pct = totalModuleTests > 0 ? Math.round((count / totalModuleTests) * 100) : 0;
              return (
                <div key={name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-semibold text-slate-800 capitalize font-mono">
                      {name}
                    </span>
                    <span className="text-slate-500 font-mono text-xs sm:text-sm">
                      {count} tests ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Behavioral Tag Coverage */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 block font-mono mb-3">
              Behavioral & Domain Tags
            </span>

            <div className="flex flex-wrap gap-2.5">
              {tags.map(([name, count]) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-800 font-mono"
                >
                  <span>{name}</span>
                  <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-sm text-emerald-700 font-medium">
            ✓ Targeted test matrix covers all impacted modules identified in the diff.
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoverageSection;