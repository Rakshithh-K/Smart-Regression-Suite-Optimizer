from fastapi.testclient import TestClient
from unittest.mock import patch
from backend.api import app
from backend.session import get_current_user

client = TestClient(app)


def test_root():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["message"] == (
        "Smart Regression Suite Optimizer API is running"
    )


def test_health():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_optimize():
    mock_user = type(
        "MockUser",
        (),
        {"id": 1},
    )()

    with patch(
        "backend.api.get_current_user",
        return_value=mock_user,
    ):

        with open("data/test_cases.csv", "rb") as file:
            response = client.post(
                "/api/optimize",
                files={
                    "file": (
                        "test_cases.csv",
                        file,
                        "text/csv",
                    )
                },
                data={
                    "change_description": "payment UPI failure",
                    "time_budget": "30",
                },
            )

    assert response.status_code == 200

    data = response.json()

    assert "selected_tests" in data
    assert "excluded_high_risk_tests" in data
    assert "coverage" in data
    assert "recommendation" in data
    assert "ai_explanations" in data
    assert "risk_debt" in data

    assert "selected_reasons" in data["ai_explanations"]
    assert "excluded_reasons" in data["ai_explanations"]
    assert "overall_tradeoff" in data["ai_explanations"]
    assert "summary" in data

    assert "risk_debt_index" in data["risk_debt"]
    assert "high_risk_excluded" in data["risk_debt"]

    assert data["summary"]["total_tests"] == 20

    assert (
        data["summary"]["selected_count"]
        == len(data["selected_tests"])
    )

    assert len(data["selected_tests"]) > 0

    assert isinstance(
        data["excluded_high_risk_tests"],
        list,
    )

def test_optimize_without_file():
    response = client.post(
        "/api/optimize",
        data={
            "change_description": "payment UPI failure",
            "time_budget": "30",
        },
    )

    assert response.status_code == 422