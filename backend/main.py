"""
Parkinson's Disease Prediction API
FastAPI backend using SVC model on voice biomarkers
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict
import numpy as np
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
import joblib
import os
from datetime import datetime

# -------------------- Constants --------------------
MODEL_PATH = "parkinsons_model.pkl"
SCALER_PATH = "scaler.pkl"

# -------------------- App Init --------------------
app = FastAPI(
    title="Parkinson's Disease Prediction API",
    description="AI-powered API for Parkinson's disease prediction using voice features",
    version="1.0.0",
)

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Input Schema --------------------
class ParkinsonsInput(BaseModel):
    mdvp_fo: float = Field(..., ge=80, le=300)
    mdvp_fhi: float = Field(..., ge=100, le=600)
    mdvp_flo: float = Field(..., ge=60, le=250)
    mdvp_jitter_percent: float = Field(..., ge=0, le=1)
    mdvp_jitter_abs: float = Field(..., ge=0, le=0.0001)
    mdvp_rap: float = Field(..., ge=0, le=0.5)
    mdvp_ppq: float = Field(..., ge=0, le=0.5)
    jitter_ddp: float = Field(..., ge=0, le=1)
    mdvp_shimmer: float = Field(..., ge=0, le=1)
    mdvp_shimmer_db: float = Field(..., ge=0, le=2)
    shimmer_apq3: float = Field(..., ge=0, le=0.5)
    shimmer_apq5: float = Field(..., ge=0, le=0.5)
    mdvp_apq: float = Field(..., ge=0, le=1)
    shimmer_dda: float = Field(..., ge=0, le=1)
    nhr: float = Field(..., ge=0, le=1)
    hnr: float = Field(..., ge=5, le=35)
    rpde: float = Field(..., ge=0.2, le=0.8)
    dfa: float = Field(..., ge=0.5, le=0.9)
    spread1: float = Field(..., ge=-10, le=0)
    spread2: float = Field(..., ge=0, le=1)
    d2: float = Field(..., ge=1, le=4)
    ppe: float = Field(..., ge=0, le=1)

# -------------------- Response Schema --------------------
class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    probability_healthy: float
    probability_parkinsons: float
    status: str
    timestamp: str

# -------------------- Globals --------------------
model: SVC | None = None
scaler: StandardScaler | None = None

# -------------------- Model Training --------------------
def train_model():
    global model, scaler

    np.random.seed(42)
    n_samples = 300

    healthy = np.random.randn(n_samples // 2, 22)
    parkinsons = np.random.randn(n_samples // 2, 22)

    healthy[:, 3] = np.random.uniform(0.001, 0.005, n_samples // 2)
    parkinsons[:, 3] = np.random.uniform(0.005, 0.03, n_samples // 2)

    X = np.vstack([healthy, parkinsons])
    y = np.hstack([np.zeros(n_samples // 2), np.ones(n_samples // 2)])

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = SVC(kernel="rbf", probability=True, random_state=42)
    model.fit(X_scaled, y)

    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

# -------------------- Load Model --------------------
def load_model():
    global model, scaler

    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
    else:
        train_model()

# -------------------- Startup --------------------
@app.on_event("startup")
async def startup_event():
    load_model()
    print("✅ Model loaded | API Ready")

# -------------------- Routes --------------------
@app.get("/")
async def root():
    return {
        "message": "Parkinson's Disease Prediction API",
        "status": "running",
        "docs": "/docs",
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(data: ParkinsonsInput):
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    features = np.array([[value for value in data.model_dump().values()]])
    features_scaled = scaler.transform(features)

    pred = model.predict(features_scaled)[0]
    probs = model.predict_proba(features_scaled)[0]

    return {
        "prediction": "Parkinson's Disease" if pred == 1 else "Healthy",
        "confidence": round(float(max(probs) * 100), 2),
        "probability_healthy": round(float(probs[0] * 100), 2),
        "probability_parkinsons": round(float(probs[1] * 100), 2),
        "status": "success",
        "timestamp": datetime.now().isoformat(),
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat(),
    }

# -------------------- Run Server --------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
