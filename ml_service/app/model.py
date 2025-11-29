import os
from pathlib import Path
from typing import Dict

import joblib
import numpy as np

from .schema import MLInput

MODEL_PATH = Path(os.getenv("ML_MODEL_PATH", "/app/app/models/home_credit_model.joblib"))


class CreditModel:
    def __init__(self) -> None:
        if not MODEL_PATH.exists():
            raise RuntimeError(
                f"Model file not found at {MODEL_PATH}. Train the model first."
            )
        bundle = joblib.load(MODEL_PATH)
        self.model = bundle["model"]
        self.feature_names = bundle["feature_names"]

    def _build_feature_vector(self, payload: MLInput) -> np.ndarray:
        """
        Map our API payload to feature vector compatible with trained model.
        """

        # Age in Home Credit is DAYS_BIRTH (negative, in days)
        days_birth = -int(payload.age * 365.25)

        # Very rough annuity estimation: EMI assumed as existing_emi + implied EMI on this loan
        # You can refine this macro as you like.
        total_emi = payload.existing_emi + (
            payload.requested_loan_amount / max(payload.requested_tenure_months, 1)
        )

        # We don't have DAYS_EMPLOYED from user; use a neutral constant
        days_employed = -365 * 5  # assume 5 years employed

        # Map our simplified values into the feature dict
        features: Dict[str, float] = {
            "AMT_INCOME_TOTAL": payload.monthly_income * 12.0,
            "AMT_CREDIT": payload.requested_loan_amount,
            "AMT_ANNUITY": total_emi,
            "DAYS_BIRTH": days_birth,
            "DAYS_EMPLOYED": days_employed,
        }

        # Create ordered feature vector
        vec = [features[name] for name in self.feature_names]
        return np.array(vec, dtype=float).reshape(1, -1)

    def predict(self, payload: MLInput) -> Dict[str, float | int | str]:
        x = self._build_feature_vector(payload)
        prob_default = float(self.model.predict_proba(x)[0, 1])

        # Map probability -> pseudo CIBIL score (300–900)
        cibil_score = int(900 - prob_default * 600)  # prob 0 -> 900, prob 1 -> 300

        if prob_default < 0.2:
            risk_label = "Low"
        elif prob_default < 0.5:
            risk_label = "Medium"
        else:
            risk_label = "High"

        return {
            "default_probability": prob_default,
            "cibil_score": cibil_score,
            "risk_label": risk_label,
        }


credit_model: CreditModel | None = None


def get_model() -> CreditModel:
    global credit_model
    if credit_model is None:
        credit_model = CreditModel()
    return credit_model
