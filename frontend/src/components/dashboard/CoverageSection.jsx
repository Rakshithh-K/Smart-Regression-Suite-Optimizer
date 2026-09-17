function CoverageSection({ coverage }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <h2 className="text-lg font-semibold">
          Coverage
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Coverage represented by the selected regression tests.
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">

        {/* Modules */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-300">
            Modules
          </h3>

          <div className="space-y-2">
            {Object.entries(
              coverage.module_coverage
            ).map(([name, count]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
              >
                <span className="text-sm text-slate-300">
                  {name}
                </span>

                <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-300">
            Tags
          </h3>

          <div className="flex flex-wrap gap-2">
            {Object.entries(
              coverage.tag_coverage
            ).map(([name, count]) => (
              <span
                key={name}
                className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300"
              >
                {name} × {count}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default CoverageSection;