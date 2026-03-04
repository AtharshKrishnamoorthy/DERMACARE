import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import os
from PIL import Image
import main as identification

app = FastAPI(
    title="Identification API",
    description="API for skin disease identification, powered by a TensorFlow model and Gemini AI.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# ── Response Models ───────────────────────────────────────────────────────────

class PredictResponse(BaseModel):
    predicted_disease: str

class PredictDescribeResponse(BaseModel):
    predicted_disease: str
    description: str


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "Welcome to the DermaCare Identification API!"}


@app.post("/predict", response_model=PredictResponse)
async def predict(file: UploadFile = File(...)):
    """Predict the skin disease from an uploaded image."""
    ext = os.path.splitext(file.filename)[-1] or ".jpg"
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        image = Image.open(tmp_path).convert("RGB")
        disease = identification.predict(image)
        return PredictResponse(predicted_disease=disease)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@app.post("/predict-and-describe", response_model=PredictDescribeResponse)
async def predict_and_describe(user_id: str, file: UploadFile = File(...)):
    """Predict the skin disease and return an AI-generated description."""
    ext = os.path.splitext(file.filename)[-1] or ".jpg"
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        image = Image.open(tmp_path).convert("RGB")
        result = identification.predict_and_describe(image, user_id)
        return PredictDescribeResponse(**result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
