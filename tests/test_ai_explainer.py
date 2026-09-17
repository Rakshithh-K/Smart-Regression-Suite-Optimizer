import pandas as pd

from src.ai_explainer import generate_ai_explanations


def test_generate_ai_explanations():

    selected_tests = pd.DataFrame([
        {
            "test_id": "TC014",
            "module": "Payment",
            "description": "Verify failed UPI payment",
            "priority": "High",
            "duration": 7,
            "historical_failure_count": 12,
            "relevance_score": 100,
            "priority_score": 100,
        }
    ])

    excluded_tests = [
        {
            "test_id": "TC015",
            "module": "Payment",
            "priority": "High",
            "duration": 15,
            "historical_failure_count": 9,
            "reason": "Excluded due to time-budget trade-off.",
        }
    ]

    result = generate_ai_explanations(
        selected_tests,
        excluded_tests,
        "payment UPI failure",
        30,
    )

    assert isinstance(result, dict)

    assert "selected_reasons" in result
    assert "excluded_reasons" in result
    assert "overall_tradeoff" in result

    assert "TC014" in result["selected_reasons"]
    assert "TC015" in result["excluded_reasons"]