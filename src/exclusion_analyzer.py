import pandas as pd


RELEVANCE_THRESHOLD = 50


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
        (excluded_tests["priority"] == "High")
        & (
            excluded_tests["relevance_score"]
            >= RELEVANCE_THRESHOLD
        )
    ]

    results = []

    for _, row in high_risk_tests.iterrows():

        results.append({
            "test_id": row["test_id"],
            "module": row["module"],
            "priority": row["priority"],
            "duration": int(row["duration"]),
            "historical_failure_count": int(
                row["historical_failure_count"]
            ),
            "relevance_score": float(
                row["relevance_score"]
            ),
        })

    return results