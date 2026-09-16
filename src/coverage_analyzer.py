import pandas as pd


def analyze_coverage(df: pd.DataFrame) -> dict:
    """
    Analyze module and tag coverage of the selected tests.
    """

    if df.empty:
        raise ValueError("No tests were selected.")

    module_coverage = (
        df["module"]
        .value_counts()
        .to_dict()
    )

    tag_coverage = {}

    for tags in df["tags"]:
        for tag in str(tags).split(","):
            tag = tag.strip()

            if tag:
                tag_coverage[tag] = (
                    tag_coverage.get(tag, 0) + 1
                )

    return {
        "total_selected_tests": len(df),
        "module_coverage": module_coverage,
        "tag_coverage": tag_coverage,
    }