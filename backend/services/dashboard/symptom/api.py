import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3]))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import main as symptoms

app = FastAPI(title="Symptoms API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# ── Request Models ────────────────────────────────────────────────────────────

class AddSymptom(BaseModel):
    user_id:     str
    description: str


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.post("/symptoms")
def add_symptom(body: AddSymptom):
    try:
        return symptoms.add_symptom(body.user_id, body.description)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/symptoms")
def get_all_symptoms():
    try:
        return symptoms.get_all_symptoms()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/symptoms/user/{user_id}")
def get_user_symptoms(user_id: str):
    try:
        return symptoms.get_user_symptoms(user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/symptoms/{symptom_id}")
def get_symptom(symptom_id: str):
    try:
        symptom = symptoms.get_symptom(symptom_id)
        if not symptom:
            raise HTTPException(status_code=404, detail="Symptom not found")
        return symptom
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/symptoms/{symptom_id}")
def delete_symptom(symptom_id: str):
    try:
        deleted = symptoms.delete_symptom(symptom_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Symptom not found")
        return {"message": "Symptom deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
