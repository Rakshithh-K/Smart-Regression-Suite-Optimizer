import pandas as pd

from src.data_loader import load_test_cases
from src.ai_matcher import calculate_relevance_scores
from src.prioritizer import prioritize_tests
from src.optimizer import optimize_regression_suite
from src.coverage_analyzer import analyze_coverage
from src.recommender import generate_recommendation
from src.exclusion_analyzer import analyze_exclusions
from src.ai_explainer import generate_ai_explanations
from src.risk_debt_analyzer import calculate_risk_debt


def run_pipeline(
    csv_path: str,
    change_description: str,
    time_budget: int,
) -> tuple[
    pd.DataFrame,
    list[dict],
    dict,
    dict,
    dict,
    dict,
    dict,
]:

    df = load_test_cases(csv_path)

    total_tests = len(df)

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

    summary = {
        "total_tests": total_tests,
        "selected_count": len(selected_tests),
        "excluded_high_risk_count": len(exclusions),
        "other_excluded_count": (
            total_tests
            - len(selected_tests)
            - len(exclusions)
        ),
    }

    coverage = analyze_coverage(
        selected_tests,
    )

    recommendation = generate_recommendation(
        selected_tests,
        coverage,
        time_budget,
    )

    ai_explanations = generate_ai_explanations(
        selected_tests,
        exclusions,
        change_description,
        time_budget,
    )
    risk_debt = calculate_risk_debt(
        excluded_tests=exclusions,
        #time_budget=time_budget,
        all_tests=prioritized_df,
    )

    return (
        selected_tests,
        exclusions,
        summary,
        coverage,
        recommendation,
        ai_explanations,
        risk_debt,
    )