import hashlib
import hmac
import os

from fastapi import APIRouter, Header, HTTPException, Request

from .github_client import get_push_changes


router = APIRouter(
    prefix="/api/github",
    tags=["Git Impact"],
)


def verify_github_signature(
    payload: bytes,
    signature: str | None,
) -> bool:
    secret = os.getenv("GITHUB_WEBHOOK_SECRET")

    if not secret or not signature:
        return False

    expected = "sha256=" + hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(
        expected,
        signature,
    )


@router.post("/webhook")
async def github_webhook(
    request: Request,
    x_hub_signature_256: str | None = Header(default=None),
    x_github_event: str | None = Header(default=None),
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

    data = await request.json()

    repository = data.get("repository", {})

    full_name = repository.get("full_name", "")

    if "/" not in full_name:
        raise HTTPException(
            status_code=400,
            detail="Invalid repository information.",
        )

    owner, repo = full_name.split("/", 1)

    before = data.get("before")
    after = data.get("after")

    changes = get_push_changes(
        owner=owner,
        repo=repo,
        before=before,
        after=after,
    )

    return {
        "status": "received",
        "event": "push",
        "repository": full_name,
        "commit_sha": after,
        "commit_message": (
            data.get("head_commit", {}).get("message")
        ),
        "changes": changes,
    }