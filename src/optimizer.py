import pandas as pd


def optimize_regression_suite(
    df: pd.DataFrame,
    time_budget: int,
) -> pd.DataFrame:
    """
    Select the highest-value combination of tests
    within the available execution-time budget.
    """

    if time_budget <= 0:
        raise ValueError("Time budget must be greater than 0.")

    n = len(df)

    # dp[time] stores the maximum score achievable
    # using at most this amount of time.
    dp = [0.0] * (time_budget + 1)

    # selected[time] stores the test indexes
    # used to achieve dp[time].
    selected = [[] for _ in range(time_budget + 1)]

    for index, row in df.iterrows():

        duration = int(row["duration"])
        score = float(row["priority_score"])

        if duration > time_budget:
            continue

        for remaining_time in range(time_budget, duration - 1, -1):

            candidate_score = (
                dp[remaining_time - duration] + score
            )

            if candidate_score > dp[remaining_time]:

                dp[remaining_time] = candidate_score

                selected[remaining_time] = (
                    selected[remaining_time - duration]
                    + [index]
                )

    best_time = max(
        range(time_budget + 1),
        key=lambda time: dp[time],
    )

    selected_indexes = selected[best_time]

    result = df.loc[selected_indexes].copy()

    result["selected"] = True

    return result.reset_index(drop=True)    