import os
import json

import pandas as pd
from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()


def calculate_relevance_scores(
    df: pd.DataFrame,
    change_description: str,
) -> dict[str, float]:
    """
    Use AI to calculate how relevant each test case
    is to the described software change.
    """

    if not change_description.strip():
        raise ValueError(
            "Change description cannot be empty."
        )

    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise ValueError(
            "OPENAI_API_KEY is not configured."
        )

    client = OpenAI(api_key=api_key)

    test_cases = []

    for _, row in df.iterrows():
        test_cases.append({
            "test_id": row["test_id"],
            "module": row["module"],
            "description": row["description"],
            "tags": row["tags"],
        })

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

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt,
    )

    result = json.loads(response.output_text)

    return {
        test_id: float(score)
        for test_id, score in result.items()
    }