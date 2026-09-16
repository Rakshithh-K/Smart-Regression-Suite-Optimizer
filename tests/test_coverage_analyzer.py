import pandas as pd
import pytest

from src.coverage_analyzer import analyze_coverage


def test_coverage_analysis():

    df = pd.DataFrame(
        {
            "test_id": ["TC001", "TC002", "TC003"],
            "module": [
                "Payment",
                "Payment",
                "Authentication",
            ],
            "tags": [
                "payment,upi,success",
                "payment,upi,failure",
                "authentication,login",
            ],
        }
    )

    result = analyze_coverage(df)

    assert result["total_selected_tests"] == 3

    assert result["module_coverage"]["Payment"] == 2

    assert result["module_coverage"]["Authentication"] == 1

    assert result["tag_coverage"]["payment"] == 2

    assert result["tag_coverage"]["upi"] == 2

    assert result["tag_coverage"]["authentication"] == 1


def test_empty_dataframe_is_rejected():

    df = pd.DataFrame(
        columns=["test_id", "module", "tags"]
    )

    with pytest.raises(ValueError):

        analyze_coverage(df)