import json
import io
from fastapi.testclient import TestClient
from backend.api import app
from backend.database import SessionLocal
from backend.models import User
from backend.git_models import GitProject, GitRun
from backend.git_routes import require_current_user

client = TestClient(app)


def get_or_create_test_user(email: str, name: str = "Test User") -> User:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                name=name,
                email=email,
                email_verified=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    finally:
        db.close()


def test_user_with_multiple_git_projects_can_open_run():
    user = get_or_create_test_user("user_multi_proj@example.com")
    db = SessionLocal()
    try:
        # Create 2 projects for this user
        proj1 = GitProject(
            user_id=user.id,
            repo_owner="test-owner",
            repo_name="repo-1",
            installation_id="11111",
            default_budget=30,
            catalog_path="data/test_cases.csv",
        )
        proj2 = GitProject(
            user_id=user.id,
            repo_owner="test-owner",
            repo_name="repo-2",
            installation_id="11111",
            default_budget=30,
            catalog_path="data/test_cases.csv",
        )
        db.add(proj1)
        db.add(proj2)
        db.commit()
        db.refresh(proj1)
        db.refresh(proj2)

        # Create a run belonging to proj2 (the second project)
        run2 = GitRun(
            git_project_id=proj2.id,
            commit_sha="abcdef1234567890",
            branch="main",
            commit_message="commit for repo 2",
            budget=30,
            status="completed",
            result_json=json.dumps({"selected_tests": []}),
        )
        db.add(run2)
        db.commit()
        db.refresh(run2)

        app.dependency_overrides[require_current_user] = lambda: user

        # User should be able to open run2
        response = client.get(f"/api/git-impact/runs/{run2.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == run2.id
        assert data["commit_sha"] == "abcdef1234567890"
        assert data["status"] == "completed"

    finally:
        app.dependency_overrides.clear()
        db.close()


def test_user_cannot_open_another_users_run():
    user1 = get_or_create_test_user("user1_auth@example.com")
    user2 = get_or_create_test_user("user2_auth@example.com")

    db = SessionLocal()
    try:
        proj1 = GitProject(
            user_id=user1.id,
            repo_owner="owner1",
            repo_name="repo1",
            installation_id="22222",
            default_budget=30,
        )
        db.add(proj1)
        db.commit()
        db.refresh(proj1)

        run1 = GitRun(
            git_project_id=proj1.id,
            commit_sha="1111222233334444",
            branch="main",
            commit_message="secret run",
            budget=30,
            status="completed",
            result_json=json.dumps({"selected_tests": []}),
        )
        db.add(run1)
        db.commit()
        db.refresh(run1)

        # User 2 tries to access User 1's run
        app.dependency_overrides[require_current_user] = lambda: user2

        response = client.get(f"/api/git-impact/runs/{run1.id}")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower() or "not configured" in response.json()["detail"].lower()

    finally:
        app.dependency_overrides.clear()
        db.close()


def test_setup_updates_existing_project_instead_of_duplicates():
    user = get_or_create_test_user("user_setup_dedup@example.com")
    db = SessionLocal()
    try:
        app.dependency_overrides[require_current_user] = lambda: user

        # Initial setup
        catalog_content = b"test_id,module,duration,priority\nTC1,Payment,5,High\n"
        res1 = client.post(
            "/api/git-impact/setup",
            data={
                "repo_owner": "org",
                "repo_name": "app",
                "installation_id": "33333",
                "default_budget": 20,
            },
            files={
                "catalog": ("catalog.csv", io.BytesIO(catalog_content), "text/csv"),
            },
        )
        assert res1.status_code == 200
        proj1_id = res1.json()["project_id"]

        # Count projects
        count1 = db.query(GitProject).filter(
            GitProject.user_id == user.id,
            GitProject.repo_owner == "org",
            GitProject.repo_name == "app",
        ).count()
        assert count1 == 1

        # Second setup for same repo with new budget
        res2 = client.post(
            "/api/git-impact/setup",
            data={
                "repo_owner": "org",
                "repo_name": "app",
                "installation_id": "33333",
                "default_budget": 45,
            },
            files={
                "catalog": ("catalog_updated.csv", io.BytesIO(catalog_content), "text/csv"),
            },
        )
        assert res2.status_code == 200
        proj2_id = res2.json()["project_id"]
        assert proj2_id == proj1_id

        # Count projects must still be 1!
        count2 = db.query(GitProject).filter(
            GitProject.user_id == user.id,
            GitProject.repo_owner == "org",
            GitProject.repo_name == "app",
        ).count()
        assert count2 == 1

        # Check updated budget in fresh transaction
        db.rollback()
        updated_proj = db.query(GitProject).filter(GitProject.id == proj1_id).first()
        assert updated_proj.default_budget == 45

    finally:
        app.dependency_overrides.clear()
        db.close()


def test_failed_git_run_can_be_displayed_without_optimization_result():
    user = get_or_create_test_user("user_failed_run@example.com")
    db = SessionLocal()
    try:
        proj = GitProject(
            user_id=user.id,
            repo_owner="org-fail",
            repo_name="repo-fail",
            installation_id="44444",
            default_budget=30,
        )
        db.add(proj)
        db.commit()
        db.refresh(proj)

        failed_run = GitRun(
            git_project_id=proj.id,
            commit_sha="failsha12345",
            branch="main",
            commit_message="broke build",
            budget=30,
            status="failed",
            result_json=None,
        )
        db.add(failed_run)
        db.commit()
        db.refresh(failed_run)

        app.dependency_overrides[require_current_user] = lambda: user

        response = client.get(f"/api/git-impact/runs/{failed_run.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == failed_run.id
        assert data["status"] == "failed"
        assert data["result"] == {}

    finally:
        app.dependency_overrides.clear()
        db.close()


def test_completed_run_with_missing_result_json_does_not_fail():
    user = get_or_create_test_user("user_missing_result@example.com")
    db = SessionLocal()
    try:
        proj = GitProject(
            user_id=user.id,
            repo_owner="org-legacy",
            repo_name="repo-legacy",
            installation_id="55555",
            default_budget=30,
        )
        db.add(proj)
        db.commit()
        db.refresh(proj)

        # Legacy run 4 case: completed but result_json is None
        legacy_run = GitRun(
            git_project_id=proj.id,
            commit_sha="legacysha999",
            branch="main",
            commit_message="legacy completed run",
            budget=30,
            status="completed",
            result_json=None,
        )
        db.add(legacy_run)
        db.commit()
        db.refresh(legacy_run)

        app.dependency_overrides[require_current_user] = lambda: user

        response = client.get(f"/api/git-impact/runs/{legacy_run.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == legacy_run.id
        assert data["status"] == "completed"
        assert data["result"] == {}

    finally:
        app.dependency_overrides.clear()
        db.close()


def test_authenticated_user_can_delete_own_run():
    user = get_or_create_test_user("user_delete_own@example.com")
    db = SessionLocal()
    try:
        proj = GitProject(
            user_id=user.id,
            repo_owner="org-del",
            repo_name="repo-del",
            installation_id="66661",
            default_budget=30,
        )
        db.add(proj)
        db.commit()
        db.refresh(proj)

        run = GitRun(
            git_project_id=proj.id,
            commit_sha="delsha001",
            branch="main",
            commit_message="run to delete",
            budget=30,
            status="completed",
        )
        db.add(run)
        db.commit()
        db.refresh(run)
        run_id = run.id

        app.dependency_overrides[require_current_user] = lambda: user

        response = client.delete(f"/api/git-impact/runs/{run_id}")
        assert response.status_code == 200
        assert response.json()["id"] == run_id

        # Verify run is deleted from DB (commit to end transaction snapshot in MySQL REPEATABLE READ)
        db.commit()
        deleted_run = db.query(GitRun).filter(GitRun.id == run_id).first()
        assert deleted_run is None

    finally:
        app.dependency_overrides.clear()
        db.close()


def test_delete_nonexistent_run_returns_404():
    user = get_or_create_test_user("user_delete_404@example.com")
    db = SessionLocal()
    try:
        proj = GitProject(
            user_id=user.id,
            repo_owner="org-del404",
            repo_name="repo-del404",
            installation_id="66662",
            default_budget=30,
        )
        db.add(proj)
        db.commit()

        app.dependency_overrides[require_current_user] = lambda: user

        response = client.delete("/api/git-impact/runs/999999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Git Impact run not found."

    finally:
        app.dependency_overrides.clear()
        db.close()


def test_user_cannot_delete_another_users_run():
    user1 = get_or_create_test_user("user1_del_perm@example.com")
    user2 = get_or_create_test_user("user2_del_perm@example.com")
    db = SessionLocal()
    try:
        proj1 = GitProject(
            user_id=user1.id,
            repo_owner="org-user1",
            repo_name="repo-user1",
            installation_id="66663",
            default_budget=30,
        )
        db.add(proj1)
        db.commit()
        db.refresh(proj1)

        run1 = GitRun(
            git_project_id=proj1.id,
            commit_sha="user1sha001",
            branch="main",
            commit_message="user1 run",
            budget=30,
            status="completed",
        )
        db.add(run1)
        db.commit()
        db.refresh(run1)

        # User 2 attempts to delete User 1's run
        app.dependency_overrides[require_current_user] = lambda: user2

        response = client.delete(f"/api/git-impact/runs/{run1.id}")
        assert response.status_code == 404

        # Verify run1 is NOT deleted
        persisted_run = db.query(GitRun).filter(GitRun.id == run1.id).first()
        assert persisted_run is not None

    finally:
        app.dependency_overrides.clear()
        db.close()


def test_deleting_one_run_does_not_delete_another_run():
    user = get_or_create_test_user("user_del_multi@example.com")
    db = SessionLocal()
    try:
        proj = GitProject(
            user_id=user.id,
            repo_owner="org-delmulti",
            repo_name="repo-delmulti",
            installation_id="66664",
            default_budget=30,
        )
        db.add(proj)
        db.commit()
        db.refresh(proj)

        run_a = GitRun(
            git_project_id=proj.id,
            commit_sha="sha_a",
            branch="main",
            commit_message="run A",
            budget=30,
            status="completed",
        )
        run_b = GitRun(
            git_project_id=proj.id,
            commit_sha="sha_b",
            branch="main",
            commit_message="run B",
            budget=30,
            status="completed",
        )
        db.add(run_a)
        db.add(run_b)
        db.commit()
        db.refresh(run_a)
        db.refresh(run_b)
        run_a_id = run_a.id
        run_b_id = run_b.id

        app.dependency_overrides[require_current_user] = lambda: user

        # Delete run_a
        response = client.delete(f"/api/git-impact/runs/{run_a_id}")
        assert response.status_code == 200

        # run_a is deleted, run_b remains
        db.commit()
        assert db.query(GitRun).filter(GitRun.id == run_a_id).first() is None
        assert db.query(GitRun).filter(GitRun.id == run_b_id).first() is not None

    finally:
        app.dependency_overrides.clear()
        db.close()


def test_git_project_remains_after_deleting_run():
    user = get_or_create_test_user("user_del_project_remains@example.com")
    db = SessionLocal()
    try:
        proj = GitProject(
            user_id=user.id,
            repo_owner="org-projremain",
            repo_name="repo-projremain",
            installation_id="66665",
            default_budget=45,
            catalog_path="data/test_catalog.csv",
        )
        db.add(proj)
        db.commit()
        db.refresh(proj)
        proj_id = proj.id

        run = GitRun(
            git_project_id=proj.id,
            commit_sha="sha_remain",
            branch="main",
            commit_message="run before delete",
            budget=45,
            status="completed",
        )
        db.add(run)
        db.commit()
        db.refresh(run)

        app.dependency_overrides[require_current_user] = lambda: user

        response = client.delete(f"/api/git-impact/runs/{run.id}")
        assert response.status_code == 200

        # Verify GitProject still exists completely intact
        persisted_proj = db.query(GitProject).filter(GitProject.id == proj_id).first()
        assert persisted_proj is not None
        assert persisted_proj.repo_owner == "org-projremain"
        assert persisted_proj.default_budget == 45
        assert persisted_proj.catalog_path == "data/test_catalog.csv"

    finally:
        app.dependency_overrides.clear()
        db.close()
