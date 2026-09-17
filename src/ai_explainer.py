import json

import pandas as pd

from src.ai_provider import get_ai_provider


def generate_mock_explanations(
    selected_tests: pd.DataFrame,
    excluded_tests: list[dict],
) -> dict:
    selected_reasons = {}
    excluded_reasons = {}

    for _, row in selected_tests.iterrows():
        selected_reasons[row["test_id"]] = (
            f"{row['test_id']} was selected because it is "
            f"relevant to the change and has a "
            f"{row['priority']} priority with a "
            f"{int(row['duration'])}-minute execution time."
        )

    for test in excluded_tests:
        excluded_reasons[test["test_id"]] = (
            f"{test['test_id']} is a high-risk test, but it "
            f"was excluded because the available execution "
            f"budget limited the regression suite."
        )

    return {
        "selected_reasons": selected_reasons,
        "excluded_reasons": excluded_reasons,
        "overall_tradeoff": (
            "The selected suite balances test relevance, "
            "priority, historical failure risk, and the "
            "available execution-time budget."
        ),
    }


def generate_ai_explanations(
    selected_tests: pd.DataFrame,
    excluded_tests: list[dict],
    change_description: str,
    time_budget: int,
) -> dict:

    provider = get_ai_provider()

    if provider == "mock":
        return generate_mock_explanations(
            selected_tests,
            excluded_tests,
        )

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
        "TC001": "reason"
    }},
    "excluded_reasons": {{
        "TC003": "reason"
    }},
    "overall_tradeoff": "overall explanation"
}}

Do not change or question the optimizer's selection.
Explain the decisions using only the information provided.
"""

    response = provider.responses.create(
        model="gpt-5.6-luna",
        input=prompt,
    )

    return json.loads(response.output_text)