import pandas as pd
import pytest

from src.coverage_analyzer import analyze_coverage


def test_coverage_analysis():

    all_tests = pd.DataFrame(
        {
            "test_id": [
                "TC001",
                "TC002",
                "TC003",
                "TC004",
                "TC005",
            ],
            "module": [
                "Payment",
                "Payment",
                "Payment",
                "Authentication",
                "Cart",
            ],
            "description": [
                "Successful payment",
                "Failed payment",
                "Payment timeout",
                "Valid login",
                "Add product to cart",
            ],
            "priority": [
                "High",
                "High",
                "High",
                "High",
                "Medium",
            ],
            "duration": [8, 7, 15, 5, 5],
            "tags": [
                "payment,upi,success",
                "payment,upi,failure",
                "payment,upi,timeout",
                "authentication,login",
                "cart,add-product",
            ],
            "historical_failure_count": [10, 12, 9, 4, 4],
        }
    )

    selected_tests = all_tests.iloc[[0, 1, 3]]

    result = analyze_coverage(
        all_tests,
        selected_tests,
    )

    # Basic counts
    assert result["total_tests"] == 5
    assert result["total_selected_tests"] == 3
    assert result["total_uncovered_tests"] == 2

    # Payment: 2 selected out of 3
    payment = result["module_coverage"]["Payment"]

    assert payment["total_tests"] == 3
    assert payment["selected_tests"] == 2
    assert payment["coverage_percentage"] == 66.67
    assert payment["status"] == "Partially Covered"

    # Authentication: 1 selected out of 1
    authentication = result["module_coverage"]["Authentication"]

    assert authentication["total_tests"] == 1
    assert authentication["selected_tests"] == 1
    assert authentication["coverage_percentage"] == 100.0
    assert authentication["status"] == "Fully Covered"

    # Cart: 0 selected
    cart = result["module_coverage"]["Cart"]

    assert cart["total_tests"] == 1
    assert cart["selected_tests"] == 0
    assert cart["coverage_percentage"] == 0.0
    assert cart["status"] == "Not Covered"

    # Uncovered modules
    assert "Cart" in result["uncovered_modules"]

    # Uncovered tests
    uncovered_ids = {
        test["test_id"]
        for test in result["uncovered_tests"]
    }

    assert uncovered_ids == {"TC003", "TC005"}

    # High-risk uncovered test
    high_risk_ids = {
        test["test_id"]
        for test in result["high_risk_uncovered_tests"]
    }

    assert "TC003" in high_risk_ids

    # Existing tag coverage
    assert result["tag_coverage"]["payment"] == 2
    assert result["tag_coverage"]["upi"] == 2
    assert result["tag_coverage"]["authentication"] == 1


def test_empty_all_tests_is_rejected():

    all_tests = pd.DataFrame(
        columns=["test_id", "module", "tags"]
    )

    selected_tests = pd.DataFrame(
        columns=["test_id", "module", "tags"]
    )

    with pytest.raises(ValueError):

        analyze_coverage(
            all_tests,
            selected_tests,
        )


def test_empty_selected_tests_is_rejected():

    all_tests = pd.DataFrame(
        {
            "test_id": ["TC001"],
            "module": ["Payment"],
            "description": ["Payment test"],
            "priority": ["High"],
            "duration": [8],
            "tags": ["payment,upi"],
            "historical_failure_count": [5],
        }
    )

    selected_tests = pd.DataFrame(
        columns=all_tests.columns
    )

    with pytest.raises(ValueError):

        analyze_coverage(
            all_tests,
            selected_tests,
        )