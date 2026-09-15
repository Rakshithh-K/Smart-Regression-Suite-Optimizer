from pathlib import Path

import pandas as pd


REQUIRED_COLUMNS = [
    "test_id",
    "module",
    "description",
    "priority",
    "duration",
    "tags",
    "historical_failure_count",
]

VALID_PRIORITIES = {"High", "Medium", "Low"}


def load_test_cases(file_path: str | Path) -> pd.DataFrame:
    """
    Load and validate the test-case CSV.

    Returns:
        A validated pandas DataFrame.

    Raises:
        ValueError: If the CSV structure or values are invalid.
        FileNotFoundError: If the CSV file does not exist.
    """
    #for path object
    file_path = Path(file_path)

    if not file_path.exists():
        raise FileNotFoundError(f"CSV file not found: {file_path}")

    df = pd.read_csv(file_path)

    # Check required columns This is to check for all the columns
    missing_columns = [
        column for column in REQUIRED_COLUMNS
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    if df.empty:
        raise ValueError("CSV file contains no test cases.")

    # Check for missing values
    if df[REQUIRED_COLUMNS].isnull().any().any():
        raise ValueError(
            "CSV contains missing values in required fields."
        )

    # Validate test IDs
    if df["test_id"].duplicated().any():
        raise ValueError("Test IDs must be unique.")

    # Validate priorities   creates a set of unique prior- A-B (present i A but not in B)
    invalid_priorities = set(df["priority"]) - VALID_PRIORITIES

    if invalid_priorities:
        raise ValueError(
            f"Invalid priority values: {invalid_priorities}"
        )

    # Validate duration
    if not pd.api.types.is_numeric_dtype(df["duration"]):
        raise ValueError("Duration must contain numeric values.")

    if (df["duration"] <= 0).any():
        raise ValueError("Duration must be greater than zero.")

    # Validate historical failures
    if not pd.api.types.is_numeric_dtype(
        df["historical_failure_count"]
    ):
        raise ValueError(
            "Historical failure count must contain numeric values."
        )

    if (df["historical_failure_count"] < 0).any():
        raise ValueError(
            "Historical failure count cannot be negative."
        )

    # Normalize text fields str.strip() to remove unnecessary spaces
    df["priority"] = df["priority"].str.strip()
    df["tags"] = df["tags"].str.strip()
    df["module"] = df["module"].str.strip()
    df["description"] = df["description"].str.strip()

    return df