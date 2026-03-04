import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3]))

from db.database import SessionLocal
from db.models import Symptom


def add_symptom(user_id: str, description: str):
    db = SessionLocal()
    try:
        symptom = Symptom(user_id=user_id, description=description)
        db.add(symptom)
        db.commit()
        db.refresh(symptom)
        return symptom
    finally:
        db.close()


def get_all_symptoms():
    db = SessionLocal()
    try:
        return db.query(Symptom).order_by(Symptom.logged_at.desc()).all()
    finally:
        db.close()


def get_user_symptoms(user_id: str):
    db = SessionLocal()
    try:
        return (
            db.query(Symptom)
            .filter(Symptom.user_id == user_id)
            .order_by(Symptom.logged_at.desc())
            .all()
        )
    finally:
        db.close()


def get_symptom(symptom_id: str):
    db = SessionLocal()
    try:
        return db.query(Symptom).filter(Symptom.id == symptom_id).first()
    finally:
        db.close()


def delete_symptom(symptom_id: str):
    db = SessionLocal()
    try:
        symptom = db.query(Symptom).filter(Symptom.id == symptom_id).first()
        if not symptom:
            return False
        db.delete(symptom)
        db.commit()
        return True
    finally:
        db.close()
