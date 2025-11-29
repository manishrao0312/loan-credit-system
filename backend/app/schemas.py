from pydantic import BaseModel, Field, EmailStr, constr
from typing import Optional


PANType = constr(pattern=r"^[A-Z]{5}[0-9]{4}[A-Z]$", to_upper=True)
AadhaarType = constr(pattern=r"^[0-9]{12}$")
PhoneType = constr(pattern=r"^[6-9][0-9]{9}$")


class ApplicationCreate(BaseModel):
    full_name: str = Field(min_length=3, max_length=255)
    email: EmailStr
    phone: PhoneType

    pan: PANType
    aadhaar: AadhaarType

    age: int = Field(ge=18, le=80)
    monthly_income: float = Field(gt=0)
    existing_emi: float = Field(ge=0)
    requested_loan_amount: float = Field(gt=0)
    requested_tenure_months: int = Field(ge=6, le=360)


class ApplicationBaseOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str
    pan: str
    aadhaar: str
    age: int
    monthly_income: float
    existing_emi: float
    requested_loan_amount: float
    requested_tenure_months: int

    class Config:
        from_attributes = True


class ApplicationOut(ApplicationBaseOut):
    cibil_score: Optional[int] = None
    risk_label: Optional[str] = None
    default_probability: Optional[float] = None
    is_verified: bool
    analysis_run: bool
    approved: bool


class BankerVerifyRequest(BaseModel):
    is_verified: bool


class BankerDecisionRequest(BaseModel):
    approved: bool


class MLAnalysisResponse(BaseModel):
    cibil_score: int
    risk_label: str
    default_probability: float
