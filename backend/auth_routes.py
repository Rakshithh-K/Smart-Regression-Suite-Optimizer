from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.auth import (
    create_user,
    get_user_by_email,
)
from backend.schemas import RegisterRequest
from backend.otp_service import (
    create_otp,
    send_otp_email,
    get_active_otp,
    verify_otp,
    MAX_OTP_ATTEMPTS,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post("/register")
async def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    existing_user = get_user_by_email(
        db,
        request.email,
    )

    if existing_user:

        if existing_user.email_verified:
            raise HTTPException(
                status_code=400,
                detail="An account with this email already exists.",
            )

        # Existing unverified account.
        user = existing_user

    else:

        if len(request.password) < 8:
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 8 characters.",
            )

        user = create_user(
            db=db,
            name=request.name,
            email=request.email,
            password=request.password,
        )

    otp = create_otp(
        db,
        user,
    )

    await send_otp_email(
        user.email,
        otp,
    )

    return {
        "message": "Verification OTP sent to your email.",
        "email": user.email,
    }


@router.post("/verify-otp")
def verify_email_otp(
    email: str,
    otp: str,
    db: Session = Depends(get_db),
):
    user = get_user_by_email(
        db,
        email,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    if user.email_verified:
        return {
            "message": "Email is already verified."
        }

    otp_record = get_active_otp(
        db,
        user.id,
    )

    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail="No active OTP found. Please request a new OTP.",
        )

    from datetime import datetime

    if datetime.utcnow() > otp_record.expires_at:
        otp_record.verified = True
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="OTP has expired. Please request a new OTP.",
        )

    if otp_record.attempts >= MAX_OTP_ATTEMPTS:
        otp_record.verified = True
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Too many incorrect attempts. Please request a new OTP.",
        )

    if not verify_otp(
        otp,
        otp_record.otp_hash,
    ):
        otp_record.attempts += 1
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Invalid OTP.",
        )

    otp_record.verified = True
    user.email_verified = True

    db.commit()

    return {
        "message": "Email verified successfully.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "email_verified": True,
        },
    }


@router.post("/resend-otp")
async def resend_otp(
    email: str,
    db: Session = Depends(get_db),
):
    user = get_user_by_email(
        db,
        email,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    if user.email_verified:
        raise HTTPException(
            status_code=400,
            detail="Email is already verified.",
        )

    otp = create_otp(
        db,
        user,
    )

    await send_otp_email(
        user.email,
        otp,
    )

    return {
        "message": "A new OTP has been sent.",
    }