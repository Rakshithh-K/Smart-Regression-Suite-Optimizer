import json

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
- Score must be between 0 and 100.
- 0 means not relevant.
- 100 means extremely relevant.
- Consider the module, description, and tags.
- Return every test_id exactly once.
- Do not include explanations.
"""

    response = provider.responses.create(
        model="gpt-5.6-luna",
        input=prompt,
    )

    result = json.loads(response.output_text)

    return {
        test_id: float(score)
        for test_id, score in result.items()
    }