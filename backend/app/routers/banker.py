from typing import List

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_db
from ..config import settings

router = APIRouter(prefix="/banker", tags=["Banker"])


@router.get("/applications", response_model=List[schemas.ApplicationOut])
def list_applications(db: Session = Depends(get_db)):
    return db.query(models.Application).order_by(models.Application.id.desc()).all()


@router.get(
    "/applications/{application_id}", response_model=schemas.ApplicationOut
)
def get_application(application_id: int, db: Session = Depends(get_db)):
    app = db.get(models.Application, application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@router.post(
    "/applications/{application_id}/verify",
    response_model=schemas.ApplicationOut,
)
def verify_application(
    application_id: int,
    payload: schemas.BankerVerifyRequest,
    db: Session = Depends(get_db),
):
    app = db.get(models.Application, application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.is_verified = payload.is_verified
    db.commit()
    db.refresh(app)
    return app


@router.post(
    "/applications/{application_id}/analyze",
    response_model=schemas.ApplicationOut,
)
def analyze_application(
    application_id: int, db: Session = Depends(get_db)
):
    app = db.get(models.Application, application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if not app.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application must be verified before analysis.",
        )

    # Prepare payload for ML service
    ml_payload = {
        "age": app.age,
        "monthly_income": app.monthly_income,
        "existing_emi": app.existing_emi,
        "requested_loan_amount": app.requested_loan_amount,
        "requested_tenure_months": app.requested_tenure_months,
    }

    ml_url = f"{settings.ml_service_url}/analyze"

    try:
        response = httpx.post(ml_url, json=ml_payload, timeout=10.0)
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to reach ML service: {exc}",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"ML service error: {response.text}",
        )

    ml_result = schemas.MLAnalysisResponse.model_validate(response.json())

    app.cibil_score = ml_result.cibil_score
    app.risk_label = ml_result.risk_label
    app.default_probability = ml_result.default_probability
    app.analysis_run = True

    db.commit()
    db.refresh(app)
    return app


@router.post(
    "/applications/{application_id}/decision",
    response_model=schemas.ApplicationOut,
)
def decide_application(
    application_id: int,
    payload: schemas.BankerDecisionRequest,
    db: Session = Depends(get_db),
):
    app = db.get(models.Application, application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if not app.analysis_run:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Run analysis before taking decision.",
        )

    app.approved = payload.approved
    db.commit()
    db.refresh(app)
    return app
