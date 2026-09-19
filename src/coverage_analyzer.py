import pandas as pd


def analyze_coverage(
    all_tests: pd.DataFrame,
    selected_tests: pd.DataFrame,
) -> dict:
    """
    Analyze module and tag coverage and identify coverage gaps.
    """

    if all_tests.empty:
        raise ValueError("No test cases are available.")

    if selected_tests.empty:
        raise ValueError("No tests were selected.")

    # -----------------------------
    # Module coverage
    # -----------------------------

    total_by_module = (
        all_tests["module"]
        .value_counts()
        .to_dict()
    )

    selected_by_module = (
        selected_tests["module"]
        .value_counts()
        .to_dict()
    )

    module_coverage = {}

    for module, total_count in total_by_module.items():
        selected_count = selected_by_module.get(module, 0)

        percentage = (
            selected_count / total_count
        ) * 100

        if selected_count == 0:
            status = "Not Covered"
        elif selected_count < total_count:
            status = "Partially Covered"
        else:
            status = "Fully Covered"

        module_coverage[module] = {
            "total_tests": total_count,
            "selected_tests": selected_count,
            "coverage_percentage": round(percentage, 2),
            "status": status,
        }

    # -----------------------------
    # Uncovered tests
    # -----------------------------

    selected_ids = set(selected_tests["test_id"])

    uncovered_tests = all_tests[
        ~all_tests["test_id"].isin(selected_ids)
    ]

    uncovered_test_details = uncovered_tests[
        [
            "test_id",
            "module",
            "description",
            "priority",
            "duration",
            "tags",
            "historical_failure_count",
        ]
    ].to_dict(orient="records")

    # -----------------------------
    # Uncovered modules
    # -----------------------------

    uncovered_modules = [
        module
        for module, data in module_coverage.items()
        if data["selected_tests"] == 0
    ]

    # -----------------------------
    # High-risk uncovered tests
    # -----------------------------

    high_risk_uncovered = uncovered_tests[
        uncovered_tests["priority"].str.lower() == "high"
    ]

    high_risk_uncovered_tests = high_risk_uncovered[
        [
            "test_id",
            "module",
            "description",
            "priority",
            "duration",
            "historical_failure_count",
        ]
    ].to_dict(orient="records")

    # -----------------------------
    # Tag coverage
    # -----------------------------

    tag_coverage = {}

    for tags in selected_tests["tags"]:
        for tag in str(tags).split(","):
            tag = tag.strip()

            if tag:
                tag_coverage[tag] = (
                    tag_coverage.get(tag, 0) + 1
                )

    return {
        "total_tests": len(all_tests),
        "total_selected_tests": len(selected_tests),
        "total_uncovered_tests": len(uncovered_tests),
        "module_coverage": module_coverage,
        "uncovered_modules": uncovered_modules,
        "uncovered_tests": uncovered_test_details,
        "high_risk_uncovered_tests": high_risk_uncovered_tests,
        "tag_coverage": tag_coverage,
    }