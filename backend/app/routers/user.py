from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_db

router = APIRouter(prefix="/user", tags=["User"])


@router.post("/apply", response_model=schemas.ApplicationOut, status_code=201)
def apply_for_loan(
    payload: schemas.ApplicationCreate, db: Session = Depends(get_db)
):
    # Basic duplication check on PAN + Aadhaar
    existing = (
        db.query(models.Application)
        .filter(
            models.Application.pan == payload.pan,
            models.Application.aadhaar == payload.aadhaar,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An application already exists for this PAN + Aadhaar.",
        )

    application = models.Application(
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        pan=payload.pan,
        aadhaar=payload.aadhaar,
        age=payload.age,
        monthly_income=payload.monthly_income,
        existing_emi=payload.existing_emi,
        requested_loan_amount=payload.requested_loan_amount,
        requested_tenure_months=payload.requested_tenure_months,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application
