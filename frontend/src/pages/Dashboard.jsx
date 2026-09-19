import { useState, useRef, useEffect } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

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
    <div className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8">
      {/* Editorial Page Header */}
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
          <div className="mt-3.5 flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-sm font-medium text-rose-700">
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
      </section>

      {/* Optimization Results Section */}
      {result && (
        <section ref={resultRef} className="pt-6 border-t border-slate-200 space-y-8">
          {/* Prominent Result Header */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
            <div>
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-emerald-700 mb-1.5">
                <CheckCircle2 size={16} />
                Optimization Complete
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Regression Suite Ready for Execution
              </h2>
              <p className="mt-1.5 text-base text-slate-600 font-normal">
                <strong className="text-emerald-700 font-semibold font-mono">
                  {result.summary?.selected_count ?? 0} tests selected
                </strong>{" "}
                within a{" "}
                <span className="font-semibold text-slate-900 font-mono">
                  {result.recommendation?.time_budget ?? 0}m
                </span>{" "}
                window ({result.recommendation?.total_execution_time ?? 0} min total planned runtime).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-md shadow-xs">
                Total Tests Analyzed:{" "}
                <strong className="text-slate-900">{result.summary?.total_tests ?? 0}</strong>
              </span>
            </div>
          </div>

          {/* Key Metrics Information System */}
          <StatsCards result={result} />

          {/* Test Case Allocation Section with Tab Switcher */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 space-y-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Test Case Allocations
                </h3>
                <p className="text-sm text-slate-500 mt-1 font-normal">
                  Inspection of selected tests versus budget-omitted high-risk tests.
                </p>
              </div>

              {/* View switch tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("selected")}
                  className={`rounded px-3.5 py-1.5 text-sm font-medium transition ${
                    activeTab === "selected"
                      ? "bg-white text-slate-900 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Selected ({result.selected_tests?.length ?? 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("excluded")}
                  className={`rounded px-3.5 py-1.5 text-sm font-medium transition ${
                    activeTab === "excluded"
                      ? "bg-white text-amber-700 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  High-Risk Excluded ({result.excluded_high_risk_tests?.length ?? 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`rounded px-3.5 py-1.5 text-sm font-medium transition ${
                    activeTab === "all"
                      ? "bg-white text-slate-900 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  View Both
                </button>
              </div>
            </div>

            {/* Selected Tests Tab Content */}
            {(activeTab === "selected" || activeTab === "all") && (
              <div className={activeTab === "all" ? "pb-8 border-b border-slate-200" : ""}>
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
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
            <CoverageSection coverage={result.coverage} />
          </div>

          {/* Decision Rationale */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
            <AIReasoning explanations={result.ai_explanations} />
          </div>
        </section>
      )}
    </div>
  );
}

export default Dashboard;