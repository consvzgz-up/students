"""Entrena el modelo que predice si un estudiante aprueba matemáticas.

1. Carga el CSV de entrenamiento
2. Convierte variables categóricas a numéricas (One-Hot Encoding)
3. Entrena un Random Forest Classifier
4. Evalúa el modelo
5. Guarda el pipeline completo como model/model.pkl

Uso (desde la carpeta ml-api):
    python scripts/train.py
"""

from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "data" / "StudentsPerformance.csv"
MODEL_PATH = ROOT / "model" / "model.pkl"

CATEGORICAL = ["gender", "ethnicity", "parental_education", "lunch", "test_prep"]
NUMERIC = ["reading_score", "writing_score"]
PASS_THRESHOLD = 60


def main():
    df = pd.read_csv(DATA_PATH)
    X = df[CATEGORICAL + NUMERIC]
    y = (df["math_score"] >= PASS_THRESHOLD).astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    pipeline = Pipeline([
        ("prep", ColumnTransformer([
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
            ("num", "passthrough", NUMERIC),
        ])),
        ("model", RandomForestClassifier(
            n_estimators=300, max_depth=8, min_samples_leaf=5, random_state=42
        )),
    ])
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
    print(classification_report(y_test, y_pred, target_names=["Reprueba", "Aprueba"]))

    # Reentrena con todos los datos antes de guardar
    pipeline.fit(X, y)
    MODEL_PATH.parent.mkdir(exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Modelo guardado en {MODEL_PATH}")


if __name__ == "__main__":
    main()
