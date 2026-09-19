import * as XLSX from "xlsx";

/**
 * Generates and downloads a standardized .xlsx template for regression test cases.
 * Contains the exact columns expected by the Regression Suite Optimizer with realistic example data.
 */
export function downloadExcelTemplate() {
  const data = [
    [
      "test_id",
      "module",
      "description",
      "priority",
      "duration",
      "tags",
      "historical_failure_count"
    ]
  ];

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: [
      "test_id",
      "module",
      "description",
      "priority",
      "duration",
      "tags",
      "historical_failure_count",
    ],
  });

  // Set comfortable column widths
  worksheet["!cols"] = [
    { wch: 12 }, // test_id
    { wch: 18 }, // module
    { wch: 42 }, // description
    { wch: 12 }, // priority
    { wch: 12 }, // duration
    { wch: 34 }, // tags
    { wch: 26 }, // historical_failure_count
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Regression_Tests");

  XLSX.writeFile(workbook, "regression_test_catalog_template.xlsx");
}
