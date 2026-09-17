import pandas as pd

from src.data_loader import load_test_cases
from src.ai_matcher import calculate_relevance_scores
from src.prioritizer import prioritize_tests
from src.optimizer import optimize_regression_suite
from src.coverage_analyzer import analyze_coverage
from src.recommender import generate_recommendation
from src.exclusion_analyzer import analyze_exclusions


def run_pipeline(
    csv_path: str,
    change_description: str,
    time_budget: int,
) -> tuple[pd.DataFrame, list[dict], dict, dict]:
    """
    Run the complete regression optimization pipeline.
    """

    df = load_test_cases(csv_path)

    relevance_scores = calculate_relevance_scores(
        df,
        change_description,
    )

    prioritized_df = prioritize_tests(
        df,
        relevance_scores,
    )

    selected_tests = optimize_regression_suite(
        prioritized_df,
        time_budget,
    )

    exclusions = analyze_exclusions(
        prioritized_df,
        selected_tests,
    )

    coverage = analyze_coverage(
        selected_tests
    )

    recommendation = generate_recommendation(
        selected_tests,
        coverage,
        time_budget,
    )

    return (
        selected_tests,
        exclusions,
        coverage,
        recommendation,
    )