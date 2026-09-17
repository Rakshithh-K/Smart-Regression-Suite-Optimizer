import pandas as pd

from src.exclusion_analyzer import analyze_exclusions


def test_analyze_exclusions():

    all_tests = pd.DataFrame([
        {
            "test_id": "TC001",
            "module": "Payment",
            "priority": "High",
            "duration": 10,
            "historical_failure_count": 8,
            "relevance_score": 80,
        },
        {
            "test_id": "TC002",
            "module": "Login",
            "priority": "High",
            "duration": 15,
            "historical_failure_count": 10,
            "relevance_score": 70,
        },
        {
            "test_id": "TC003",
            "module": "Cart",
            "priority": "Low",
            "duration": 5,
            "historical_failure_count": 2,
            "relevance_score": 90,
        },
    ])

    selected_tests = all_tests.iloc[[0]]

    result = analyze_exclusions(
        all_tests,
        selected_tests,
    )

    assert len(result) == 1

    assert result[0]["test_id"] == "TC002"

    assert result[0]["priority"] == "High"

    assert result[0]["relevance_score"] == 70