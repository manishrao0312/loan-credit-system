import os
from pathlib import Path

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score
from sklearn.ensemble import GradientBoostingClassifier

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "application_train.csv"
MODEL_DIR = BASE_DIR / "app" / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = Path(os.getenv("ML_MODEL_PATH", MODEL_DIR / "home_credit_model.joblib"))


def load_data() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Expected Home Credit dataset at {DATA_PATH}. "
            "Download application_train.csv from Kaggle and place it there."
        )
    df = pd.read_csv(DATA_PATH)
    return df


def preprocess(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series, list[str]]:
    # Use a small subset of numeric features
    feature_names = [
        "AMT_INCOME_TOTAL",
        "AMT_CREDIT",
        "AMT_ANNUITY",
        "DAYS_BIRTH",
        "DAYS_EMPLOYED",
    ]

    # Drop rows with missing values in these columns or TARGET
    df_clean = df[feature_names + ["TARGET"]].dropna()

    X = df_clean[feature_names]
    y = df_clean["TARGET"].astype(int)
    return X, y, feature_names


def train():
    print("Loading data...")
    df = load_data()
    print(f"Loaded dataset with shape: {df.shape}")

    X, y, feature_names = preprocess(df)
    print(f"After preprocessing: X={X.shape}, y={y.shape}")

    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Training GradientBoostingClassifier...")
    model = GradientBoostingClassifier(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=3,
        random_state=42,
    )
    model.fit(X_train, y_train)

    y_val_pred_proba = model.predict_proba(X_val)[:, 1]
    auc = roc_auc_score(y_val, y_val_pred_proba)
    print(f"Validation ROC-AUC: {auc:.4f}")

    bundle = {
        "model": model,
        "feature_names": feature_names,
    }

    joblib.dump(bundle, MODEL_PATH)
    print(f"Saved model to {MODEL_PATH}")


if __name__ == "__main__":
    train()
