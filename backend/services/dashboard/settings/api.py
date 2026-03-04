import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3]))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import main as settings

app = FastAPI(title="Settings API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# ── Request Models ────────────────────────────────────────────────────────────

class UpdateSettings(BaseModel):
    theme:                 Optional[str]  = None
    notifications_enabled: Optional[bool] = None
    email_updates:         Optional[bool] = None
    language:              Optional[str]  = None
    account_deleted:       Optional[bool] = None


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.post("/settings/{user_id}")
def create_settings(user_id: str):
    try:
        return settings.create_settings(user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/settings/{user_id}")
def get_settings(user_id: str):
    try:
        result = settings.get_settings(user_id)
        if not result:
            raise HTTPException(status_code=404, detail="Settings not found")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.patch("/settings/{user_id}")
def update_settings(user_id: str, body: UpdateSettings):
    fields = {k: v for k, v in body.model_dump().items() if v is not None}
    try:
        result = settings.update_settings(user_id, fields)
        if not result:
            raise HTTPException(status_code=404, detail="Settings not found")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/settings/{user_id}")
def delete_settings(user_id: str):
    try:
        deleted = settings.delete_settings(user_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Settings not found")
        return {"message": "Settings deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
