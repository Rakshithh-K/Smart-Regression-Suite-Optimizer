import { CheckCircle, Layers, Tag } from "lucide-react";

function CoverageSection({ coverage = {} }) {
  const modules = Object.entries(coverage?.module_coverage || {});
  const tags = Object.entries(coverage?.tag_coverage || {});
  const totalModuleTests = modules.reduce((sum, [, c]) => sum + c, 0);

  return (
    <section className="space-y-4">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
          Suite Coverage Analysis
        </h3>
        <p className="mt-1 text-sm sm:text-base text-slate-600">
          Distribution and depth of selected regression tests across functional modules and tags.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Module Coverage */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Layers size={18} className="text-indigo-600" />
            <h4 className="text-base font-bold text-slate-900">
              Module Distribution ({modules.length} modules)
            </h4>
          </div>

          <div className="space-y-4">
            {modules.map(([name, count]) => {
              const pct = totalModuleTests > 0 ? Math.round((count / totalModuleTests) * 100) : 0;
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-base font-semibold text-slate-800 capitalize">
                      {name}
                    </span>
                    <span className="text-sm font-semibold text-slate-600">
                      {count} {count === 1 ? "test" : "tests"} · {pct}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Behavioral Tag Coverage */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Tag size={18} className="text-indigo-600" />
            <h4 className="text-base font-bold text-slate-900">
              Behavioral & Domain Tags ({tags.length} tags)
            </h4>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {tags.map(([name, count]) => (
              <span
                key={name}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-800"
              >
                <span>{name}</span>
                <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
                  {count}
                </span>
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-2.5 text-sm font-medium text-emerald-800">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <span>Targeted test matrix covers all impacted modules identified in the diff.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoverageSection;