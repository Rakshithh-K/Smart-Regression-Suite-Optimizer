import {
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  FileText,
  Info,
} from "lucide-react";
import { downloadExcelTemplate } from "../utils/excelTemplate";

function InputFormat() {
  const handleDownload = () => {
    downloadExcelTemplate();
  };

  const columnsData = [
    {
      column: "test_id",
      required: "Yes",
      format: "Text",
      example: "TC001",
      description: "Unique identifier for the test case.",
    },
    {
      column: "module",
      required: "Yes",
      format: "Text",
      example: "Authentication",
      description: "Application module being tested.",
    },
    {
      column: "description",
      required: "Yes",
      format: "Text",
      example: "Verify login with valid credentials",
      description: "Description of what the test case validates.",
    },
    {
      column: "priority",
      required: "Yes",
      format: "High / Medium / Low",
      example: "High",
      description: "Business/testing priority of the test.",
    },
    {
      column: "duration",
      required: "Yes",
      format: "Number",
      example: "5",
      description: "Expected execution time of the test in minutes.",
    },
    {
      column: "tags",
      required: "Yes",
      format: "Comma-separated text",
      example: "authentication,login,success",
      description: "Keywords used to match the change description with relevant tests.",
    },
    {
      column: "historical_failure_count",
      required: "Yes",
      format: "Non-negative number",
      example: "4",
      description: "Number of times the test has historically failed.",
    },
  ];

  const exampleRows = [
    {
      test_id: "TC001",
      module: "Authentication",
      description: "Verify login with valid credentials",
      priority: "High",
      duration: 5,
      tags: "authentication,login,success",
      historical_failure_count: 4,
    },
    {
      test_id: "TC002",
      module: "Authentication",
      description: "Verify login with invalid password",
      priority: "High",
      duration: 6,
      tags: "authentication,login,failure",
      historical_failure_count: 7,
    },
    {
      test_id: "TC013",
      module: "Payment",
      description: "Verify successful UPI payment",
      priority: "High",
      duration: 8,
      tags: "payment,upi,success",
      historical_failure_count: 10,
    },
    {
      test_id: "TC014",
      module: "Payment",
      description: "Verify failed UPI payment",
      priority: "High",
      duration: 7,
      tags: "payment,upi,failure",
      historical_failure_count: 12,
    },
  ];

  const inputRules = [
    {
      field: "test_id",
      rule: "Must be unique across all test cases in the catalog.",
    },
    {
      field: "module",
      rule: "Should identify the functional application area (e.g. Authentication, Payment, Orders).",
    },
    {
      field: "description",
      rule: "Should clearly describe what functionality the test case validates.",
    },
    {
      field: "priority",
      rule: "Must be High, Medium, or Low (case-insensitive in evaluation).",
    },
    {
      field: "duration",
      rule: "Represents execution time in minutes and must be a positive number greater than 0.",
    },
    {
      field: "tags",
      rule: "Should contain comma-separated keywords matched against change diffs.",
    },
    {
      field: "historical_failure_count",
      rule: "Must be a non-negative number (0 or greater). Higher counts signal greater risk.",
    },
  ];

  return (
    <div className="w-full max-w-[1450px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600 block mb-1.5 font-mono">
            Catalog Specification
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            Input Format
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Prepare your regression test cases using the supported format below.
          </p>
        </div>

        {/* Format Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono shadow-xs">
            <span className="text-slate-500">Supported upload: </span>
            <strong className="text-indigo-700">CSV (.csv)</strong>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono shadow-xs">
            <span className="text-slate-500">Template: </span>
            <strong className="text-emerald-700">Excel (.xlsx)</strong>
          </div>
        </div>
      </div>

      {/* Download Template Banner Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <FileSpreadsheet size={22} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Regression Test Catalog Excel Template
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            Download our standardized Excel spreadsheet pre-configured with all required column headers and sample data.
            Use the Excel template to prepare your data, then export or save it as <strong className="text-slate-900 font-semibold">CSV</strong> before uploading to the optimizer.
          </p>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-lg bg-indigo-600 px-6 py-3 h-[50px] text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700 active:scale-[0.99] tracking-wide cursor-pointer"
          >
            <Download size={18} />
            <span>Download Excel Template</span>
          </button>
        </div>
      </div>

      {/* Accepted Columns Table Section */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="px-6 py-5 bg-slate-50/60 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Accepted Columns
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-normal">
              Field definitions, requirements, and data formats for the test catalog dataset.
            </p>
          </div>
          <span className="text-xs sm:text-sm font-mono text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-md self-start sm:self-auto">
            7 Required Columns
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-mono uppercase tracking-wider text-xs sm:text-sm">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Column</th>
                <th className="py-3.5 px-4 font-semibold">Required</th>
                <th className="py-3.5 px-4 font-semibold">Format</th>
                <th className="py-3.5 px-4 font-semibold">Example</th>
                <th className="py-3.5 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {columnsData.map((col) => (
                <tr key={col.column} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-semibold text-indigo-700 text-sm sm:text-base">
                    {col.column}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                      <CheckCircle2 size={12} />
                      {col.required}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs sm:text-sm text-slate-700">
                    {col.format}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs sm:text-sm text-slate-900">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {col.example}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-normal text-sm leading-relaxed max-w-md">
                    {col.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Example Input Section */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="px-6 py-5 bg-slate-50/60 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Example Input
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-normal">
              Realistic test catalog sample with multiple functional modules and risk profiles.
            </p>
          </div>
          <span className="text-xs sm:text-sm font-mono text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-md self-start sm:self-auto">
            Sample Data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-mono uppercase tracking-wider text-xs sm:text-sm">
              <tr>
                <th className="py-3 px-4 font-semibold">test_id</th>
                <th className="py-3 px-4 font-semibold">module</th>
                <th className="py-3 px-4 font-semibold">description</th>
                <th className="py-3 px-4 font-semibold">priority</th>
                <th className="py-3 px-4 font-semibold text-right">duration</th>
                <th className="py-3 px-4 font-semibold">tags</th>
                <th className="py-3 px-4 font-semibold text-right">historical_failure_count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs sm:text-sm">
              {exampleRows.map((row) => (
                <tr key={row.test_id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-semibold text-indigo-700">
                    {row.test_id}
                  </td>
                  <td className="py-3.5 px-4 text-slate-900">
                    <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                      {row.module}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-800 font-medium max-w-xs truncate">
                    {row.description}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className="rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border text-rose-700 bg-rose-50 border-rose-200">
                      {row.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-700">
                    {row.duration}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    {row.tags}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    {row.historical_failure_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Input Rules & Technical Guidance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Rules */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Input Rules
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-normal">
              Validation constraints enforced by the knapsack optimization engine.
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            {inputRules.map((rule) => (
              <div key={rule.field} className="py-3 flex items-start gap-3">
                <span className="font-mono text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded shrink-0">
                  {rule.field}
                </span>
                <span className="text-slate-700 font-normal leading-relaxed">
                  {rule.rule}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* File Format Guidance */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                File Format Specifications
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-normal">
                Supported formats and best practices for catalog uploads.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <FileText size={16} className="text-indigo-600" />
                  <span>Supported Upload Format: CSV (.csv)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  The optimizer API specifically consumes standard Comma-Separated Values (CSV) files. Ensure your export uses standard comma delimiters and UTF-8 encoding.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <FileSpreadsheet size={16} className="text-emerald-600" />
                  <span>Excel Template: XLSX (.xlsx)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Use the Excel template to prepare, edit, and review your regression test matrix with your team. Before optimizing, select <strong className="text-slate-900">File &gt; Save As &gt; CSV (Comma delimited)</strong> in Excel.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 bg-slate-50 border border-slate-200/80 px-4 py-3 rounded-lg">
            <Info size={16} className="text-slate-400 shrink-0" />
            <span>
              Tip: Ensure all column headers match the exact casing shown above (e.g. <code className="font-mono text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded">historical_failure_count</code>).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputFormat;
