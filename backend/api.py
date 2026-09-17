from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os

from src.pipeline import run_pipeline


app = FastAPI(
    title="Smart Regression Suite Optimizer",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

        selected_tests, exclusions,summary, coverage, recommendation, ai_explanations = run_pipeline(
            temp_path,
            change_description,
            time_budget,
        )

        return {
            "summary": summary,
            "selected_tests": selected_tests.to_dict(
                orient="records"
            ),
            "excluded_high_risk_tests": exclusions,
            "coverage": coverage,
            "recommendation": recommendation,
            "ai_explanations": ai_explanations,
        }

    finally:

        os.remove(temp_path)