import pandas as pd

from src.data_loader import load_test_cases
from src.prioritizer import prioritize_tests
from src.optimizer import optimize_regression_suite


def run_pipeline(
    csv_path: str,
    relevance_scores: dict[str, float],
    time_budget: int,
) -> pd.DataFrame:
    """
    Run the complete regression optimization pipeline.
    """

    # 1. Load and validate CSV
    df = load_test_cases(csv_path)

    # 2. Calculate priority scores
    prioritized_df = prioritize_tests(
        df,
        relevance_scores,
    )

    # 3. Select the best regression suite
    selected_tests = optimize_regression_suite(
        prioritized_df,
        time_budget,
    )

    return selected_tests