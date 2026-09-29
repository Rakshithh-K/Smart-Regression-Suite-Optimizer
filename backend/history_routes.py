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
                "run_number": run.run_number,
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

    import json

    result_data = {}
    if getattr(run, "result_json", None):
        try:
            result_data = json.loads(run.result_json)
        except Exception:
            result_data = {}

    results = (
        db.query(RegressionResult)
        .filter(
            RegressionResult.run_id == run.id
        )
        .all()
    )

    if result_data.get("selected_tests"):
        selected_tests_list = result_data["selected_tests"]
    else:
        selected_tests_list = [
            {
                "test_id": result.test_id,
                "module": result.module,
                "description": getattr(result, "description", None) or f"Regression test {result.test_id}",
                "priority": getattr(result, "priority", None) or ("High" if result.priority_score >= 70 else "Medium" if result.priority_score >= 40 else "Low"),
                "duration": result.duration,
                "tags": getattr(result, "tags", None) or "",
                "historical_failure_count": getattr(result, "historical_failure_count", 0) or 0,
                "priority_score": result.priority_score,
                "relevance_score": result.relevance_score,
            }
            for result in results
        ]

    return {
        "run": {
            "id": run.id,
            "run_number": run.run_number,
            "change_description": run.change_description,
            "time_budget": run.time_budget,
            "total_tests": run.total_tests,
            "selected_tests": run.selected_tests,
            "execution_time": run.execution_time,
            "created_at": run.created_at.isoformat(),
        },

        "selected_tests": selected_tests_list,
        "ai_explanations": result_data.get("ai_explanations", {}),
        "summary": result_data.get("summary", {}),
        "coverage": result_data.get("coverage", {}),
        "risk_debt": result_data.get("risk_debt", {}),
    }