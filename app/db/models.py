from sqlalchemy import Column, Integer, String, Boolean , DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)
    
class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    storage_path = Column(String, nullable=False)

    status = Column(String, default="uploaded")

    created_at = Column(DateTime(timezone=True), server_default=func.now())