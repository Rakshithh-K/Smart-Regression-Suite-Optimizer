import json

from src.ai_provider import get_ai_provider


def generate_mock_change_analysis(
    commit_message: str,
    changed_files: list[dict],
) -> dict:
    """
    Generate a deterministic change description when AI is disabled.
    """

    filenames = [
        file.get("filename", "")
        for file in changed_files
    ]

    text = f"{commit_message} {' '.join(filenames)}".lower()

    module = "Unknown"

    modules = [
        "authentication",
        "profile",
        "cart",
        "orders",
        "payment",
        "notifications",
        "search",
    ]

    for item in modules:
        if item in text:
            module = item.title()
            break

    features = [
        word
        for word in [
            "login",
            "payment",
            "upi",
            "card",
            "refund",
            "timeout",
            "order",
            "cart",
            "search",
            "notification",
            "authentication",
        ]
        if word in text
    ]

    change_types = {
        file.get("status")
        for file in changed_files
        if file.get("status")
    }

    return {
        "summary": commit_message.strip(),
        "module": module,
        "features": features,
        "change_type": sorted(change_types),
        "risk_areas": features,
    }


def analyze_github_change(
    commit_message: str,
    changed_files: list[dict],
) -> dict:

    if not commit_message.strip():
        raise ValueError(
            "Commit message cannot be empty."
        )

    if not changed_files:
        raise ValueError(
            "Changed files cannot be empty."
        )

    provider = get_ai_provider()

    if provider == "mock":
        return generate_mock_change_analysis(
            commit_message,
            changed_files,
        )

    file_data = []

    for file in changed_files:
        file_data.append(
            {
                "filename": file.get("filename", ""),
                "status": file.get("status", ""),
                "additions": file.get("additions", 0),
                "deletions": file.get("deletions", 0),
                "patch": file.get("patch", ""),
            }
        )

    prompt = f"""
You are a software change impact analyzer.

Analyze this GitHub change.

Commit message:
{commit_message}

Changed files and diffs:
{json.dumps(file_data, indent=2)}

Return ONLY valid JSON in exactly this format:

{{
    "summary": "short description of what changed",
    "module": "most affected application module",
    "features": ["feature1", "feature2"],
    "change_type": ["modified"],
    "risk_areas": ["risk1", "risk2"]
}}

Rules:
- Analyze the actual change using the commit message,
  file paths, and diff.
- Describe what changed.
- Identify the affected application module.
- Identify important affected features.
- Identify potential risk areas.
- Do NOT select regression tests.
- Do NOT calculate priority.
- Do NOT optimize the regression suite.
- Do NOT invent information unsupported by the change.
- Keep the summary concise.
"""

    response = provider.responses.create(
        model="gpt-5.6-luna",
        input=prompt,
    )

    result = json.loads(
        response.output_text
    )

    required_fields = [
        "summary",
        "module",
        "features",
        "change_type",
        "risk_areas",
    ]

    for field in required_fields:
        if field not in result:
            raise ValueError(
                f"Missing field: {field}"
            )

    return result