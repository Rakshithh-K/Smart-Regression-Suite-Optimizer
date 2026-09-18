import { User, Sliders, ShieldCheck, Database, CheckCircle, Cpu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-5 py-6 sm:px-8 sm:py-8 lg:px-10 space-y-8">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System & Workspace Settings
        </h1>
        <p className="mt-1 text-base text-slate-600">
          Manage QA engineer account credentials, optimization solver parameters, and algorithm thresholds.
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Profile Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4.5 sm:px-8 flex items-center gap-2.5">
            <User size={20} className="text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">QA Engineer Profile</h2>
          </div>

          <div className="p-6 sm:p-8 divide-y divide-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 gap-2">
              <div>
                <span className="text-sm font-semibold text-slate-800">Engineer Name</span>
                <p className="text-xs text-slate-500">Display name across audit and history runs</p>
              </div>
              <span className="text-base font-bold text-slate-900 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200">
                {user?.name || "Senior QA Automation Engineer"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 pb-2 gap-2">
              <div>
                <span className="text-sm font-semibold text-slate-800">Email Address</span>
                <p className="text-xs text-slate-500">Primary authentication identifier</p>
              </div>
              <span className="text-base font-bold text-slate-900 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200 font-mono text-sm">
                {user?.email || "engineer@team.internal"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 pb-2 gap-2">
              <div>
                <span className="text-sm font-semibold text-slate-800">Authentication Session</span>
                <p className="text-xs text-slate-500">Security cookie state</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <CheckCircle size={14} /> Active Authenticated Session
              </span>
            </div>
          </div>
        </div>

        {/* Algorithm & Optimizer Defaults Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4.5 sm:px-8 flex items-center gap-2.5">
            <Sliders size={20} className="text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Optimization Engine Constraints</h2>
          </div>

          <div className="p-6 sm:p-8 divide-y divide-slate-100 space-y-4">
            <SettingsItem
              icon={<Cpu size={20} className="text-indigo-600" />}
              title="Deterministic Knapsack 0/1 Solver"
              description="Applies dynamic programming formulation for guaranteed mathematical optimality and exact reproducibility."
              badge="Deterministic Mode"
              badgeColor="text-indigo-700 bg-indigo-50 border-indigo-200"
            />

            <SettingsItem
              icon={<ShieldCheck size={20} className="text-emerald-600" />}
              title="Historical Failure Penalty Multiplier"
              description="Weights test cases with higher historical failure counts to prioritize defect detection."
              badge="Active (1.5x Weight)"
              badgeColor="text-emerald-700 bg-emerald-50 border-emerald-200"
            />

            <SettingsItem
              icon={<Database size={20} className="text-amber-600" />}
              title="Audit Run Retention"
              description="Persists detailed selection breakdown, coverage metrics, and rationale for all completed optimization runs."
              badge="Permanent Retention"
              badgeColor="text-slate-700 bg-slate-100 border-slate-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsItem({ icon, title, description, badge, badgeColor }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3">
      <div className="flex items-start gap-3.5 max-w-2xl">
        <div className="mt-1 shrink-0">{icon}</div>
        <div>
          <h4 className="text-base font-bold text-slate-900">{title}</h4>
          <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <span className={`self-start sm:self-auto rounded-lg px-3.5 py-1.5 text-xs font-bold border ${badgeColor}`}>
        {badge}
      </span>
    </div>
  );
}

export default Settings;