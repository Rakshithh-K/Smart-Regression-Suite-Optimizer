import json
import os

import pandas as pd

from src.ai_provider import get_ai_provider


def calculate_mock_relevance_scores(
    df: pd.DataFrame,
    change_description: str,
) -> dict[str, float]:
    """
    Generate deterministic relevance scores locally.

    This is used when AI_PROVIDER=mock.
    """

    change_words = set(
        change_description.lower().replace(",", " ").split()
    )

    scores = {}

    for _, row in df.iterrows():
        text = " ".join(
            [
                str(row["module"]),
                str(row["description"]),
                str(row["tags"]),
            ]
        ).lower()

        matches = sum(
            1
            for word in change_words
            if word in text
        )

        if matches >= 3:
            score = 100
        elif matches == 2:
            score = 75
        elif matches == 1:
            score = 50
        else:
            score = 0

        scores[row["test_id"]] = float(score)

    return scores


def calculate_relevance_scores(
    df: pd.DataFrame,
    change_description: str,
) -> dict[str, float]:

    if not change_description.strip():
        raise ValueError(
            "Change description cannot be empty."
        )

    provider = get_ai_provider()

    if provider == "mock":
        return calculate_mock_relevance_scores(
            df,
            change_description,
        )

    test_cases = []

    for _, row in df.iterrows():
        test_cases.append(
            {
                "test_id": row["test_id"],
                "module": row["module"],
                "description": row["description"],
                "tags": row["tags"],
            }
        )

    prompt = f"""
You are a software testing assistant.

A software change has been described as:

{change_description}

Below are regression test cases:

{json.dumps(test_cases, indent=2)}

For every test case, determine how relevant it is
to the described change.

Return ONLY valid JSON in this format:

{{
    "TC001": 0,
    "TC002": 75,
    "TC003": 100
}}

Rules:
- Score must be a number between 0 and 100.
- 0 means not relevant.
- 100 means extremely relevant.
- Consider the module, description, and tags.
- Return every test_id exactly once.
- Do not include explanations.
- Do not include test IDs that are not provided.
"""

    ai_provider = os.getenv(
        "AI_PROVIDER",
        "mock",
    ).lower()

    if ai_provider == "gemini":
        model = os.getenv(
            "GEMINI_MODEL",
            "gemini-3.8-flash",
        )
    else:
        model = "gpt-5.6-luna"

    response = provider.responses.create(
        model=model,
        input=prompt,
    )

    try:
        result = json.loads(
            response.output_text
        )
    except json.JSONDecodeError as exc:
        raise ValueError(
            "AI provider returned invalid JSON "
            "for relevance scoring."
        ) from exc

    expected_test_ids = {
        str(test_id)
        for test_id in df["test_id"]
    }

    returned_test_ids = {
        str(test_id)
        for test_id in result.keys()
    }

    missing_test_ids = (
        expected_test_ids - returned_test_ids
    )

    unexpected_test_ids = (
        returned_test_ids - expected_test_ids
    )

    if missing_test_ids:
        raise ValueError(
            "AI provider did not return scores for "
            f"these test cases: "
            f"{sorted(missing_test_ids)}"
        )

    if unexpected_test_ids:
        raise ValueError(
            "AI provider returned scores for "
            f"unknown test cases: "
            f"{sorted(unexpected_test_ids)}"
        )

    scores = {}

    for test_id in df["test_id"]:
        test_id = str(test_id)

        try:
            score = float(result[test_id])
        except (TypeError, ValueError) as exc:
            raise ValueError(
                f"Invalid relevance score for {test_id}."
            ) from exc

        if not 0 <= score <= 100:
            raise ValueError(
                f"Invalid relevance score for "
                f"{test_id}: {score}. "
                "Score must be between 0 and 100."
            )

        scores[test_id] = score

    return scores