import hashlib
import hmac
import json
import os

from fastapi import (
    APIRouter,
    Depends,
    Header,
    HTTPException,
    Request,
)
from sqlalchemy.orm import Session

from src.git_impact_service import run_git_impact

from .database import get_db
from .git_models import GitProject, GitRun
from .github_client import get_push_changes


router = APIRouter(
    prefix="/api/github",
    tags=["Git Impact"],
)


def verify_github_signature(
    payload: bytes,
    signature: str | None,
) -> bool:
    secret = os.getenv(
        "GITHUB_WEBHOOK_SECRET"
    )

    if not secret or not signature:
        return False

    expected = (
        "sha256="
        + hmac.new(
            secret.encode(),
            payload,
            hashlib.sha256,
        ).hexdigest()
    )

    return hmac.compare_digest(
        expected,
        signature,
    )


@router.post("/webhook")
async def github_webhook(
    request: Request,
    db: Session = Depends(get_db),
    x_hub_signature_256: str | None = Header(
        default=None
    ),
    x_github_event: str | None = Header(
        default=None
    ),
):
    payload = await request.body()

    if not verify_github_signature(
        payload,
        x_hub_signature_256,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid GitHub webhook signature.",
        )

    if x_github_event != "push":
        return {
            "status": "ignored",
            "event": x_github_event,
        }

    data = json.loads(payload)

    repository = data.get(
        "repository",
        {}
    )

    full_name = repository.get(
        "full_name",
        "",
    )

    if "/" not in full_name:
        raise HTTPException(
            status_code=400,
            detail="Invalid repository information.",
        )

    owner, repo = full_name.split(
        "/",
        1,
    )

    installation = data.get(
        "installation",
        {}
    )

    installation_id = str(
        installation.get(
            "id",
            "",
        )
    )

    if not installation_id:
        raise HTTPException(
            status_code=400,
            detail="GitHub installation ID is missing.",
        )

    project = (
        db.query(GitProject)
        .filter(
            GitProject.repo_owner == owner,
            GitProject.repo_name == repo,
            GitProject.installation_id
            == installation_id,
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail=(
                "No Git Impact project is "
                "configured for this repository."
            ),
        )

    before = data.get("before")
    after = data.get("after")

    commit = data.get(
        "head_commit"
    ) or {}

    commit_message = commit.get(
        "message",
        "",
    )

    branch = data.get(
        "ref",
        "",
    ).replace(
        "refs/heads/",
        "",
    )

    if not before or not after:
        raise HTTPException(
            status_code=400,
            detail="Invalid push commit range.",
        )

    try:
        # Get actual changed files and diffs
        changes = get_push_changes(
            owner=owner,
            repo=repo,
            before=before,
            after=after,
            installation_id=installation_id,
        )

        # Run the Git Impact pipeline
        result = run_git_impact(
            commit_message=commit_message,
            changed_files=changes["files"],
            test_catalog_path=project.catalog_path,
            time_budget=project.default_budget,
        )

        # Save the complete Git Impact result
        git_run = GitRun(
            git_project_id=project.id,
            commit_sha=after,
            branch=branch,
            commit_message=commit_message,

            changed_files=json.dumps(
                changes["files"]
            ),

            change_description=json.dumps(
                result["change"]
            ),

            result_json=json.dumps({
                "selected_tests": result[
                    "selected_tests"
                ],
                "exclusions": result[
                    "exclusions"
                ],
                "summary": result[
                    "summary"
                ],
                "coverage": result[
                    "coverage"
                ],
                "recommendation": result[
                    "recommendation"
                ],
                "ai_explanations": result[
                    "ai_explanations"
                ],
                "risk_debt": result[
                    "risk_debt"
                ],
            }),

            budget=project.default_budget,
            status="completed",
        )

        db.add(git_run)
        db.commit()
        db.refresh(git_run)

        return {
            "status": "completed",
            "git_run_id": git_run.id,
            "repository": full_name,
            "commit_sha": after,
            "branch": branch,
            "change": result["change"],
            "summary": result["summary"],
            "coverage": result["coverage"],
            "risk_debt": result["risk_debt"],
        }

    except Exception as error:
        db.rollback()

        # Save failed Git Impact run
        git_run = GitRun(
            git_project_id=project.id,
            commit_sha=after,
            branch=branch,
            commit_message=commit_message,
            budget=project.default_budget,
            status="failed",
        )

        db.add(git_run)
        db.commit()

        raise HTTPException(
            status_code=500,
            detail=(
                f"Git Impact processing failed: "
                f"{error}"
            ),
        )