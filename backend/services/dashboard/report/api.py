import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3]))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import main as reports

app = FastAPI(title="Reports API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# ── Request Models ────────────────────────────────────────────────────────────

class AddReport(BaseModel):
    user_id:   str
    file_url:  str
    file_type: str
    analysis:  Optional[str] = None


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.post("/reports")
def add_report(body: AddReport):
    try:
        return reports.add_report(body.user_id, body.file_url, body.file_type, body.analysis)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/reports")
def get_all_reports():
    try:
        return reports.get_all_reports()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/reports/user/{user_id}")
def get_user_reports(user_id: str):
    try:
        return reports.get_user_reports(user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/reports/{report_id}")
def get_report(report_id: str):
    try:
        report = reports.get_report(report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/reports/{report_id}")
def delete_report(report_id: str):
    try:
        deleted = reports.delete_report(report_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Report not found")
        return {"message": "Report deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
