import { useState } from "react";
import { User, Sliders, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account"); // "account" | "engine" | "security"

  return (
    <div className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600 block mb-1.5 font-mono">
          System Preferences
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="mt-1.5 text-base text-slate-600 font-normal">
          Manage QA engineer account credentials, knapsack solver constraints, and audit retention.
        </p>
      </div>

      {/* Two-Column Settings Layout (Linear / Figma / Notion Style) */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Column: Category Navigation */}
        <nav className="w-full md:w-64 shrink-0 space-y-1.5">
          <SettingsNavButton
            active={activeTab === "account"}
            onClick={() => setActiveTab("account")}
            icon={<User size={17} />}
            label="Account Profile"
          />
          <SettingsNavButton
            active={activeTab === "engine"}
            onClick={() => setActiveTab("engine")}
            icon={<Sliders size={17} />}
            label="Optimization Engine"
          />
          <SettingsNavButton
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
            icon={<ShieldCheck size={17} />}
            label="Security & Audit"
          />
        </nav>

        {/* Right Column: Active Settings Content */}
        <div className="flex-1 w-full rounded-xl border border-slate-200 bg-white p-6 sm:p-7 space-y-6 shadow-xs">
          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Account Profile
                </h2>
                <p className="text-sm text-slate-500 mt-1 font-normal">
                  Personal engineer identity across regression audit runs.
                </p>
              </div>

              <div className="divide-y divide-slate-100 text-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-2">
                  <div>
                    <span className="font-medium text-slate-800 block text-sm sm:text-base">Engineer Name</span>
                    <span className="text-xs sm:text-sm text-slate-500 font-normal">Display name for optimization logs</span>
                  </div>
                  <span className="font-mono text-sm text-slate-900 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-md">
                    {user?.name || "Senior QA Automation Engineer"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 gap-2">
                  <div>
                    <span className="font-medium text-slate-800 block text-sm sm:text-base">Email Address</span>
                    <span className="text-xs sm:text-sm text-slate-500 font-normal">Primary authentication identifier</span>
                  </div>
                  <span className="font-mono text-sm text-indigo-700 bg-indigo-50 border border-indigo-200 px-3.5 py-2 rounded-md font-semibold">
                    {user?.email || "engineer@team.internal"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 gap-2">
                  <div>
                    <span className="font-medium text-slate-800 block text-sm sm:text-base">Authentication Status</span>
                    <span className="text-xs sm:text-sm text-slate-500 font-normal">Active session token state</span>
                  </div>
                  <span className="font-mono text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md font-semibold">
                    Active Session
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "engine" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Optimization Engine Constraints
                </h2>
                <p className="text-sm text-slate-500 mt-1 font-normal">
                  Parameters governing test selection and knapsack 0/1 calculation.
                </p>
              </div>

              <div className="divide-y divide-slate-100 text-sm space-y-4">
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="font-medium text-slate-800 block text-sm sm:text-base">0/1 Knapsack Dynamic Solver</span>
                    <span className="text-xs sm:text-sm text-slate-500 font-normal">Guaranteed mathematical optimality and exact reproducibility</span>
                  </div>
                  <span className="font-mono text-sm text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-md font-semibold">
                    Deterministic Mode
                  </span>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="font-medium text-slate-800 block text-sm sm:text-base">Failure Penalty Multiplier</span>
                    <span className="text-xs sm:text-sm text-slate-500 font-normal">Weights test cases with higher historical defect counts</span>
                  </div>
                  <span className="font-mono text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md font-semibold">
                    1.5x Weight Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Security & Audit Retention
                </h2>
                <p className="text-sm text-slate-500 mt-1 font-normal">
                  Audit storage policy and execution logging settings.
                </p>
              </div>

              <div className="divide-y divide-slate-100 text-sm space-y-4">
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="font-medium text-slate-800 block text-sm sm:text-base">Audit Run Retention</span>
                    <span className="text-xs sm:text-sm text-slate-500 font-normal">Persists selection breakdown and rationale for all runs</span>
                  </div>
                  <span className="font-mono text-sm text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md font-medium">
                    Permanent Retention
                  </span>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="font-medium text-slate-800 block text-sm sm:text-base">Session Security</span>
                    <span className="text-xs sm:text-sm text-slate-500 font-normal">HttpOnly cookie authentication with CSRF protection</span>
                  </div>
                  <span className="font-mono text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md font-semibold">
                    Enforced
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsNavButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm sm:text-[15px] font-medium transition text-left ${
        active
          ? "bg-slate-100 text-slate-900 font-semibold shadow-2xs"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default Settings;