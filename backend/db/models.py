import uuid
from sqlalchemy import Column, Text, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"

    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name             = Column(Text, nullable=False)
    email            = Column(Text, nullable=False, unique=True)
    phone            = Column(Text, nullable=False, unique=True)
    password         = Column(Text, nullable=False)
    skin_type        = Column(Text)          # 'oily', 'dry', 'combination', 'sensitive', 'normal'
    known_conditions = Column(Text)          # e.g. 'eczema, psoriasis'
    allergies        = Column(Text)          # e.g. 'nickel, latex'
    created_at       = Column(TIMESTAMP(timezone=True), server_default=func.now())


class Identification(Base):
    __tablename__ = "identifications"

    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id           = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    image_url         = Column(Text)
    predicted_disease = Column(Text)
    model_response    = Column(Text)
    created_at        = Column(TIMESTAMP(timezone=True), server_default=func.now())


class Chat(Base):
    __tablename__ = "chats"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id    = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    message    = Column(Text, nullable=False)
    response   = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class Report(Base):
    __tablename__ = "reports"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id    = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    file_url   = Column(Text)                      # Supabase storage URL
    file_type  = Column(Text)                      # 'pdf', 'docx', 'jpg', 'png', etc.
    analysis   = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class Setting(Base):
    __tablename__ = "settings"

    id                    = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id               = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    theme                 = Column(Text, default="light")   # 'light' or 'dark'
    notifications_enabled = Column(Boolean, default=True)
    email_updates         = Column(Boolean, default=True)
    language              = Column(Text, default="en")
    account_deleted       = Column(Boolean, default=False)
    updated_at            = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())


class Symptom(Base):
    __tablename__ = "symptoms"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id     = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    description = Column(Text, nullable=False)
    logged_at   = Column(TIMESTAMP(timezone=True), server_default=func.now())
