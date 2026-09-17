import os
import secrets
from datetime import datetime, timedelta

import aiosmtplib
from argon2 import PasswordHasher
from email.message import EmailMessage
from sqlalchemy.orm import Session

from backend.models import OTPVerification, User


password_hasher = PasswordHasher()


OTP_EXPIRY_MINUTES = 10
MAX_OTP_ATTEMPTS = 5


def generate_otp() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp(otp: str) -> str:
    return password_hasher.hash(otp)


def verify_otp(
    otp: str,
    otp_hash: str,
) -> bool:
    try:
        return password_hasher.verify(
            otp_hash,
            otp,
        )
    except Exception:
        return False


def create_otp(
    db: Session,
    user: User,
) -> str:

    # Invalidate previous OTPs
    db.query(OTPVerification).filter(
        OTPVerification.user_id == user.id,
        OTPVerification.verified == False,
    ).update(
        {
            OTPVerification.verified: True
        }
    )

    otp = generate_otp()

    otp_record = OTPVerification(
        user_id=user.id,
        otp_hash=hash_otp(otp),
        expires_at=datetime.utcnow()
        + timedelta(minutes=OTP_EXPIRY_MINUTES),
        attempts=0,
        verified=False,
    )

    db.add(otp_record)
    db.commit()

    return otp


async def send_otp_email(
    email: str,
    otp: str,
):
    message = EmailMessage()

    message["From"] = os.getenv("SMTP_USER")
    message["To"] = email
    message["Subject"] = "SRSO Email Verification"

    message.set_content(
        f"""
Hello,

Your Smart Regression Suite Optimizer verification code is:

{otp}

This code expires in {OTP_EXPIRY_MINUTES} minutes.

If you did not create an SRSO account, you can ignore this email.

Regards,
Smart Regression Suite Optimizer
"""
    )

    await aiosmtplib.send(
        message,
        hostname=os.getenv(
            "SMTP_HOST",
            "smtp.gmail.com",
        ),
        port=int(
            os.getenv(
                "SMTP_PORT",
                "587",
            )
        ),
        username=os.getenv("SMTP_USER"),
        password=os.getenv("SMTP_PASSWORD"),
        start_tls=True,
    )


def get_active_otp(
    db: Session,
    user_id: int,
):
    return (
        db.query(OTPVerification)
        .filter(
            OTPVerification.user_id == user_id,
            OTPVerification.verified == False,
        )
        .order_by(
            OTPVerification.created_at.desc()
        )
        .first()
    )