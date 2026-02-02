# Documents endpoints
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.document_service import upload_document
from app.schemas.document import DocumentResponse
from app.api.v1.auth import get_current_user
from fastapi import BackgroundTasks
from app.core.rate_limiter import RateLimitDependency
from app.core.config import settings
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
    rate_limit_headers: dict = Depends(
        RateLimitDependency(
            max_requests=settings.UPLOAD_RATE_LIMIT,
            window=settings.UPLOAD_RATE_WINDOW
        )
    ),
):
    logger.info("Document upload request received")
    from app.workers.tasks import process_document
    
    doc = await upload_document(db, current_user.id, file)

    background_tasks.add_task(
        process_document,
        document_id=doc.id
    )
    logger.info(f"Document {doc.id} queued for processing")

    return doc


@router.get("", response_model=list[DocumentResponse])
async def list_documents(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    """Get all documents for the current user"""
    from app.db.models import Document
    documents = db.query(Document).filter(
        Document.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    return documents


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get a specific document by ID"""
    from app.db.models import Document
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return document