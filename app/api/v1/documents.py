# Documents endpoints
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.document_service import upload_document
from app.schemas.document import DocumentResponse
from app.api.v1.auth import get_current_user
from fastapi import BackgroundTasks
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/documents", tags=["Documents"])

'''@router.post("/upload", response_model=DocumentResponse)
async def upload(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        return await upload_document(db, current_user.id, file)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))'''


@router.post("/upload", response_model=DocumentResponse)
async def upload(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    logger.info(
        "Document upload request received",
        extra={"trace_id": request.state.trace_id}
    )
    from app.workers.tasks import process_document
    
    doc = await upload_document(db, current_user.id, file)

    background_tasks.add_task(
        process_document,
        document_id=doc.id
    )
    logger.info(
        f"Document {doc.id} queued for processing",
        extra={"trace_id": request.state.trace_id}
    )

    return doc