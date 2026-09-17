import pandas as pd

from src.pipeline import run_pipeline


def test_pipeline_returns_selected_tests():

    result, exclusions, coverage, recommendation = run_pipeline(
        "data/test_cases.csv",
        "payment UPI failure",
        time_budget=30,
    )

    assert isinstance(recommendation, dict)

    assert isinstance(exclusions, list)

    assert recommendation["total_selected_tests"] == len(result)

    assert recommendation["time_budget"] == 30

    assert isinstance(coverage, dict)

    assert coverage["total_selected_tests"] == len(result)

    assert "module_coverage" in coverage

    assert "tag_coverage" in coverage

    assert isinstance(result, pd.DataFrame)

    assert len(result) > 0

    assert "selected" in result.columns

    assert result["duration"].sum() <= 30