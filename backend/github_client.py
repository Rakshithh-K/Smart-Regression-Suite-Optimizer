import os
import time

import httpx
import jwt
import base64

GITHUB_API = "https://api.github.com"


def create_app_jwt() -> str:
    app_id = os.getenv("GITHUB_APP_ID")

    if not app_id:
        raise ValueError("GitHub App ID is not configured.")

    # Production: read the private key from an environment variable
    private_key_b64 = os.getenv("GITHUB_PRIVATE_KEY_B64")

    if private_key_b64:
        try:
            private_key = base64.b64decode(private_key_b64).decode("utf-8")
        except Exception as exc:
            raise ValueError("Invalid GitHub private key configuration.") from exc
    else:
        # Local development: continue using the .pem file
        key_path = os.getenv("GITHUB_PRIVATE_KEY_PATH")

        if not key_path:
            raise ValueError("GitHub private key is not configured.")

        with open(key_path, "r", encoding="utf-8") as file:
            private_key = file.read()

    now = int(time.time())

    payload = {
        "iat": now - 60,
        "exp": now + (9 * 60),
        "iss": app_id,
    }

    return jwt.encode(
        payload,
        private_key,
        algorithm="RS256",
    )

def get_installation_token(
    installation_id: str,
) -> str:
    app_jwt = create_app_jwt()

    response = httpx.post(
        (
            f"{GITHUB_API}/app/installations/"
            f"{installation_id}/access_tokens"
        ),
        headers={
            "Authorization": f"Bearer {app_jwt}",
            "Accept": "application/vnd.github+json",
        },
        timeout=30,
    )

    response.raise_for_status()

    return response.json()["token"]


def get_push_changes(
    owner: str,
    repo: str,
    before: str,
    after: str,
    installation_id: str,
) -> dict:
    token = get_installation_token(
        installation_id
    )

    response = httpx.get(
        (
            f"{GITHUB_API}/repos/"
            f"{owner}/{repo}/compare/"
            f"{before}...{after}"
        ),
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
        },
        timeout=30,
    )

    response.raise_for_status()

    data = response.json()

    files = []

    for file in data.get("files", []):
        files.append(
            {
                "filename": file.get(
                    "filename"
                ),
                "status": file.get(
                    "status"
                ),
                "additions": file.get(
                    "additions",
                    0,
                ),
                "deletions": file.get(
                    "deletions",
                    0,
                ),
                "changes": file.get(
                    "changes",
                    0,
                ),
                "patch": file.get(
                    "patch",
                    "",
                ),
            }
        )

    return {
        "before": before,
        "after": after,
        "total_commits": data.get(
            "total_commits",
            0,
        ),
        "files": files,
    }