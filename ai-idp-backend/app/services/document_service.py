from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.core.storage import save_file
from app.db.models import Document

ALLOWED_TYPES = {"application/pdf", "image/png", "image/jpeg"}
MAX_SIZE_MB = 10

async def upload_document(
    db: Session,
    user_id: int,
    file: UploadFile
):
    if file.content_type not in ALLOWED_TYPES:
        raise ValueError("Unsupported file type")

    content = await file.read()

    if len(content) > MAX_SIZE_MB * 1024 * 1024:
        raise ValueError("File too large")

    path = save_file(content, file.filename)

    doc = Document(
        owner_id=user_id,
        filename=file.filename,
        content_type=file.content_type,
        storage_path=path,
    )

    db.add(doc)
    db.commit()
    db.refresh(doc)

    return doc
