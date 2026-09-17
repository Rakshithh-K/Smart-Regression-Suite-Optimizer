import json
import os

import pandas as pd
from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()


def generate_ai_explanations(
    selected_tests: pd.DataFrame,
    excluded_tests: list[dict],
    change_description: str,
    time_budget: int,
) -> dict:
    """
    Use AI to explain why tests were selected
    or excluded from the regression suite.
    """

    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise ValueError(
            "OPENAI_API_KEY is not configured."
        )

    client = OpenAI(api_key=api_key)

    selected_data = selected_tests[
        [
            "test_id",
            "module",
            "description",
            "priority",
            "duration",
            "historical_failure_count",
            "relevance_score",
            "priority_score",
        ]
    ].to_dict(orient="records")

    prompt = f"""
You are a software testing assistant.

A software change has been described as:

{change_description}

The available regression execution budget is:

{time_budget} minutes.

The deterministic optimizer selected these tests:

{json.dumps(selected_data, indent=2)}

These high-risk tests were excluded:

{json.dumps(excluded_tests, indent=2)}

Explain the optimization decisions.

For every selected test, explain:
- Why it is relevant to the change.
- Why its priority/risk makes it valuable.
- How its execution time fits the budget.

For every excluded test, explain:
- Why it is potentially risky.
- Why it was excluded despite that risk.
- The time-budget trade-off involved.

Return ONLY valid JSON in this format:

{{
    "selected_reasons": {{
        "TC001": "reason",
        "TC002": "reason"
    }},
    "excluded_reasons": {{
        "TC003": "reason",
        "TC004": "reason"
    }},
    "overall_tradeoff": "overall explanation"
}}

Do not change or question the optimizer's selection.
Explain the decisions using only the information provided.
"""

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt,
    )

    return json.loads(response.output_text)