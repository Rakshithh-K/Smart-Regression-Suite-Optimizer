import pandas as pd

from src.pipeline import run_pipeline


def test_pipeline_returns_selected_tests():

    result, exclusions, summary, coverage, recommendation, ai_explanations = (
        run_pipeline(
            "data/test_cases.csv",
            "payment UPI failure",
            time_budget=30,
        )
    )

    # Recommendation checks
    assert isinstance(recommendation, dict)
    assert recommendation["time_budget"] == 30

    # Exclusion checks
    assert isinstance(exclusions, list)

    # Summary checks
    assert isinstance(summary, dict)

    assert summary["total_tests"] == 20

    assert summary["selected_count"] == len(result)

    assert summary["excluded_high_risk_count"] == len(exclusions)

    assert (
        summary["selected_count"]
        + summary["excluded_high_risk_count"]
        + summary["other_excluded_count"]
        == summary["total_tests"]
    )

    # Coverage checks
    assert isinstance(coverage, dict)

    assert coverage["total_selected_tests"] == len(result)

    assert "module_coverage" in coverage

    assert "tag_coverage" in coverage

    # AI explanation checks
    assert isinstance(ai_explanations, dict)

    assert "selected_reasons" in ai_explanations

    assert "excluded_reasons" in ai_explanations

    assert "overall_tradeoff" in ai_explanations

    # Selected test checks
    assert isinstance(result, pd.DataFrame)

    assert len(result) > 0

    assert "selected" in result.columns

    assert result["duration"].sum() <= 30