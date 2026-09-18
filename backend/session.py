import hashlib
import secrets
from datetime import datetime, timedelta

from fastapi import Request, Response
from sqlalchemy.orm import Session

from backend.models import User, UserSession


# ============================================================
# Session configuration
# ============================================================

SESSION_COOKIE = "srso_session"

SESSION_DURATION_DAYS = 7


# ============================================================
# Hash session token
# ============================================================

def hash_token(token: str) -> str:
    return hashlib.sha256(
        token.encode()
    ).hexdigest()


# ============================================================
# Create session
# ============================================================

def create_session(
    db: Session,
    response: Response,
    user_id: int,
):
    # Generate a secure random session token
    token = secrets.token_urlsafe(32)

    # Never store the actual token in the database
    token_hash = hash_token(token)

    # Create database session record
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

    # Send session token to browser as an HTTP-only cookie
    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        httponly=True,

        # Local development uses HTTP
        secure=False,

        # Allows the cookie for our frontend/backend requests
        samesite="lax",

        # Cookie lifetime
        max_age=60 * 60 * 24 * SESSION_DURATION_DAYS,
    )

    print("SESSION CREATED")
    print("User ID:", user_id)
    print("Token generated:", bool(token))

    return token


# ============================================================
# Get currently authenticated user
# ============================================================

def get_current_user(
    request: Request,
    db: Session,
):
    # Read session cookie from browser request
    token = request.cookies.get(
        SESSION_COOKIE
    )

    print("----------------------------------------")
    print("AUTHENTICATION CHECK")
    print("Session cookie received:", bool(token))

    # No cookie means user is not logged in
    if not token:
        print("No session cookie found.")
        print("----------------------------------------")
        return None

    # Hash cookie token
    token_hash = hash_token(token)

    # Find matching session in database
    session = (
        db.query(UserSession)
        .filter(
            UserSession.token_hash == token_hash
        )
        .first()
    )

    print("Session record found:", bool(session))

    # Session does not exist
    if not session:
        print("No matching session found in database.")
        print("----------------------------------------")
        return None

    # Check session expiration
    if datetime.utcnow() > session.expires_at:
        print("Session has expired.")

        db.delete(session)
        db.commit()

        print("----------------------------------------")
        return None

    # Find user belonging to this session
    user = (
        db.query(User)
        .filter(
            User.id == session.user_id
        )
        .first()
    )

    print("User found:", bool(user))

    if user:
        print("Authenticated user:", user.email)

    print("----------------------------------------")

    return user


# ============================================================
# Delete session / logout
# ============================================================

def delete_session(
    request: Request,
    response: Response,
    db: Session,
):
    token = request.cookies.get(
        SESSION_COOKIE
    )

    print("LOGOUT REQUEST")
    print("Session cookie received:", bool(token))

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

            print("Session deleted from database.")

    # Remove cookie from browser
    response.delete_cookie(
        key=SESSION_COOKIE
    )

    print("Session cookie deleted.")