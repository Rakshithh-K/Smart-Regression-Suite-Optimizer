import hashlib
import secrets
from datetime import datetime, timedelta

from fastapi import Request, Response
from sqlalchemy.orm import Session

from backend.models import User, UserSession


SESSION_COOKIE = "srso_session"

SESSION_DURATION_DAYS = 7


def hash_token(token: str) -> str:
    return hashlib.sha256(
        token.encode()
    ).hexdigest()


def create_session(
    db: Session,
    response: Response,
    user_id: int,
):
    token = secrets.token_urlsafe(32)

    token_hash = hash_token(token)

    session = UserSession(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=(
            datetime.utcnow()
            + timedelta(
                days=SESSION_DURATION_DAYS
            )
        ),
    )

    db.add(session)
    db.commit()

    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * SESSION_DURATION_DAYS,
    )

    return token


def get_current_user(
    request: Request,
    db: Session,
):
    token = request.cookies.get(
        SESSION_COOKIE
    )

    if not token:
        return None

    token_hash = hash_token(token)

    session = (
        db.query(UserSession)
        .filter(
            UserSession.token_hash == token_hash
        )
        .first()
    )

    if not session:
        return None

    if datetime.utcnow() > session.expires_at:
        db.delete(session)
        db.commit()
        return None

    return (
        db.query(User)
        .filter(
            User.id == session.user_id
        )
        .first()
    )


def delete_session(
    request: Request,
    response: Response,
    db: Session,
):
    token = request.cookies.get(
        SESSION_COOKIE
    )

    if token:
        token_hash = hash_token(token)

        session = (
            db.query(UserSession)
            .filter(
                UserSession.token_hash == token_hash
            )
            .first()
        )

        if session:
            db.delete(session)
            db.commit()

    response.delete_cookie(
        key=SESSION_COOKIE
    )