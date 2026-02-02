# Document schemas
from pydantic import BaseModel
from datetime import datetime
from typing import Any, Optional


class DocumentResponse(BaseModel):
    id: int
    filename: str
    status: str
    embedding_status: Optional[str] = None
    classification: Optional[Any] = None
    content_type: str
    created_at: datetime

    class Config:
        from_attributes = True
