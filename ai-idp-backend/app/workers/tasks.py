# Background tasks
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.db.models import Document
from app.services.classification_service import classify_text
from app.services.ocr_service import extract_text
from app.services.nlp_service import clean_text_nlp
from app.services.text_cleaning import clean_text
from app.services.embedding_service import generate_embeddings
from app.core.vector_store import save_vector_store
import logging
import time
import uuid
logger = logging.getLogger(__name__)

def process_document(document_id: int):
    trace_id = str(uuid.uuid4())
    start_time = time.perf_counter()
    db: Session = SessionLocal()
    logger.info(f"Started processing document {document_id}")
    document = None
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            logger.error(f"Document {document_id} not found")
            return

        document.status = "processing"
        document.embedding_status = "processing"
        db.commit()
        logger.info(f"[TRACE {trace_id}]Document {document_id} status set to processing")

        # 1️⃣ OCR / Text extraction
        logger.info(f"[TRACE {trace_id}]Extracting text from document {document_id}...")
        try:
            raw_text = extract_text(document.storage_path)
            if not raw_text or not raw_text.strip():
                logger.warning(f"No text extracted from document {document_id}")
                raw_text = ""
            
            logger.info(f"[TRACE {trace_id}]Extracted {len(raw_text)} characters from document {document_id}")
            cleaned = clean_text(raw_text)
            document.raw_text = raw_text
            document.cleaned_text = cleaned
            db.commit()
            logger.info(f"[TRACE {trace_id}]Text saved to database for document {document_id}")
        except Exception as e:
            logger.error(f"[TRACE {trace_id}]Text extraction failed for document {document_id}: {e}")
            document.status = "failed"
            document.embedding_status = "failed"
            db.commit()
            return
        
        # 2️⃣ Embeddings
        logger.info(f"[TRACE {trace_id}] Generating embeddings for document {document_id}...")
        try:
            if document.cleaned_text and document.cleaned_text.strip():
                try:
                    generate_embeddings(document.cleaned_text, document_id=document.id)
                    save_vector_store()
                    document.embedding_status = "completed"
                    logger.info(f"[TRACE {trace_id}] Embeddings generated successfully for document {document_id}")
                except Exception as e:
                    logger.error(f"[TRACE {trace_id}] Embedding generation failed for document {document_id}: {e}", exc_info=True)
                    document.embedding_status = "failed"
                    db.commit()
                    raise  # Re-raise to be caught by outer exception handler
            else:
                logger.warning(f"[TRACE {trace_id}]Skipping embeddings for document {document_id} - no cleaned text")
                document.embedding_status = "skipped"
            db.commit()
        except Exception as e:
            logger.error(f"[TRACE {trace_id}]Embedding step failed for document {document_id}: {e}")
            document.embedding_status = "failed"
            db.commit()
            # Don't return - continue to classification attempt
        
        # 3️⃣ Classification
        logger.info(f"[TRACE {trace_id}] Classifying document {document_id}...")
        try:
            if document.cleaned_text and document.cleaned_text.strip():
                try:
                    classification = classify_text(document.cleaned_text)
                    if classification:
                        document.classification = classification
                        logger.info(f"[TRACE {trace_id}] Classification completed for document {document_id}: {classification}")
                    else:
                        logger.warning(f"[TRACE {trace_id}] Classification returned None for document {document_id}")
                        document.classification = None
                except Exception as e:
                    logger.error(f"[TRACE {trace_id}] Classification failed for document {document_id}: {e}", exc_info=True)
                    document.classification = None
            else:
                logger.warning(f"[TRACE {trace_id}] Skipping classification for document {document_id} - no cleaned text")
                document.classification = None
        except Exception as e:
            logger.error(f"[TRACE {trace_id}] Unexpected error during classification for document {document_id}: {e}", exc_info=True)
            document.classification = None

        document.status = "completed"
        db.commit()
        duration = time.perf_counter() - start_time

        logger.info(f"[TRACE {trace_id}] Document {document_id} processed successfully in {duration:.2f}s") 

    except Exception as e:
        logger.exception(f"[TRACE {trace_id}] Unexpected error processing document {document_id}: {e}")
        if document:
            document.status = "failed"
            document.embedding_status = "failed"
            try:
                db.commit()
            except Exception as commit_err:
                logger.error(f"[TRACE {trace_id}] Failed to commit error state for document {document_id}: {commit_err}")

    finally:
        try:
            db.close()
        except Exception as e:
            logger.error(f"[TRACE {trace_id}] Error closing database session: {e}")
