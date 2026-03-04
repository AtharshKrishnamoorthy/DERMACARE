import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3]))

from db.database import SessionLocal
from db.models import Identification


def add_identification(user_id: str, image_url: str, predicted_disease: str, model_response: str = None):
    db = SessionLocal()
    try:
        record = Identification(
            user_id=user_id,
            image_url=image_url,
            predicted_disease=predicted_disease,
            model_response=model_response
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record
    finally:
        db.close()


def get_all_identifications():
    db = SessionLocal()
    try:
        return db.query(Identification).order_by(Identification.created_at.desc()).all()
    finally:
        db.close()


def get_user_identifications(user_id: str):
    db = SessionLocal()
    try:
        return (
            db.query(Identification)
            .filter(Identification.user_id == user_id)
            .order_by(Identification.created_at.desc())
            .all()
        )
    finally:
        db.close()


def get_identification(identification_id: str):
    db = SessionLocal()
    try:
        return db.query(Identification).filter(Identification.id == identification_id).first()
    finally:
        db.close()


def delete_identification(identification_id: str):
    db = SessionLocal()
    try:
        record = db.query(Identification).filter(Identification.id == identification_id).first()
        if not record:
            return False
        db.delete(record)
        db.commit()
        return True
    finally:
        db.close()
