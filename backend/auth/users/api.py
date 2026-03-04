from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sys
import pathlib
import os 


# Path import
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))

import users.main as users


# Create FastAPI instance


app = FastAPI(
    title="Users API",
    version="1.0.0"
)


# CORS 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# Request Models 

class CreateUser(BaseModel):
    name: str
    email: str
    phone: str
    password: str


class UpdateUser(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

# Endpoints

@app.post("/app/create")
def create_user(body: CreateUser):

    try :
        user = users.create_user(
            body.name,
            body.email,
            body.phone,
            body.password
        )
        return user
    except Exception as e:
        raise HTTPException(400, f"Error creating user: {e}")


@app.get("/app/email/{email}")
def get_user_by_email(email: str):
    try:
        user = users.get_user_by_email(email)
        if not user:
            raise HTTPException(404, "User not found")
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(400, f"Error fetching user: {e}")


@app.get("/app/{user_id}")
def get_user(user_id: str):
    try:
        user = users.get_user(user_id)
        if not user:
            raise HTTPException(404, "User not found")
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(400, f"Error fetching user: {e}")


@app.patch("/app/{user_id}")
def update_user(user_id: str, body: UpdateUser):

    fields = {
        k: v for k, v in body.model_dump().items()
        if v is not None
    }

    try:
        user = users.update_user(user_id, fields)
        if not user:
            raise HTTPException(404, "User not found")
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(400, f"Error updating user: {e}")


@app.delete("/app/{user_id}")
def delete_user(user_id: str):

    try:
        deleted = users.delete_user(user_id)
        if not deleted:
            raise HTTPException(404, "User not found")
        return {"message": "User deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(400, f"Error deleting user: {e}")