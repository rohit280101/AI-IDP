from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from sqlalchemy import text
from typing import Dict
import logging
import os

from app.db.session import SessionLocal
from app.core.vector_store import faiss_index, INDEX_PATH

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/health")
def health_check():
    """Basic health check - is app alive?"""
    return {"status": "ok", "message": "Application is running"}

@router.get("/ready")
async def readiness_check() -> JSONResponse:
    """
    Readiness check endpoint to verify if all services are ready.
    Checks:
    - Database connection
    - Embedding model loaded
    - FAISS vector store ready
    
    Returns:
        JSONResponse: Detailed status of all services
    """
    checks = {
        "database": False,
        "embedding_model": False,
        "vector_store": False
    }
    
    errors = []
    
    # Check database connection
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        checks["database"] = True
    except Exception as e:
        logger.error(f"Database check failed: {str(e)}")
        errors.append(f"Database: {str(e)}")
    
    # Check embedding model
    try:
        from app.core.ai_models import embedding_model
        if embedding_model is not None:
            checks["embedding_model"] = True
        else:
            errors.append("Embedding model: Not loaded")
    except Exception as e:
        logger.error(f"Embedding model check failed: {str(e)}")
        errors.append(f"Embedding model: {str(e)}")
    
    # Check FAISS vector store
    try:
        # Check if index is initialized and either has data or index file exists
        if faiss_index is not None and (faiss_index.ntotal > 0 or os.path.exists(INDEX_PATH)):
            checks["vector_store"] = True
        else:
            errors.append("Vector store: Not ready or empty")
    except Exception as e:
        logger.error(f"Vector store check failed: {str(e)}")
        errors.append(f"Vector store: {str(e)}")
    
    # Determine overall status
    all_ready = all(checks.values())
    status_code = status.HTTP_200_OK if all_ready else status.HTTP_503_SERVICE_UNAVAILABLE
    
    response = {
        "ready": all_ready,
        "checks": checks
    }
    
    if errors:
        response["errors"] = errors
    
    return JSONResponse(
        status_code=status_code,
        content=response
    )