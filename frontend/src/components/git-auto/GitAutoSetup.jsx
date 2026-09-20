import { useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Sliders,
} from "lucide-react";
import { setupGitProject } from "../../api";

function GitAutoSetup({ project, onSetupSuccess, onCancel }) {
  const isEditing = Boolean(project?.configured);

  const [repoOwner, setRepoOwner] = useState(
    project?.repository?.split("/")[0] || "Rakshithh-K"
  );
  const [repoName, setRepoName] = useState(
    project?.repository?.split("/")[1] || "Smart-Regression-Suite-Optimizer"
  );
  const [installationId, setInstallationId] = useState(
    project?.installation_id || ""
  );
  const [defaultBudget, setDefaultBudget] = useState(
    project?.default_budget || 30
  );
  const [catalogFile, setCatalogFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const name = selected.name.toLowerCase();
      if (!name.endsWith(".csv") && !name.endsWith(".xlsx")) {
        setError("Catalog must be a CSV or XLSX file.");
        return;
      }
      setError("");
      setCatalogFile(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!repoOwner.trim()) {
      setError("Please specify the GitHub repository owner.");
      return;
    }
    if (!repoName.trim()) {
      setError("Please specify the GitHub repository name.");
      return;
    }
    if (!installationId.trim()) {
      setError("Please enter the GitHub App installation ID.");
      return;
    }
    if (!defaultBudget || Number(defaultBudget) <= 0) {
      setError("Default budget must be greater than 0 minutes.");
      return;
    }
    if (!catalogFile) {
      setError("Please upload a test catalog file (.csv or .xlsx).");
      return;
    }

    const formData = new FormData();
    formData.append("repo_owner", repoOwner.trim());
    formData.append("repo_name", repoName.trim());
    formData.append("installation_id", installationId.trim());
    formData.append("default_budget", parseInt(defaultBudget, 10));
    formData.append("catalog", catalogFile);

    try {
      setLoading(true);
      const res = await setupGitProject(formData);
      setSuccess(res.message || "Git Auto configuration saved successfully.");
      setTimeout(() => {
        onSetupSuccess(res);
      }, 600);
    } catch (err) {
      console.error("Git Auto setup error:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to configure Git Auto project. Please check your inputs and catalog format."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">
      {isEditing && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Git Auto</span>
        </button>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 mb-1.5 text-slate-700">
            <Sliders size={20} className="text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Git Auto Configuration
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            Connect a GitHub repository to automatically analyze code changes and generate regression recommendations.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* GitHub Repository Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="repo-owner"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Repository Owner <span className="text-rose-500">*</span>
              </label>
              <input
                id="repo-owner"
                type="text"
                value={repoOwner}
                onChange={(e) => setRepoOwner(e.target.value)}
                placeholder="e.g. Rakshithh-K"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                required
              />
            </div>

            <div>
              <label
                htmlFor="repo-name"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Repository Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="repo-name"
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="e.g. Smart-Regression-Suite-Optimizer"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                required
              />
            </div>
          </div>

          {/* GitHub App Installation ID & Default Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="installation-id"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                GitHub Installation ID <span className="text-rose-500">*</span>
              </label>
              <input
                id="installation-id"
                type="text"
                value={installationId}
                onChange={(e) => setInstallationId(e.target.value)}
                placeholder="e.g. 12345678"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                required
              />
            </div>

            <div>
              <label
                htmlFor="default-budget"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Regression Budget (min) <span className="text-rose-500">*</span>
              </label>
              <input
                id="default-budget"
                type="number"
                min="1"
                max="1440"
                value={defaultBudget}
                onChange={(e) => setDefaultBudget(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                required
              />
            </div>
          </div>

          {/* Test Catalog File Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Test Catalog (.csv / .xlsx) <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/60 p-6 text-center transition">
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFileChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                  {catalogFile ? (
                    <FileSpreadsheet size={24} />
                  ) : (
                    <UploadCloud size={24} />
                  )}
                </div>
                {catalogFile ? (
                  <div>
                    <span className="font-semibold text-slate-900 text-sm block">
                      {catalogFile.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {(catalogFile.size / 1024).toFixed(1)} KB · Click to replace file
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-medium text-slate-800 block">
                      Drag & drop your test catalog here, or{" "}
                      <span className="text-indigo-600 font-semibold underline">browse</span>
                    </span>
                    <span className="text-xs text-slate-500 block mt-1">
                      Supports CSV and XLSX test suites with test_id, description, module, duration, priority.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            {isEditing && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GitAutoSetup;
