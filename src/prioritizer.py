import pandas as pd


PRIORITY_SCORES = {
    "High": 100,
    "Medium": 60,
    "Low": 30,
}


def calculate_failure_score(
    failure_count: int,
    max_failure_count: int,
) -> float:
    """Convert historical failure count into a 0-100 score."""

    if max_failure_count <= 0:
        return 0.0

    return (failure_count / max_failure_count) * 100


def calculate_priority_score(
    relevance_score: float,
    priority: str,
    historical_failure_count: int,
    max_failure_count: int,
) -> float:
    """
    Calculate the deterministic priority score for one test case.

    Score:
        Relevance: 50%
        Business priority: 30%
        Historical failure: 20%
    """

    if not 0 <= relevance_score <= 100:
        raise ValueError("Relevance score must be between 0 and 100.")

    if priority not in PRIORITY_SCORES:
        raise ValueError(f"Invalid priority: {priority}")

    failure_score = calculate_failure_score(
        historical_failure_count,
        max_failure_count,
    )

    final_score = (
        relevance_score * 0.50
        + PRIORITY_SCORES[priority] * 0.30
        + failure_score * 0.20
    )

    return round(final_score, 2)


def prioritize_tests(
    df: pd.DataFrame,
    relevance_scores: dict[str, float],
) -> pd.DataFrame:
    """
    Add deterministic priority scores to the test-case DataFrame.

    relevance_scores maps test_id to an AI-generated relevance score.
    """

    missing_scores = set(df["test_id"]) - set(relevance_scores)

    if missing_scores:
        raise ValueError(
            f"Missing relevance scores for: {missing_scores}"
        )

    max_failure_count = df["historical_failure_count"].max()

    result = df.copy()

    result["relevance_score"] = result["test_id"].map(
        relevance_scores
    )

    result["priority_score"] = result.apply(
        lambda row: calculate_priority_score(
            relevance_score=row["relevance_score"],
            priority=row["priority"],
            historical_failure_count=row["historical_failure_count"],
            max_failure_count=max_failure_count,
        ),
        axis=1,
    )

    return result.sort_values(
        by="priority_score",
        ascending=False,
    ).reset_index(drop=True)