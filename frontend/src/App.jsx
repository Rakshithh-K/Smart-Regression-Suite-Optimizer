import { useState } from "react";
import { optimizeRegressionSuite } from "./api";

function App() {
  const [file, setFile] = useState(null);
  const [changeDescription, setChangeDescription] = useState("");
  const [timeBudget, setTimeBudget] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleOptimize = async () => {
    setError("");
    setResult(null);

    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    if (!changeDescription.trim()) {
      setError("Please enter a change description.");
      return;
    }

    if (timeBudget <= 0) {
      setError("Time budget must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      const data = await optimizeRegressionSuite(
        file,
        changeDescription,
        timeBudget
      );

      setResult(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Something went wrong while optimizing the regression suite."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Smart Regression Suite Optimizer</h1>

      <p>
        Select the most valuable regression tests within your
        available execution-time budget.
      </p>

      <div>
        <label>Change Description</label>

        <textarea
          value={changeDescription}
          onChange={(event) =>
            setChangeDescription(event.target.value)
          }
          placeholder="Example: Payment UPI failure handling was changed"
          rows="4"
        />
      </div>

      <div>
        <label>Test Case CSV</label>

        <input
          type="file"
          accept=".csv"
          onChange={(event) =>
            setFile(event.target.files[0])
          }
        />
      </div>

      <div>
        <label>Time Budget (minutes)</label>

        <input
          type="number"
          min="1"
          value={timeBudget}
          onChange={(event) =>
            setTimeBudget(Number(event.target.value))
          }
        />
      </div>

      <button
        onClick={handleOptimize}
        disabled={loading}
      >
        {loading ? "Optimizing..." : "Optimize Regression Suite"}
      </button>

      {error && (
        <p>{error}</p>
      )}

      {result && (
        <div>
          <h2>Optimization Result</h2>

          <pre>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;