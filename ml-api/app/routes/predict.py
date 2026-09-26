from typing import Literal

import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.model_store import get_model

router = APIRouter()


class StudentInput(BaseModel):
    gender: Literal["male", "female"]
    ethnicity: Literal["group A", "group B", "group C", "group D", "group E"]
    parental_education: Literal[
        "some high school",
        "high school",
        "some college",
        "associate's degree",
        "bachelor's degree",
        "master's degree",
    ]
    lunch: Literal["standard", "free/reduced"]
    test_prep: Literal["completed", "none"]
    reading_score: float = Field(ge=0, le=100)
    writing_score: float = Field(ge=0, le=100)


class Probabilities(BaseModel):
    # "pass" es palabra reservada en Python, por eso el alias
    pass_: float = Field(alias="pass", serialization_alias="pass")
    fail: float


class PredictionOutput(BaseModel):
    prediction: Literal[0, 1]
    label: Literal["Aprueba", "Reprueba"]
    confidence: float
    probabilities: Probabilities


@router.post("/predict", response_model=PredictionOutput, response_model_by_alias=True)
def predict(student: StudentInput):
    model = get_model()
    if model is None:
        raise HTTPException(status_code=503, detail="Modelo no disponible")

    X = pd.DataFrame([student.model_dump()])
    proba_fail, proba_pass = model.predict_proba(X)[0]
    prediction = int(proba_pass >= 0.5)

    return PredictionOutput(
        prediction=prediction,
        label="Aprueba" if prediction == 1 else "Reprueba",
        confidence=round(float(max(proba_pass, proba_fail)), 4),
        probabilities=Probabilities(**{"pass": round(float(proba_pass), 4), "fail": round(float(proba_fail), 4)}),
    )
