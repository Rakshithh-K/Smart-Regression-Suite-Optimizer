import pandas as pd


def calculate_risk_debt(
    excluded_tests,
    all_tests=None,
):
    """
    Calculate regression risk debt caused by relevant high-risk
    tests that were excluded from the regression suite.

    Risk Debt Index represents the percentage of the relevant
    high-risk priority score that remains unexecuted.

    This is an index, not a probability of failure.
    """

    if excluded_tests is None:
        excluded_tests = []

    if isinstance(excluded_tests, pd.DataFrame):
        excluded_df = excluded_tests.copy()
    else:
        excluded_df = pd.DataFrame(excluded_tests)

    # No excluded tests
    if excluded_df.empty:
        return {
            "has_debt": False,
            "high_risk_excluded": 0,
            "risk_debt_index": 0,
            "deferred_time": 0,
            "additional_time_required": 0,
            "deferred_modules": [],
            "deferred_tags": [],
        }

    # Only high-priority excluded tests contribute to risk debt.
    high_risk = excluded_df[
        excluded_df["priority"].astype(str).str.lower() == "high"
    ].copy()

    # No high-risk exclusions
    if high_risk.empty:
        return {
            "has_debt": False,
            "high_risk_excluded": 0,
            "risk_debt_index": 0,
            "deferred_time": 0,
            "additional_time_required": 0,
            "deferred_modules": [],
            "deferred_tags": [],
        }

    # Calculate the risk score of the deferred tests.
    #
    # The existing prioritizer already calculates priority_score,
    # so Risk Debt reuses that score instead of creating another
    # scoring formula.
    if (
        all_tests is not None
        and "priority_score" in all_tests.columns
    ):
        deferred_ids = set(high_risk["test_id"])

        deferred_risk = (
            all_tests[
                all_tests["test_id"].isin(deferred_ids)
            ]["priority_score"]
            .astype(float)
            .sum()
        )
    else:
        deferred_risk = 0

    # Calculate the total relevant high-risk risk pool.
    if (
        all_tests is not None
        and "priority_score" in all_tests.columns
        and "relevance_score" in all_tests.columns
    ):
        all_df = all_tests.copy()

        relevant_high_risk = all_df[
            (all_df["priority"].astype(str).str.lower() == "high")
            & (
                all_df["relevance_score"].astype(float)
                >= 50
            )
        ].copy()

        total_risk = (
            relevant_high_risk["priority_score"]
            .astype(float)
            .sum()
        )
    else:
        total_risk = deferred_risk

    # Risk Debt Index
    risk_debt_index = (
        deferred_risk / total_risk * 100
        if total_risk > 0
        else 0
    )

    # Total execution time required for deferred high-risk tests.
    deferred_time = int(
        pd.to_numeric(
            high_risk["duration"],
            errors="coerce"
        ).fillna(0).sum()
    )

    # Modules affected by deferred tests.
    modules = (
        high_risk["module"]
        .dropna()
        .astype(str)
        .unique()
        .tolist()
    )

    # Tags affected by deferred tests.
    tags = []

    if "tags" in high_risk.columns:
        for value in high_risk["tags"].dropna():
            tags.extend(
                tag.strip()
                for tag in str(value).split(",")
                if tag.strip()
            )

    return {
        "has_debt": True,
        "high_risk_excluded": len(high_risk),
        "risk_debt_index": round(risk_debt_index, 1),
        "deferred_time": deferred_time,
        "additional_time_required": deferred_time,
        "deferred_modules": modules,
        "deferred_tags": list(dict.fromkeys(tags)),
    }