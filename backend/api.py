from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException,
    Depends,
    Request,
)

from fastapi.middleware.cors import CORSMiddleware
from .github_webhook import router as github_webhook_router
from sqlalchemy.orm import Session
from . import git_models
from .git_routes import router as git_router
import tempfile
import os

from src.pipeline import run_pipeline

from backend.database import (
    Base,
    engine,
    get_db,
)

from backend import models

from backend.auth_routes import router as auth_router
from backend.history_routes import router as history_router

from backend.session import get_current_user

from backend.models import (
    RegressionRun,
    RegressionResult,
)


# ============================================================
# Create FastAPI application
# ============================================================

app = FastAPI(
    title="Smart Regression Suite Optimizer",
    version="1.0.0",
)


# ============================================================
# Create database tables
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# CORS configuration
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://smart-regression-suite-optimizer.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Register routers
# ============================================================

app.include_router(auth_router)
app.include_router(history_router)
app.include_router(github_webhook_router)
app.include_router(git_router)

# ============================================================
# Root endpoint
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Smart Regression Suite Optimizer API is running"
    }


# ============================================================
# Health check
# ============================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# ============================================================
# Regression Suite Optimization
# ============================================================

@app.post("/api/optimize")
async def optimize(
    request: Request,
    file: UploadFile = File(...),
    change_description: str = Form(...),
    time_budget: int = Form(...),
    db: Session = Depends(get_db),
):
    # --------------------------------------------------------
    # Check authentication
    # --------------------------------------------------------

    user = get_current_user(request, db)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated.",
        )

    # --------------------------------------------------------
    # Read uploaded CSV
    # --------------------------------------------------------

    file_contents = await file.read()

    # --------------------------------------------------------
    # Create temporary CSV file
    # --------------------------------------------------------

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".csv",
    ) as temp_file:

        temp_file.write(file_contents)
        temp_path = temp_file.name

    try:

        # ----------------------------------------------------
        # Run regression optimization pipeline
        # ----------------------------------------------------

        (
            selected_tests,
            exclusions,
            summary,
            coverage,
            recommendation,
            ai_explanations,
            risk_debt,
        ) = run_pipeline(
            temp_path,
            change_description,
            time_budget,
        )

        # ----------------------------------------------------
        # Calculate history values
        # ----------------------------------------------------

        selected_count = len(selected_tests)

        # The pipeline's summary contains the total test count
        # under whatever key it currently exposes.
        #
        # If total_tests is available, use it.
        # Otherwise calculate it from selected + excluded tests.
        total_tests = summary.get("total_tests")

        if total_tests is None:
            total_tests = (
                selected_count
                + len(exclusions)
            )

        execution_time = recommendation.get(
            "total_execution_time",
            0,
        )

        last_run = (
            db.query(RegressionRun.run_number)
            .filter(RegressionRun.user_id == user.id)
            .order_by(RegressionRun.run_number.desc())
            .first()
        )

        user_run_number = (last_run[0] + 1) if last_run else 1

        run = RegressionRun(
            user_id=user.id,
            run_number=user_run_number,
            change_description=change_description,
            time_budget=time_budget,
            total_tests=total_tests,
            selected_tests=selected_count,
            execution_time=execution_time,
        )

        db.add(run)

        # Save run first so MySQL generates run.id
        db.commit()
        db.refresh(run)

        # ----------------------------------------------------
        # Save selected tests
        # ----------------------------------------------------

        for _, test in selected_tests.iterrows():

            result = RegressionResult(
                run_id=run.id,
                test_id=str(test["test_id"]),
                module=str(test["module"]),
                duration=int(test["duration"]),
                priority_score=float(
                    test["priority_score"]
                ),
                relevance_score=float(
                    test["relevance_score"]
                ),
            )

            db.add(result)

        # Save selected test records
        db.commit()

        # ----------------------------------------------------
        # Return optimization result
        # ----------------------------------------------------

        return {
            "run_id": run.id,
            "run_number": run.run_number,

            "summary": summary,

            "selected_tests": selected_tests.to_dict(
                orient="records"
            ),

            "excluded_high_risk_tests": exclusions,

            "coverage": coverage,

            "recommendation": recommendation,

            "ai_explanations": ai_explanations,
            "risk_debt": risk_debt,
        }

    # --------------------------------------------------------
    # Validation errors
    # --------------------------------------------------------

    except ValueError as error:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    # --------------------------------------------------------
    # Database errors
    # --------------------------------------------------------

    except Exception:

        db.rollback()

        raise

    # --------------------------------------------------------
    # Always remove temporary CSV
    # --------------------------------------------------------

    finally:

        if os.path.exists(temp_path):
            os.remove(temp_path)