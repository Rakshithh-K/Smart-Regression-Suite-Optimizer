import pandas as pd

from src.data_loader import load_test_cases
from src.ai_matcher import calculate_relevance_scores
from src.prioritizer import prioritize_tests
from src.optimizer import optimize_regression_suite
from src.coverage_analyzer import analyze_coverage


def run_pipeline(
    csv_path: str,
    change_description: str,
    time_budget: int,
) -> tuple[pd.DataFrame, dict]:
    """
    Run the complete regression optimization pipeline.
    """

    # 1. Load and validate test cases
    df = load_test_cases(csv_path)

    # 2. Calculate relevance scores
    relevance_scores = calculate_relevance_scores(
        df,
        change_description,
    )

    # 3. Calculate deterministic priority scores
    prioritized_df = prioritize_tests(
        df,
        relevance_scores,
    )

    # 4. Select the best regression suite
    selected_tests = optimize_regression_suite(
        prioritized_df,
        time_budget,
    )

    # 5. Analyze coverage of selected tests
    coverage = analyze_coverage(selected_tests)

    return selected_tests, coverage