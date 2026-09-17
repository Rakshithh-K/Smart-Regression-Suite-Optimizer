import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export const optimizeRegressionSuite = async (
  file,
  changeDescription,
  timeBudget
) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("change_description", changeDescription);
  formData.append("time_budget", timeBudget);

  const response = await axios.post(
    `${API_BASE_URL}/api/optimize`,
    formData
  );

  return response.data;
};