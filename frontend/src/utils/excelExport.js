import * as XLSX from "xlsx";

/**
 * Exports selected regression tests to an Excel (.xlsx) file and triggers browser download.
 *
 * @param {Array} tests - Array of test case objects
 * @param {Object} options - Configuration options
 * @param {string} [options.filename] - Custom filename for the .xlsx file
 * @param {Object} [options.aiExplanations] - Explanations object containing selected_reasons
 * @param {string|number} [options.runIdentifier] - Optional run number or identifier
 */
export function downloadSelectedTestsExcel(tests = [], options = {}) {
  if (!tests || !Array.isArray(tests) || tests.length === 0) {
    console.warn("No selected tests available to export.");
    return false;
  }

  const {
    filename,
    aiExplanations = {},
    runIdentifier,
  } = options;

  const reasons = aiExplanations?.selected_reasons || {};

  // Headers: standard regression test columns + optimization payoff insights
  const headers = [
    "test_id",
    "module",
    "description",
    "priority",
    "duration",
    "tags",
    "historical_failure_count",
    "relevance_score",
    "priority_score",
    "selected_reason",
  ];

  const rows = tests.map((test) => {
    const scoreVal =
      test.priority_score != null && !isNaN(test.priority_score)
        ? Number(Number(test.priority_score).toFixed(2))
        : test.score != null && !isNaN(test.score)
          ? Number(Number(test.score).toFixed(2))
          : "";

    let priorityVal = test.priority;
    if (!priorityVal) {
      const numScore = Number(scoreVal || 0);
      if (numScore >= 70) priorityVal = "High";
      else if (numScore >= 40) priorityVal = "Medium";
      else priorityVal = "Low";
    }

    const descriptionVal =
      test.description || (test.test_id ? `Regression test for ${test.module || test.test_id}` : "Regression test");

    const tagsVal = Array.isArray(test.tags)
      ? test.tags.join(", ")
      : (test.tags || (test.module ? String(test.module).toLowerCase() : "regression"));

    const relevanceVal =
      test.relevance_score != null && !isNaN(test.relevance_score)
        ? Number(Number(test.relevance_score).toFixed(2))
        : "";

    const failuresVal =
      test.historical_failure_count != null && !isNaN(test.historical_failure_count)
        ? Number(test.historical_failure_count)
        : 0;

    const reason =
      reasons[test.test_id] ||
      test.selection_rationale ||
      test.reason ||
      `Selected for regression suite with priority score ${scoreVal || "N/A"} and execution duration ${test.duration || 0}m.`;

    return [
      test.test_id ?? "",
      test.module ?? "",
      descriptionVal,
      priorityVal,
      test.duration != null && !isNaN(test.duration) ? Number(test.duration) : (test.duration ?? ""),
      tagsVal,
      failuresVal,
      relevanceVal,
      scoreVal,
      reason,
    ];
  });


  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Format column widths for readability
  worksheet["!cols"] = [
    { wch: 14 }, // test_id
    { wch: 18 }, // module
    { wch: 40 }, // description
    { wch: 12 }, // priority
    { wch: 14 }, // duration
    { wch: 20 }, // tags
    { wch: 24 }, // historical_failure_count
    { wch: 16 }, // relevance_score
    { wch: 16 }, // priority_score
    { wch: 55 }, // selection_rationale
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Selected_Tests");

  let defaultName = "selected_regression_suite.xlsx";
  if (runIdentifier) {
    defaultName = `selected_tests_run_${runIdentifier}.xlsx`;
  }

  const outputName = filename || defaultName;
  const finalFilename = outputName.endsWith(".xlsx") ? outputName : `${outputName}.xlsx`;

  XLSX.writeFile(workbook, finalFilename);
  return true;
}
