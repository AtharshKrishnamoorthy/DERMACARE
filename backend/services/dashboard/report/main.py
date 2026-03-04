import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3]))

from db.database import SessionLocal
from db.models import Report


def add_report(user_id: str, file_url: str, file_type: str, analysis: str = None):
    db = SessionLocal()
    try:
        report = Report(user_id=user_id, file_url=file_url, file_type=file_type, analysis=analysis)
        db.add(report)
        db.commit()
        db.refresh(report)
        return report
    finally:
        db.close()


def get_all_reports():
    db = SessionLocal()
    try:
        return db.query(Report).order_by(Report.created_at.desc()).all()
    finally:
        db.close()


def get_user_reports(user_id: str):
    db = SessionLocal()
    try:
        return (
            db.query(Report)
            .filter(Report.user_id == user_id)
            .order_by(Report.created_at.desc())
            .all()
        )
    finally:
        db.close()


def get_report(report_id: str):
    db = SessionLocal()
    try:
        return db.query(Report).filter(Report.id == report_id).first()
    finally:
        db.close()


def delete_report(report_id: str):
    db = SessionLocal()
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            return False
        db.delete(report)
        db.commit()
        return True
    finally:
        db.close()
