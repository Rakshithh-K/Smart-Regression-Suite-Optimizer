from fastapi import FastAPI, UploadFile, File, Form
import tempfile
import os

from src.pipeline import run_pipeline


app = FastAPI(
    title="Smart Regression Suite Optimizer",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "Smart Regression Suite Optimizer API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/api/optimize")
async def optimize(
    file: UploadFile = File(...),
    change_description: str = Form(...),
    time_budget: int = Form(...),
):
    file_contents = await file.read()

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".csv",
    ) as temp_file:

        temp_file.write(file_contents)
        temp_path = temp_file.name

    try:

        selected_tests, exclusions, coverage, recommendation = run_pipeline(
            temp_path,
            change_description,
            time_budget,
        )

        return {
            "selected_tests": selected_tests.to_dict(
                orient="records"
            ),
            "excluded_high_risk_tests": exclusions,
            "coverage": coverage,
            "recommendation": recommendation,
        }

    finally:

        os.remove(temp_path)