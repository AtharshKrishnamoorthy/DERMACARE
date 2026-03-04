import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3]))

from db.database import SessionLocal
from db.models import Chat


def add_chat(user_id: str, message: str, response: str = None):
    db = SessionLocal()
    try:
        chat = Chat(user_id=user_id, message=message, response=response)
        db.add(chat)
        db.commit()
        db.refresh(chat)
        return chat
    finally:
        db.close()


def get_all_chats():
    db = SessionLocal()
    try:
        return db.query(Chat).order_by(Chat.created_at.desc()).all()
    finally:
        db.close()


def get_user_chats(user_id: str):
    db = SessionLocal()
    try:
        return (
            db.query(Chat)
            .filter(Chat.user_id == user_id)
            .order_by(Chat.created_at.asc())
            .all()
        )
    finally:
        db.close()


def update_chat(chat_id: str, message: str = None, response: str = None):
    db = SessionLocal()
    try:
        chat = db.query(Chat).filter(Chat.id == chat_id).first()
        if not chat:
            return None
        if message is not None:
            chat.message = message
        if response is not None:
            chat.response = response
        db.commit()
        db.refresh(chat)
        return chat
    finally:
        db.close()


def delete_chat(chat_id: str):
    db = SessionLocal()
    try:
        chat = db.query(Chat).filter(Chat.id == chat_id).first()
        if not chat:
            return False
        db.delete(chat)
        db.commit()
        return True
    finally:
        db.close()
