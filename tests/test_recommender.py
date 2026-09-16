import pandas as pd
import pytest

from src.recommender import generate_recommendation


def test_generate_recommendation():

    selected_tests = pd.DataFrame(
        {
            "test_id": ["TC013", "TC014"],
            "duration": [8, 7],
        }
    )

    coverage = {
        "module_coverage": {
            "Payment": 2,
        },
        "tag_coverage": {
            "payment": 2,
            "upi": 2,
        },
    }

    result = generate_recommendation(
        selected_tests,
        coverage,
        20,
    )

    assert result["total_selected_tests"] == 2

    assert result["total_execution_time"] == 15

    assert result["time_budget"] == 20

    assert result["remaining_time"] == 5

    assert len(result["recommendations"]) > 0


def test_invalid_time_budget():

    selected_tests = pd.DataFrame(
        {
            "test_id": ["TC001"],
            "duration": [5],
        }
    )

    coverage = {
        "module_coverage": {
            "Authentication": 1,
        }
    }

    with pytest.raises(ValueError):

        generate_recommendation(
            selected_tests,
            coverage,
            0,
        )