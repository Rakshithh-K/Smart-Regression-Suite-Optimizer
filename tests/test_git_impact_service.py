import pandas as pd

from src.git_impact_service import run_git_impact


def test_git_impact_runs_existing_pipeline(
    monkeypatch,
    tmp_path,
):
    monkeypatch.setenv(
        "AI_PROVIDER",
        "mock",
    )

    csv_file = tmp_path / "tests.csv"

    pd.DataFrame(
        [
            {
                "test_id": "TC001",
                "module": "Payment",
                "description": "Verify UPI payment timeout",
                "priority": "High",
                "duration": 5,
                "tags": "payment,upi,timeout",
                "historical_failure_count": 5,
            },
            {
                "test_id": "TC002",
                "module": "Cart",
                "description": "Verify adding product to cart",
                "priority": "Medium",
                "duration": 5,
                "tags": "cart,add-product",
                "historical_failure_count": 2,
            },
        ]
    ).to_csv(csv_file, index=False)

    result = run_git_impact(
        commit_message="Fix UPI payment timeout",
        changed_files=[
            {
                "filename": "src/payment/upi.py",
                "status": "modified",
                "patch": "timeout retry handling",
            }
        ],
        test_catalog_path=str(csv_file),
        time_budget=10,
    )

    assert "change" in result
    assert "selected_tests" in result
    assert "coverage" in result
    assert "risk_debt" in result

    assert result["change"]["module"] == "Payment"