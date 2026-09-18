from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.session import get_current_user
from backend.models import RegressionRun, RegressionResult


router = APIRouter(
    prefix="/api/history",
    tags=["History"],
)


# ============================================================
# Get user's optimization history
# ============================================================

@router.get("")
def get_history(
    request: Request,
    db: Session = Depends(get_db),
):
    user = get_current_user(request, db)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated.",
        )

    runs = (
        db.query(RegressionRun)
        .filter(
            RegressionRun.user_id == user.id
        )
        .order_by(
            RegressionRun.created_at.desc()
        )
        .all()
    )

    return {
        "history": [
            {
                "id": run.id,
                "change_description": run.change_description,
                "time_budget": run.time_budget,
                "total_tests": run.total_tests,
                "selected_tests": run.selected_tests,
                "execution_time": run.execution_time,
                "created_at": run.created_at.isoformat(),
            }
            for run in runs
        ]
    }


# ============================================================
# Get detailed optimization run
# ============================================================

@router.get("/{run_id}")
def get_history_detail(
    run_id: int,
    request: Request,
    db: Session = Depends(get_db),
):
    user = get_current_user(request, db)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated.",
        )

    # --------------------------------------------------------
    # Find run belonging to current user
    # --------------------------------------------------------

    run = (
        db.query(RegressionRun)
        .filter(
            RegressionRun.id == run_id,
            RegressionRun.user_id == user.id,
        )
        .first()
    )

    if not run:
        raise HTTPException(
            status_code=404,
            detail="Regression run not found.",
        )

    # --------------------------------------------------------
    # Get selected tests
    # --------------------------------------------------------

    results = (
        db.query(RegressionResult)
        .filter(
            RegressionResult.run_id == run.id
        )
        .all()
    )

    return {
        "run": {
            "id": run.id,
            "change_description": run.change_description,
            "time_budget": run.time_budget,
            "total_tests": run.total_tests,
            "selected_tests": run.selected_tests,
            "execution_time": run.execution_time,
            "created_at": run.created_at.isoformat(),
        },

        "selected_tests": [
            {
                "test_id": result.test_id,
                "module": result.module,
                "duration": result.duration,
                "priority_score": result.priority_score,
                "relevance_score": result.relevance_score,
            }
            for result in results
        ],
    }