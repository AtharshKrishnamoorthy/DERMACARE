from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel 
import sys 
import pathlib
import os

# Path import – must happen before any local package imports
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))

from auth.main import signup_user, signin_user

# Creating a FastAPI instance

app = FastAPI(
    title="Dermacare Auth API",
    description="API for user authentication in the Dermacare application.",
)

# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Creating a pydantic model for user authentication

class SignupRequest(BaseModel):
    name:     str
    email:    str
    phone:    str
    password: str

class SigninRequest(BaseModel):
    email:    str
    password: str


# Creating endpoints for signup and signin

@app.post("/signup")
def signup(body: SignupRequest):
    try:
        response = signup_user(body.name, body.email, body.phone, body.password)

        if response.get("error"):
            raise HTTPException(status_code=400, detail=response["error"])

        return {
            "message": "Signup successful. Check your email to confirm.",
            "user_id": response["user"].id if response["user"] else None,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@app.post("/signin")
def signin(body: SigninRequest):
    try:
        response = signin_user(
            body.email,
            body.password
        )

        if response is not None:

            session = response["session"]
            
            return {
            "access_token":  session.access_token,
            "refresh_token": session.refresh_token,
            "token_type":    "bearer",
            "user_id":       response["user"].id if response["user"] else None,
            }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))