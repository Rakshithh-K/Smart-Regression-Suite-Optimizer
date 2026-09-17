import { useState } from "react";
import { AlertTriangle, Sparkles } from "lucide-react";

import { optimizeRegressionSuite } from "../api";

import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import OptimizationForm from "../components/dashboard/OptimizationForm";
import StatsCards from "../components/dashboard/StatsCards";
import SelectedTestsTable from "../components/dashboard/SelectedTestsTable";
import HighRiskTests from "../components/dashboard/HighRiskTests";
import CoverageSection from "../components/dashboard/CoverageSection";
import AIReasoning from "../components/dashboard/AIReasoning";


function Dashboard() {
  const [file, setFile] = useState(null);
  const [changeDescription, setChangeDescription] = useState("");
  const [timeBudget, setTimeBudget] = useState(30);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");


  const handleOptimize = async () => {
    setError("");
    setResult(null);

    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    if (!changeDescription.trim()) {
      setError("Please enter a change description.");
      return;
    }

    if (timeBudget <= 0) {
      setError("Time budget must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      const data = await optimizeRegressionSuite(
        file,
        changeDescription,
        timeBudget
      );

      setResult(data);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Something went wrong while optimizing the regression suite."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950">

        <div className="w-full px-6 py-6 lg:px-10">

          <div className="flex items-start gap-4">

            <div className="mt-1 rounded-xl bg-blue-600/10 p-3">
              <Sparkles
                size={24}
                className="text-blue-400"
              />
            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Smart Regression Suite Optimizer
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
                Build a risk-aware regression suite by balancing
                change relevance, test priority, historical failure
                risk, and execution time.
              </p>

            </div>

          </div>

        </div>

      </header>


      {/* Main Content */}
      <main className="w-full px-6 py-8 lg:px-10">

        {/* Welcome */}
        <WelcomeBanner />


        {/* Optimization Input */}
        <section>

          <OptimizationForm
            file={file}
            setFile={setFile}
            changeDescription={changeDescription}
            setChangeDescription={setChangeDescription}
            timeBudget={timeBudget}
            setTimeBudget={setTimeBudget}
            loading={loading}
            onOptimize={handleOptimize}
          />


          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-900/70 bg-red-950/30 p-4">

              <AlertTriangle
                size={20}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div>

                <p className="text-sm font-semibold text-red-300">
                  Optimization failed
                </p>

                <p className="mt-1 text-sm leading-6 text-red-400">
                  {error}
                </p>

              </div>

            </div>
          )}

        </section>


        {/* Optimization Results */}
        {result && (
          <section className="mt-10 space-y-8">

            {/* Results Header */}
            <div className="border-b border-slate-800 pb-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <p className="text-sm font-medium text-blue-400">
                    Optimization complete
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Regression Suite Recommendation
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                    The deterministic optimizer selected the highest
                    scoring combination that fits within your available
                    execution budget.
                  </p>

                </div>


                {/* Budget Summary */}
                <div className="shrink-0 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4">

                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Execution Budget
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {result.recommendation.total_execution_time}
                    {" / "}
                    {result.recommendation.time_budget}
                    {" min"}
                  </p>

                </div>

              </div>

            </div>


            {/* Overview */}
            <StatsCards
              result={result}
            />


            {/* Selected Tests */}
            <SelectedTestsTable
              tests={result.selected_tests}
              recommendation={result.recommendation}
            />


            {/* High Risk Exclusions */}
            <HighRiskTests
              tests={result.excluded_high_risk_tests}
            />


            {/* Coverage */}
            <CoverageSection
              coverage={result.coverage}
            />


            {/* AI Reasoning */}
            <AIReasoning
              explanations={result.ai_explanations}
            />

          </section>
        )}

      </main>

    </div>
  );
}


export default Dashboard;