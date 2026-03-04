import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3]))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import main as chats

app = FastAPI(title="Chats API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# ── Request Models ────────────────────────────────────────────────────────────

class AddChat(BaseModel):
    user_id:  str
    message:  str
    response: Optional[str] = None

class UpdateChat(BaseModel):
    message:  Optional[str] = None
    response: Optional[str] = None


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.post("/chats")
def add_chat(body: AddChat):
    try:
        return chats.add_chat(body.user_id, body.message, body.response)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/chats")
def get_all_chats():
    try:
        return chats.get_all_chats()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/chats/user/{user_id}")
def get_user_chats(user_id: str):
    try:
        return chats.get_user_chats(user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.patch("/chats/{chat_id}")
def update_chat(chat_id: str, body: UpdateChat):
    try:
        chat = chats.update_chat(chat_id, body.message, body.response)
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        return chat
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/chats/{chat_id}")
def delete_chat(chat_id: str):
    try:
        deleted = chats.delete_chat(chat_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Chat not found")
        return {"message": "Chat deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
