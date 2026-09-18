import { useState, useRef, useEffect } from "react";
import { AlertCircle, CheckCircle2, Sliders } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("selected"); // "selected" | "excluded" | "all"

  const resultRef = useRef(null);

  // Auto-scroll to optimization result section when result arrives
  useEffect(() => {
    if (result && resultRef.current) {
      // Small timeout ensures DOM layout is updated before scrolling
      const timer = setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleOptimize = async () => {
    setError("");

    if (!file) {
      setError("Please select a CSV file containing your test cases catalog.");
      return;
    }
    if (!changeDescription.trim()) {
      setError("Please enter a description of the code or feature change.");
      return;
    }
    if (timeBudget <= 0) {
      setError("Time budget must be greater than 0 minutes.");
      return;
    }

    try {
      setLoading(true);
      const data = await optimizeRegressionSuite(file, changeDescription, timeBudget);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "An error occurred while optimizing the regression suite. Please check your inputs and CSV format."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1680px] mx-auto px-5 py-6 sm:px-8 sm:py-8 lg:px-10 space-y-10">
      {/* Top Hero Banner */}
      <WelcomeBanner />

      {/* Optimization Workspace */}
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

        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-base font-medium text-rose-800">
            <AlertCircle size={20} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
      </section>

      {/* Optimization Results Section */}
      {result && (
        <section ref={resultRef} className="pt-6 border-t border-slate-200 space-y-10">
          {/* Prominent Result Header */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
                  <CheckCircle2 size={15} />
                  Optimization Complete
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Regression Suite Ready For Execution
                </h2>
                <p className="mt-1 text-base text-slate-600">
                  {result.summary?.selected_count ?? 0} tests selected within a{" "}
                  <span className="font-semibold text-slate-900">
                    {result.recommendation?.time_budget ?? 0}-minute
                  </span>{" "}
                  execution window ({result.recommendation?.total_execution_time ?? 0} min total planned runtime).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200">
                  Total Tests Analyzed: {result.summary?.total_tests ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics and Budget Progress Bar */}
          <StatsCards result={result} />

          {/* Tab Switcher for Tests: SELECTED TESTS vs HIGH-RISK EXCLUDED */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Sliders size={20} className="text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-900">
                  Test Case Allocations
                </h3>
              </div>

              {/* View switch buttons */}
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("selected")}
                  className={`rounded-md px-4 py-2 text-sm font-bold transition ${
                    activeTab === "selected"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Selected Tests ({result.selected_tests?.length ?? 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("excluded")}
                  className={`rounded-md px-4 py-2 text-sm font-bold transition ${
                    activeTab === "excluded"
                      ? "bg-white text-amber-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  High-Risk Excluded ({result.excluded_high_risk_tests?.length ?? 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`rounded-md px-4 py-2 text-sm font-bold transition ${
                    activeTab === "all"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  View Both
                </button>
              </div>
            </div>

            {/* Selected Tests Tab Content */}
            {(activeTab === "selected" || activeTab === "all") && (
              <div className={activeTab === "all" ? "mb-10 pb-10 border-b border-slate-200" : ""}>
                <SelectedTestsTable
                  tests={result.selected_tests}
                  recommendation={result.recommendation}
                  aiExplanations={result.ai_explanations}
                />
              </div>
            )}

            {/* Excluded Tests Tab Content */}
            {(activeTab === "excluded" || activeTab === "all") && (
              <div>
                <HighRiskTests
                  tests={result.excluded_high_risk_tests}
                  aiExplanations={result.ai_explanations}
                />
              </div>
            )}
          </div>

          {/* Suite Coverage Analysis */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <CoverageSection coverage={result.coverage} />
          </div>

          {/* Decision Rationale */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <AIReasoning explanations={result.ai_explanations} />
          </div>
        </section>
      )}
    </div>
  );
}

export default Dashboard;