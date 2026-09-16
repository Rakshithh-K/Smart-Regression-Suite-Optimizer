import pandas as pd
import pytest

from src.ai_matcher import calculate_relevance_scores


def test_relevance_scores_are_generated():

    df = pd.DataFrame(
        {
            "test_id": ["TC001", "TC002"],
            "module": ["Authentication", "Payment"],
            "description": [
                "Verify user login",
                "Verify UPI payment",
            ],
            "tags": [
                "authentication,login",
                "payment,upi",
            ],
        }
    )

    scores = calculate_relevance_scores(
        df,
        "payment UPI",
    )

    assert isinstance(scores, dict)

    assert set(scores.keys()) == {"TC001", "TC002"}

    assert scores["TC002"] > scores["TC001"]


def test_empty_change_description_is_rejected():

    df = pd.DataFrame(
        {
            "test_id": ["TC001"],
            "module": ["Authentication"],
            "description": ["Verify login"],
            "tags": ["authentication,login"],
        }
    )

    with pytest.raises(ValueError):

        calculate_relevance_scores(
            df,
            "",
        )