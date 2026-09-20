from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class GitProject(Base):
    __tablename__ = "git_projects"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    repo_owner = Column(String(255), nullable=False)
    repo_name = Column(String(255), nullable=False)

    installation_id = Column(String(100), nullable=False)

    default_budget = Column(Integer, nullable=False)

    catalog_path = Column(String(500), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    runs = relationship(
        "GitRun",
        back_populates="project",
        cascade="all, delete-orphan",
    )


class GitRun(Base):
    __tablename__ = "git_runs"

    id = Column(Integer, primary_key=True, index=True)

    git_project_id = Column(
        Integer,
        ForeignKey("git_projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    commit_sha = Column(String(100), nullable=False)
    branch = Column(String(255), nullable=True)

    commit_message = Column(Text, nullable=True)
    changed_files = Column(Text, nullable=True)
    change_description = Column(Text, nullable=True)

    budget = Column(Integer, nullable=False)

    status = Column(String(50), nullable=False, default="pending")

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    project = relationship(
        "GitProject",
        back_populates="runs",
    )