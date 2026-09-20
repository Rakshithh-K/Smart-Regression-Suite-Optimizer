from src.github_change_analyzer import analyze_github_change
from src.pipeline import run_pipeline


def run_git_impact(
    commit_message: str,
    changed_files: list[dict],
    test_catalog_path: str,
    time_budget: int,
) -> dict:
    """
    Analyze a GitHub change and run the existing
    SRSO optimization pipeline.
    """

    change = analyze_github_change(
        commit_message=commit_message,
        changed_files=changed_files,
    )

    results = run_pipeline(
        csv_path=test_catalog_path,
        change_description=change["summary"],
        time_budget=time_budget,
    )

    (
        selected_tests,
        exclusions,
        summary,
        coverage,
        recommendation,
        ai_explanations,
        risk_debt,
    ) = results

    return {
        "change": change,
        "selected_tests": selected_tests.to_dict(
            orient="records"
        ),
        "exclusions": exclusions,
        "summary": summary,
        "coverage": coverage,
        "recommendation": recommendation,
        "ai_explanations": ai_explanations,
        "risk_debt": risk_debt,
    }