import pandas as pd


def calculate_relevance_scores(
    df: pd.DataFrame,
    change_description: str,
) -> dict[str, float]:
    """
    Calculate relevance scores for test cases based on
    the current change description.
    """

    if not change_description.strip():
        raise ValueError("Change description cannot be empty.")

    scores = {}

    change_words = set(
        change_description.lower().split()
    )

    for _, row in df.iterrows():

        test_text = (
            f"{row['module']} "
            f"{row['description']} "
            f"{row['tags']}"
        ).lower()

        test_words = set(test_text.replace(",", " ").split())

        matching_words = change_words.intersection(test_words)

        if matching_words:
            score = min(
                100,
                len(matching_words) * 25,
            )
        else:
            score = 0

        scores[row["test_id"]] = float(score)

    return scores