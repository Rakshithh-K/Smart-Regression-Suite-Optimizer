import pandas as pd
import pytest

from src.prioritizer import (
    calculate_failure_score,
    calculate_priority_score,
    prioritize_tests,
)


def test_calculate_failure_score():
    score = calculate_failure_score(10, 20)

    assert score == 50.0


def test_calculate_priority_score():
    score = calculate_priority_score(
        relevance_score=90,
        priority="High",
        historical_failure_count=10,
        max_failure_count=20,
    )

    assert score == 85.0


def test_prioritize_tests():
    df = pd.DataFrame(
        {
            "test_id": ["TC001", "TC002"],
            "priority": ["High", "Low"],
            "duration": [5, 5],
            "historical_failure_count": [10, 2],
        }
    )

    relevance_scores = {
        "TC001": 90,
        "TC002": 80,
    }

    result = prioritize_tests(df, relevance_scores)

    assert "relevance_score" in result.columns
    assert "priority_score" in result.columns
    assert result.iloc[0]["test_id"] == "TC001"


def test_invalid_relevance_score():
    with pytest.raises(ValueError):
        calculate_priority_score(
            relevance_score=120,
            priority="High",
            historical_failure_count=5,
            max_failure_count=10,
        )