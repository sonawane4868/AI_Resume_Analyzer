import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    candidates = relationship("Candidate", back_populates="user")


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    resume_hash = Column(String, index=True)
    resume_text = Column(Text)
    score = Column(Integer)
    exp_years = Column(Integer)
    job_role = Column(String)
    job_description = Column(Text)
    campared_exp = Column(Integer)
     # 🔥 ADD THESE
    file_name = Column(String)
    file_path = Column(String)   # 🔥 NEW

    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

    user = relationship("User", back_populates="candidates")