import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ||  "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;

export const optimizeRegressionSuite = async (
  file,
  changeDescription,
  timeBudget
) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("change_description", changeDescription);
  formData.append("time_budget", timeBudget);

  const response = await api.post(
    "/api/optimize",
    formData
  );

  return response.data;
};

export const getGitProject = async () => {
  const response = await api.get("/api/git-impact/project");
  return response.data;
};

export const setupGitProject = async (formData) => {
  const response = await api.post("/api/git-impact/setup", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getGitRuns = async () => {
  const response = await api.get("/api/git-impact/runs");
  return response.data;
};

export const getGitRun = async (runId) => {
  const response = await api.get(`/api/git-impact/runs/${runId}`);
  return response.data;
};

export const deleteGitRun = async (runId) => {
  const response = await api.delete(`/api/git-impact/runs/${runId}`);
  return response.data;
};