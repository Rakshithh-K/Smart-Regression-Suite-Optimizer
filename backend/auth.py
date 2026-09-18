from sqlalchemy.orm import Session
from argon2 import PasswordHasher

from backend.models import User


password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(
    password: str,
    password_hash: str,
) -> bool:
    try:
        return password_hasher.verify(
            password_hash,
            password,
        )
    except Exception:
        return False


def get_user_by_email(
    db: Session,
    email: str,
):
    return (
        db.query(User)
        .filter(
            User.email == email.lower()
        )
        .first()
    )


def create_user(
    db: Session,
    name: str,
    email: str,
    password: str,
):
    user = User(
        name=name.strip(),
        email=email.lower(),
        password_hash=hash_password(password),
        email_verified=False,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user