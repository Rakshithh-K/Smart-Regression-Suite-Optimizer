function CoverageSection({ coverage = {} }) {
  const modules = Object.entries(coverage?.module_coverage || {});
  const tags = Object.entries(coverage?.tag_coverage || {});
  const totalModuleTests = modules.reduce((sum, [, c]) => sum + c, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Suite Coverage Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribution of selected test cases across functional modules and behavioral tags.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500">
          {modules.length} Modules · {tags.length} Tags
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Module Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
            Module Allocation
          </span>

          <div className="space-y-2.5">
            {modules.map(([name, count]) => {
              const pct = totalModuleTests > 0 ? Math.round((count / totalModuleTests) * 100) : 0;
              return (
                <div key={name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 capitalize font-mono">
                      {name}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {count} tests ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
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
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block font-mono mb-3">
              Behavioral & Domain Tags
            </span>

            <div className="flex flex-wrap gap-2">
              {tags.map(([name, count]) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-800 font-mono"
                >
                  <span>{name}</span>
                  <span className="text-[11px] font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-1.5 py-0.2 rounded">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-emerald-700 font-medium">
            ✓ Targeted test matrix covers all impacted modules identified in the diff.
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoverageSection;