function WelcomeBanner() {
  return (
    <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900">
      <div className="px-6 py-7 sm:px-8 sm:py-8">

        <div className="max-w-3xl">

          <p className="text-sm font-medium text-blue-400">
            Regression planning
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Welcome to Regression Optimizer
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
            Have a change to test but limited time? Describe what
            changed, upload your test cases, and set your execution
            window. The optimizer will help you identify the tests
            worth running.
          </p>

        </div>


        {/* Process */}
        <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">

          <ProcessItem text="Describe change" />

          <span className="text-slate-700">
            →
          </span>

          <ProcessItem text="Upload tests" />

          <span className="text-slate-700">
            →
          </span>

          <ProcessItem text="Set time" />

          <span className="text-slate-700">
            →
          </span>

          <ProcessItem text="Get regression suite" />

        </div>

      </div>
    </section>
  );
}


function ProcessItem({ text }) {
  return (
    <span className="text-xs font-medium text-slate-500 sm:text-sm">
      {text}
    </span>
  );
}


export default WelcomeBanner;