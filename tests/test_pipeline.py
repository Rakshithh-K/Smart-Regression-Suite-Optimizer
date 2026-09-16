import pandas as pd

from src.pipeline import run_pipeline


def test_pipeline_returns_selected_tests():

    relevance_scores = {
        "TC001": 90,
        "TC002": 80,
        "TC003": 95,
        "TC004": 70,
        "TC005": 60,
        "TC006": 75,
        "TC007": 40,
        "TC008": 65,
        "TC009": 90,
        "TC010": 85,
        "TC011": 88,
        "TC012": 60,
        "TC013": 98,
        "TC014": 97,
        "TC015": 95,
        "TC016": 90,
        "TC017": 92,
        "TC018": 55,
        "TC019": 65,
        "TC020": 35,
    }

    result = run_pipeline(
        "data/test_cases.csv",
        relevance_scores,
        time_budget=30,
    )

    assert isinstance(result, pd.DataFrame)

    assert len(result) > 0

    assert "selected" in result.columns

    assert result["duration"].sum() <= 30