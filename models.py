from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "mysql://root:root@127.0.0.1:3306/Dermacare"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Patients(Base):
    __tablename__ = 'patients'

    patient_id = Column(Integer, primary_key=True, autoincrement=True)
    patient_name = Column(String(200), nullable=False)
    patient_mail = Column(String(200), nullable=False, unique=True)
    patient_no = Column(String(20), nullable=False, unique=True)
    patient_pass = Column(String(200), nullable=False,unique=True)