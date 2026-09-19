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
        "Payment": {
            "total_tests": 3,
            "selected_tests": 2,
            "coverage_percentage": 66.67,
            "status": "Partially Covered",
        },
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
        "Authentication": {
            "total_tests": 1,
            "selected_tests": 1,
            "coverage_percentage": 100.0,
            "status": "Fully Covered",
        },
    }
}

    with pytest.raises(ValueError):

        generate_recommendation(
            selected_tests,
            coverage,
            0,
        )