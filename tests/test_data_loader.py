from src.data_loader import load_test_cases


def test_load_test_cases():
    df = load_test_cases("data/test_cases.csv")

    assert len(df) == 20
    assert "test_id" in df.columns
    assert "priority" in df.columns
    assert "duration" in df.columns