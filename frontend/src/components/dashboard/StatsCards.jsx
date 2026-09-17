import {
  FileText,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 text-slate-400">
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

function StatsCards({ result }) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">
        Optimization Overview
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          icon={<FileText size={20} />}
          title="Total Tests"
          value={result.summary.total_tests}
        />

        <StatCard
          icon={<CheckCircle2 size={20} />}
          title="Selected Tests"
          value={result.summary.selected_count}
        />

        <StatCard
          icon={<Clock size={20} />}
          title="Execution Time"
          value={`${result.recommendation.total_execution_time} min`}
        />

        <StatCard
          icon={<ShieldAlert size={20} />}
          title="High-Risk Excluded"
          value={result.summary.excluded_high_risk_count}
        />

      </div>
    </div>
  );
}

export default StatsCards;