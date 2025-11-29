from fastapi import FastAPI

from .schema import MLInput, MLOutput
from .model import get_model

app = FastAPI(
    title="ML Credit Scoring Service",
    version="1.0.0",
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze", response_model=MLOutput)
def analyze(payload: MLInput):
    model = get_model()
    result = model.predict(payload)
    return MLOutput(
        cibil_score=result["cibil_score"],
        risk_label=result["risk_label"],
        default_probability=result["default_probability"],
    )
