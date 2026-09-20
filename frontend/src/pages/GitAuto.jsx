import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";

import {
  getGitProject,
  getGitRuns,
  getGitRun,
} from "../api";

import GitAutoHeader from "../components/git-auto/GitAutoHeader";
import GitAutoSetup from "../components/git-auto/GitAutoSetup";
import LatestGitRunCard from "../components/git-auto/LatestGitRunCard";
import GitAutoHistoryTable from "../components/git-auto/GitAutoHistoryTable";
import GitRunDetails from "../components/git-auto/GitRunDetails";

function GitAuto() {
  const { runId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [runs, setRuns] = useState([]);
  const [latestRunDetail, setLatestRunDetail] = useState(null);
  const [selectedRunData, setSelectedRunData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [runsLoading, setRunsLoading] = useState(false);
  const [runDetailLoading, setRunDetailLoading] = useState(false);

  const [error, setError] = useState("");
  const [isEditingConfig, setIsEditingConfig] = useState(false);

  // Load Git Auto runs
  const loadRuns = useCallback(async () => {
    try {
      setRunsLoading(true);
      const runsData = await getGitRuns();
      const list = Array.isArray(runsData) ? runsData : [];
      setRuns(list);

      if (list.length > 0) {
        try {
          const detail = await getGitRun(list[0].id);
          setLatestRunDetail(detail);
        } catch (detailErr) {
          console.warn("Could not load latest run detail:", detailErr);
        }
      }
    } catch (err) {
      console.error("Failed to load Git Auto runs:", err);
    } finally {
      setRunsLoading(false);
    }
  }, []);

  // Load project configuration
  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const projData = await getGitProject();
      setProject(projData);

      if (projData?.configured) {
        await loadRuns();
      }
    } catch (err) {
      console.error("Failed to load Git Auto project:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to verify Git Auto project configuration. Please verify your connection."
      );
    } finally {
      setLoading(false);
    }
  }, [loadRuns]);

  // Load specific run details
  const loadRunDetail = useCallback(async (id) => {
    try {
      setRunDetailLoading(true);
      setError("");
      const detail = await getGitRun(id);
      setSelectedRunData(detail);
    } catch (err) {
      console.error("Failed to load Git Auto run details:", err);
      setError(
        err.response?.data?.detail ||
          `Unable to load details for run #${id}. Please try again.`
      );
    } finally {
      setRunDetailLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      if (isMounted) {
        await loadProject();
      }
    };
    fetchInitial();
    return () => {
      isMounted = false;
    };
  }, [loadProject]);

  // Handle URL param :runId
  useEffect(() => {
    let isMounted = true;
    if (runId) {
      const fetchDetail = async () => {
        if (isMounted) {
          await loadRunDetail(runId);
        }
      };
      fetchDetail();
    } else {
      setSelectedRunData(null);
    }
    return () => {
      isMounted = false;
    };
  }, [runId, loadRunDetail]);

  const handleViewRun = (id) => {
    navigate(`/git-auto/runs/${id}`);
  };

  const handleBackToOverview = () => {
    setSelectedRunData(null);
    navigate("/git-auto");
  };

  const handleSetupSuccess = () => {
    setIsEditingConfig(false);
    loadProject();
  };

  // Full page initial loading state
  if (loading) {
    return (
      <div className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 size={24} className="animate-spin text-indigo-600" />
        <span className="text-sm font-semibold">Checking Git Auto project configuration...</span>
      </div>
    );
  }

  // If Git Auto is not configured yet, show setup screen
  if (!project?.configured || isEditingConfig) {
    return (
      <div className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        <GitAutoSetup
          project={project}
          onSetupSuccess={handleSetupSuccess}
          onCancel={project?.configured ? () => setIsEditingConfig(false) : null}
        />
      </div>
    );
  }

  // Detail View for a specific run
  if (runDetailLoading) {
    return (
      <div className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 size={24} className="animate-spin text-indigo-600" />
        <span className="text-sm font-semibold">Retrieving Git Auto run analysis...</span>
      </div>
    );
  }

  if (selectedRunData) {
    return (
      <div className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {error && (
          <div className="flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <GitRunDetails
          runData={selectedRunData}
          onBack={handleBackToOverview}
        />
      </div>
    );
  }

  // Main Git Auto Dashboard / Overview View
  const latestRun = runs.length > 0 ? runs[0] : null;

  return (
    <div className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8">
      {/* Git Auto Header */}
      <GitAutoHeader
        project={project}
        onEditConfig={() => setIsEditingConfig(true)}
      />

      {error && (
        <div className="flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          <AlertCircle size={18} className="shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Latest Git Run Card (shown when at least one run exists) */}
      {latestRun && (
        <section>
          <LatestGitRunCard
            run={latestRun}
            runDetail={latestRunDetail}
            onViewRun={handleViewRun}
          />
        </section>
      )}

      {/* Git Auto History Section */}
      <section>
        {runsLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs flex items-center justify-center gap-3 text-slate-500">
            <Loader2 size={20} className="animate-spin text-indigo-600" />
            <span className="text-sm font-semibold">Loading Git Auto runs...</span>
          </div>
        ) : (
          <GitAutoHistoryTable
            runs={runs}
            onViewRun={handleViewRun}
            onRefresh={loadRuns}
          />
        )}
      </section>
    </div>
  );
}

export default GitAuto;
