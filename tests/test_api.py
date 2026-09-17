from fastapi.testclient import TestClient

from backend.api import app


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
    assert "coverage" in data
    assert "recommendation" in data

    assert len(data["selected_tests"]) > 0


def test_optimize_without_file():
    response = client.post(
        "/api/optimize",
        data={
            "change_description": "payment UPI failure",
            "time_budget": "30",
        },
    )

    assert response.status_code == 422