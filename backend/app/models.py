from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.orm import relationship

from .database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(20), nullable=False)

    pan = Column(String(20), nullable=False)
    aadhaar = Column(String(20), nullable=False)

    age = Column(Integer, nullable=False)
    monthly_income = Column(Float, nullable=False)
    existing_emi = Column(Float, nullable=False, default=0.0)
    requested_loan_amount = Column(Float, nullable=False)
    requested_tenure_months = Column(Integer, nullable=False)

    # Outputs from ML service
    cibil_score = Column(Integer, nullable=True)
    risk_label = Column(String(20), nullable=True)
    default_probability = Column(Float, nullable=True)

    # Flags
    is_verified = Column(Boolean, default=False)        # Banker verified KYC/data
    analysis_run = Column(Boolean, default=False)       # ML analysis executed
    approved = Column(Boolean, default=False)           # Banker approval decision
