import pandas as pd

from src.risk_debt_analyzer import calculate_risk_debt


def test_no_excluded_tests():
    result = calculate_risk_debt(
        excluded_tests=[],
        all_tests=pd.DataFrame(),
    )

    assert result["has_debt"] is False
    assert result["high_risk_excluded"] == 0
    assert result["risk_debt_index"] == 0


def test_high_risk_excluded_tests_create_debt():
    all_tests = pd.DataFrame([
        {
            "test_id": "TC001",
            "module": "Payment",
            "priority": "High",
            "relevance_score": 90,
            "priority_score": 85,
            "duration": 10,
            "tags": "payment,upi",
        },
        {
            "test_id": "TC002",
            "module": "Payment",
            "priority": "High",
            "relevance_score": 80,
            "priority_score": 75,
            "duration": 14,
            "tags": "payment,timeout",
        },
    ])

    excluded_tests = [
        {
            "test_id": "TC002",
            "module": "Payment",
            "priority": "High",
            "relevance_score": 80,
            "priority_score": 75,
            "duration": 14,
            "tags": "payment,timeout",
        }
    ]

    result = calculate_risk_debt(
        excluded_tests=excluded_tests,
        all_tests=all_tests,
    )

    assert result["has_debt"] is True
    assert result["high_risk_excluded"] == 1
    assert result["deferred_time"] == 14
    assert result["additional_time_required"] == 14
    assert result["risk_debt_index"] == 46.9
    assert result["deferred_modules"] == ["Payment"]
    assert "payment" in result["deferred_tags"]
    assert "timeout" in result["deferred_tags"]


def test_low_risk_excluded_test_does_not_create_debt():
    all_tests = pd.DataFrame([
        {
            "test_id": "TC001",
            "module": "Search",
            "priority": "Low",
            "relevance_score": 90,
            "priority_score": 60,
            "duration": 10,
            "tags": "search,product",
        }
    ])

    excluded_tests = [
        {
            "test_id": "TC001",
            "module": "Search",
            "priority": "Low",
            "relevance_score": 90,
            "priority_score": 60,
            "duration": 10,
            "tags": "search,product",
        }
    ]

    result = calculate_risk_debt(
        excluded_tests=excluded_tests,
        all_tests=all_tests,
    )

    assert result["has_debt"] is False
    assert result["high_risk_excluded"] == 0
    assert result["risk_debt_index"] == 0