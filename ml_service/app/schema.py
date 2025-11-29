from pydantic import BaseModel, Field


class MLInput(BaseModel):
    age: int = Field(ge=18, le=80)
    monthly_income: float = Field(gt=0)
    existing_emi: float = Field(ge=0)
    requested_loan_amount: float = Field(gt=0)
    requested_tenure_months: int = Field(ge=6, le=360)


class MLOutput(BaseModel):
    cibil_score: int
    risk_label: str
    default_probability: float
