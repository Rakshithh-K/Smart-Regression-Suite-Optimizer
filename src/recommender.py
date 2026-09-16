import pandas as pd


def generate_recommendation(
    selected_tests: pd.DataFrame,
    coverage: dict,
    time_budget: int,
) -> dict:
    """
    Generate a summary and recommendations
    from the optimized regression suite.
    """

    if time_budget <= 0:
        raise ValueError("Time budget must be greater than 0.")

    if selected_tests.empty:
        raise ValueError("No tests were selected.")

    total_duration = int(
        selected_tests["duration"].sum()
    )

    remaining_time = time_budget - total_duration

    module_coverage = coverage.get(
        "module_coverage",
        {},
    )

    recommendations = []

    if remaining_time > 0:
        recommendations.append(
            f"{remaining_time} minute(s) remain unused."
        )

    if module_coverage:
        highest_module = max(
            module_coverage,
            key=module_coverage.get,
        )

        recommendations.append(
            f"{highest_module} has the highest "
            f"selected-test coverage."
        )

    if remaining_time == 0:
        recommendations.append(
            "The available execution budget is fully used."
        )

    return {
        "total_selected_tests": len(selected_tests),
        "total_execution_time": total_duration,
        "time_budget": time_budget,
        "remaining_time": remaining_time,
        "recommendations": recommendations,
    }