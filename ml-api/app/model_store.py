from functools import lru_cache
from pathlib import Path

import joblib

MODEL_PATH = Path(__file__).resolve().parent.parent / "model" / "model.pkl"


@lru_cache(maxsize=1)
def _load():
    return joblib.load(MODEL_PATH)


def get_model():
    """Devuelve el pipeline entrenado, o None si model.pkl no existe o no carga."""
    try:
        return _load()
    except Exception:
        return None
