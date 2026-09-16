import pandas as pd
import pytest

from src.optimizer import optimize_regression_suite


def test_optimizer_respects_time_budget():

    df = pd.DataFrame(
        {
            "test_id": ["TC001", "TC002", "TC003"],
            "duration": [5, 7, 10],
            "priority_score": [80, 90, 120],
        }
    )

    result = optimize_regression_suite(
        df,
        time_budget=15,
    )

    total_duration = result["duration"].sum()

    assert total_duration <= 15


def test_optimizer_selects_best_combination():

    df = pd.DataFrame(
        {
            "test_id": ["TC001", "TC002", "TC003"],
            "duration": [5, 7, 10],
            "priority_score": [80, 90, 120],
        }
    )

    result = optimize_regression_suite(
        df,
        time_budget=15,
    )

    assert set(result["test_id"]) == {"TC001", "TC003"}


def test_optimizer_rejects_invalid_budget():

    df = pd.DataFrame(
        {
            "test_id": ["TC001"],
            "duration": [5],
            "priority_score": [80],
        }
    )

    with pytest.raises(ValueError):

        optimize_regression_suite(
            df,
            time_budget=0,
        )