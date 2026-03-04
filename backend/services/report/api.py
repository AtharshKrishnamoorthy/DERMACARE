from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import os
from main import analyze_report

# Creating FastAPI instance

app = FastAPI(
    title="Report API",
    description="API for the DermaCare AI report analysis, built with LangGraph and Google Gemini.",
)

# CORS Middleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Response Model

class ReportResponse(BaseModel):
    response: dict


# Endpoints

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "Welcome to the DermaCare AI Report Analysis API!"}


@app.post("/analyze", response_model=ReportResponse)
async def analyze_report_endpoint(file: UploadFile = File(...)):
    
    ext = os.path.splitext(file.filename)[-1] or ".tmp"

    try:
    
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

     
        response = analyze_report(tmp_path)
        return ReportResponse(response=response.model_dump())

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


