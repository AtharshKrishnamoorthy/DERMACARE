import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3]))

from db.database import SessionLocal
from db.models import Setting


def create_settings(user_id: str):
    db = SessionLocal()
    try:
        settings = Setting(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
        return settings
    finally:
        db.close()


def get_settings(user_id: str):
    db = SessionLocal()
    try:
        return db.query(Setting).filter(Setting.user_id == user_id).first()
    finally:
        db.close()


def update_settings(user_id: str, fields: dict):
    db = SessionLocal()
    try:
        settings = db.query(Setting).filter(Setting.user_id == user_id).first()
        if not settings:
            return None
        for key, value in fields.items():
            setattr(settings, key, value)
        db.commit()
        db.refresh(settings)
        return settings
    finally:
        db.close()


def delete_settings(user_id: str):
    db = SessionLocal()
    try:
        settings = db.query(Setting).filter(Setting.user_id == user_id).first()
        if not settings:
            return False
        db.delete(settings)
        db.commit()
        return True
    finally:
        db.close()
