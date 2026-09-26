from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.model_store import get_model
from app.routes import predict

app = FastAPI(title="EduInsights ML API", version="1.0.0")

# allow_origins=["*"] para desarrollo; en producción limita a tu dominio de Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)


@app.get("/")
def root():
    return {"service": "EduInsights ML API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": get_model() is not None}
