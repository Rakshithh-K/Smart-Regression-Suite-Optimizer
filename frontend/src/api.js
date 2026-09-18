import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

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