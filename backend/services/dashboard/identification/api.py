import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3]))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import main as identifications

app = FastAPI(title="Identification API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# ── Request Models ────────────────────────────────────────────────────────────

class AddIdentification(BaseModel):
    user_id:          str
    image_url:        str
    predicted_disease: str
    model_response:   Optional[str] = None


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.post("/identifications")
def add_identification(body: AddIdentification):
    try:
        return identifications.add_identification(
            body.user_id,
            body.image_url,
            body.predicted_disease,
            body.model_response
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/identifications")
def get_all_identifications():
    try:
        return identifications.get_all_identifications()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/identifications/user/{user_id}")
def get_user_identifications(user_id: str):
    try:
        return identifications.get_user_identifications(user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/identifications/{identification_id}")
def get_identification(identification_id: str):
    try:
        record = identifications.get_identification(identification_id)
        if not record:
            raise HTTPException(status_code=404, detail="Identification not found")
        return record
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/identifications/{identification_id}")
def delete_identification(identification_id: str):
    try:
        deleted = identifications.delete_identification(identification_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Identification not found")
        return {"message": "Identification deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
