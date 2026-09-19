from datetime import datetime
from sqlalchemy import Boolean, DateTime, Integer, String, Text, Float, ForeignKey
from sqlalchemy import (
    Boolean,
    DateTime,
    Integer,    
    String,
)

from sqlalchemy.orm import Mapped, mapped_column

from backend.database import Base


class User(Base):

    __tablename__ = "users"


    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )


    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )


    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )


    password_hash: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )


    google_id: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
    )


    email_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

class OTPVerification(Base):

    __tablename__ = "otp_verifications"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        index=True,
    )

    otp_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    attempts: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
class UserSession(Base):
    __tablename__ = "user_sessions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        index=True,
    )

    token_hash: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
class RegressionRun(Base):
    __tablename__ = "regression_runs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    change_description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    time_budget: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    total_tests: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    selected_tests: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    execution_time: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
    run_number: Mapped[int] = mapped_column(
    Integer,
    nullable=False,
    default=1,
)

class RegressionResult(Base):
    __tablename__ = "regression_results"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    run_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("regression_runs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    test_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    module: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    duration: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    priority_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    relevance_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )