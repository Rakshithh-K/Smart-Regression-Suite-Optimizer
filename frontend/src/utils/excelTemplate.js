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

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set comfortable column widths
  worksheet["!cols"] = [
    { wch: 10}, // test_id
    { wch: 10 }, // module
    { wch: 10}, // description
    { wch: 10 }, // priority
    { wch: 10 }, // duration
    { wch: 10 }, // tags
    { wch: 20 }, // historical_failure_count
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Regression_Tests");

  XLSX.writeFile(workbook, "regression_test_catalog_template.xlsx");
}
