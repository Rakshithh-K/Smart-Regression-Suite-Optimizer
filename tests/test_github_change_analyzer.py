from src.github_change_analyzer import (
    analyze_github_change,
)


def test_mock_github_change_analysis(monkeypatch):

    monkeypatch.setenv(
        "AI_PROVIDER",
        "mock",
    )

    result = analyze_github_change(
        commit_message="Fix UPI payment timeout handling",
        changed_files=[
            {
                "filename": "src/payment/upi_service.py",
                "status": "modified",
                "additions": 10,
                "deletions": 3,
                "patch": "@@ payment timeout retry",
            }
        ],
    )

    assert "summary" in result
    assert result["module"] == "Payment"
    assert "upi" in result["features"]
    assert "timeout" in result["features"]
    assert "modified" in result["change_type"]


def test_empty_commit_message():

    try:
        analyze_github_change(
            "",
            [
                {
                    "filename": "src/payment/service.py",
                    "status": "modified",
                }
            ],
        )
        assert False
    except ValueError as error:
        assert str(error) == "Commit message cannot be empty."


def test_empty_changed_files():

    try:
        analyze_github_change(
            "Fix payment timeout",
            [],
        )
        assert False
    except ValueError as error:
        assert str(error) == "Changed files cannot be empty."