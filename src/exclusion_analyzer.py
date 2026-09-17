import pandas as pd


def analyze_exclusions(
    all_tests: pd.DataFrame,
    selected_tests: pd.DataFrame,
) -> list[dict]:
    """
    Identify high-risk tests that were excluded
    from the optimized regression suite.
    """

    selected_ids = set(selected_tests["test_id"])

    excluded_tests = all_tests[
        ~all_tests["test_id"].isin(selected_ids)
    ]

    high_risk_tests = excluded_tests[
        excluded_tests["priority"] == "High"
    ]

    results = []

    for _, row in high_risk_tests.iterrows():

        reason = (
            f"Excluded due to time-budget trade-off. "
            f"This High-priority test takes "
            f"{row['duration']} minutes and has "
            f"{row['historical_failure_count']} historical failures."
        )

        results.append({
            "test_id": row["test_id"],
            "module": row["module"],
            "priority": row["priority"],
            "duration": int(row["duration"]),
            "historical_failure_count": int(
                row["historical_failure_count"]
            ),
            "reason": reason,
        })

    return results  