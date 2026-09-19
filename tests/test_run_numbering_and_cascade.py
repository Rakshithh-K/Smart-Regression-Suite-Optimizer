import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from backend.api import app
from backend.database import SessionLocal
from backend.models import User, RegressionRun, RegressionResult

client = TestClient(app)

@pytest.fixture
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_or_get_user(db, email, name="Test User"):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(name=name, email=email, email_verified=True)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

def run_optimization_for_user(user):
    with patch("backend.api.get_current_user", return_value=user):
        with open("data/test_cases.csv", "rb") as f:
            response = client.post(
                "/api/optimize",
                files={"file": ("test_cases.csv", f, "text/csv")},
                data={
                    "change_description": f"Test run for user {user.email}",
                    "time_budget": "30",
                },
            )
    assert response.status_code == 200
    return response.json()

def test_user_scoped_run_numbers_and_cascade(db_session):
    # Setup test users
    email_a = "user_a_test@example.com"
    email_b = "user_b_test@example.com"

    # Clean up any previous test runs/users if they exist
    for email in [email_a, email_b, "user_c_test@example.com"]:
        existing = db_session.query(User).filter(User.email == email).first()
        if existing:
            db_session.delete(existing)
    db_session.commit()

    user_a = create_or_get_user(db_session, email_a, "User A")
    user_b = create_or_get_user(db_session, email_b, "User B")

    # TEST 1: New user with no previous runs -> first optimization has run_number = 1
    res_a1 = run_optimization_for_user(user_a)
    assert res_a1["run_number"] == 1
    assert "run_id" in res_a1
    run_a1_db_id = res_a1["run_id"]

    # TEST 2: Same user performs another optimization -> run_number = 2
    res_a2 = run_optimization_for_user(user_a)
    assert res_a2["run_number"] == 2
    run_a2_db_id = res_a2["run_id"]
    assert run_a2_db_id > run_a1_db_id

    # TEST 3: Different user performs first optimization -> run_number = 1
    res_b1 = run_optimization_for_user(user_b)
    assert res_b1["run_number"] == 1
    run_b1_db_id = res_b1["run_id"]

    # TEST 4: Different user performs second optimization -> run_number = 2
    res_b2 = run_optimization_for_user(user_b)
    assert res_b2["run_number"] == 2
    run_b2_db_id = res_b2["run_id"]

    # TEST 5: Global database IDs continue increasing and do NOT affect run_number
    # run_b1_db_id > run_a2_db_id, but run_b1 run_number is 1
    assert run_b1_db_id > run_a2_db_id
    assert res_b1["run_number"] == 1

    # TEST 8: History API returns run_number rather than global database ID for display
    with patch("backend.history_routes.get_current_user", return_value=user_a):
        hist_resp = client.get("/api/history")
        assert hist_resp.status_code == 200
        history_data = hist_resp.json()["history"]
        assert len(history_data) >= 2
        # Verify run_number is present in each history entry
        for entry in history_data:
            assert "run_number" in entry
            assert "id" in entry

        # Detail endpoint check
        detail_resp = client.get(f"/api/history/{run_a1_db_id}")
        assert detail_resp.status_code == 200
        detail_data = detail_resp.json()["run"]
        assert detail_data["id"] == run_a1_db_id
        assert detail_data["run_number"] == 1

    # TEST 6: Deleted user's regression data does not remain orphaned (cascade deletion)
    # Refresh transaction snapshot to see rows committed by test client
    db_session.commit()
    b_runs_before = db_session.query(RegressionRun).filter(RegressionRun.user_id == user_b.id).all()
    assert len(b_runs_before) == 2
    b_run_ids = [r.id for r in b_runs_before]
    b_results_before = db_session.query(RegressionResult).filter(RegressionResult.run_id.in_(b_run_ids)).all()
    assert len(b_results_before) > 0

    # Delete user_b
    db_session.delete(user_b)
    db_session.commit()

    # Verify cascade removed regression_runs and regression_results
    b_runs_after = db_session.query(RegressionRun).filter(RegressionRun.user_id == user_b.id).all()
    assert len(b_runs_after) == 0
    b_results_after = db_session.query(RegressionResult).filter(RegressionResult.run_id.in_(b_run_ids)).all()
    assert len(b_results_after) == 0

    # TEST 7: Re-registering after account deletion starts at run_number = 1
    new_user_b = create_or_get_user(db_session, email_b, "User B Re-registered")
    res_b_re = run_optimization_for_user(new_user_b)
    assert res_b_re["run_number"] == 1
    assert res_b_re["run_id"] > run_b2_db_id

    # Cleanup user_a and new_user_b
    db_session.delete(user_a)
    db_session.delete(new_user_b)
    db_session.commit()
