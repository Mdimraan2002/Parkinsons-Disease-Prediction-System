"""
=========================================================
🏥 Parkinson's Disease Prediction API
=========================================================
Technology  : FastAPI + Scikit-learn (SVC)

Description:
This FastAPI backend predicts Parkinson's Disease using
voice biomarkers and a Support Vector Classifier (SVC).

⚠️ Medical Disclaimer:
This application is developed strictly for educational
and academic purposes. It is NOT a medical diagnostic
tool and must not be used for real medical decisions.

© 2026 Mohamed Imraan. All rights reserved.
=========================================================
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

# -------------------------------------------------------
# FastAPI App Initialization
# -------------------------------------------------------
app = FastAPI(
    title="Parkinson's Disease Prediction API",
    description="AI-powered API for Parkinson's disease prediction using voice biomarkers",
    version="1.0.0"
)

# -------------------------------------------------------
# CORS Configuration
# -------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------
# Input Schema
# -------------------------------------------------------
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

# -------------------------------------------------------
# Global ML Objects
# -------------------------------------------------------
model: SVC | None = None
scaler = StandardScaler()

MODEL_PATH = "models/parkinsons_model.pkl"
SCALER_PATH = "models/scaler.pkl"

# -------------------------------------------------------
# Model Training (Synthetic Data)
# -------------------------------------------------------
def train_model():
    global model, scaler

    np.random.seed(42)
    samples = 300

    healthy = np.random.normal(0, 1, (samples // 2, 22))
    parkinsons = np.random.normal(0, 1, (samples // 2, 22))

    X = np.vstack((healthy, parkinsons))
    y = np.array([0] * (samples // 2) + [1] * (samples // 2))

    scaler.fit(X)
    X_scaled = scaler.transform(X)

    model = SVC(kernel="rbf", probability=True, random_state=42)
    model.fit(X_scaled, y)

    os.makedirs("models", exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

# -------------------------------------------------------
# Load Model
# -------------------------------------------------------
def load_model():
    global model, scaler

    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
    else:
        train_model()

# -------------------------------------------------------
# Startup Event
# -------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    load_model()
    print("✅ Model and scaler ready")

# -------------------------------------------------------
# Routes
# -------------------------------------------------------
@app.get("/")
async def root():
    return {
        "api": "Parkinson's Disease Prediction API",
        "status": "running",
        "docs": "/docs",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/predict")
async def predict(data: ParkinsonsInput) -> Dict:
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    features = np.array([[
        data.mdvp_fo,
        data.mdvp_fhi,
        data.mdvp_flo,
        data.mdvp_jitter_percent,
        data.mdvp_jitter_abs,
        data.mdvp_rap,
        data.mdvp_ppq,
        data.jitter_ddp,
        data.mdvp_shimmer,
        data.mdvp_shimmer_db,
        data.shimmer_apq3,
        data.shimmer_apq5,
        data.mdvp_apq,
        data.shimmer_dda,
        data.nhr,
        data.hnr,
        data.rpde,
        data.dfa,
        data.spread1,
        data.spread2,
        data.d2,
        data.ppe
    ]])

    scaled = scaler.transform(features)
    prediction = model.predict(scaled)[0]
    probability = model.predict_proba(scaled)[0]

    return {
        "prediction": "Parkinson's Disease" if prediction == 1 else "Healthy",
        "confidence": round(float(max(probability)) * 100, 2),
        "probability_healthy": round(float(probability[0]) * 100, 2),
        "probability_parkinsons": round(float(probability[1]) * 100, 2),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    }

# -------------------------------------------------------
# Run Server
# -------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
