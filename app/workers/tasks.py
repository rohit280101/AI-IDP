# Background tasks
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.db.models import Document
from app.services.ocr_service import extract_text
from app.services.nlp_service import clean_text
from app.services.embedding_service import generate_embeddings
import logging
import time 

logger = logging.getLogger(__name__)

def process_document(document_id: int):
    start_time = time.perf_counter()
    db: Session = SessionLocal()
    logger.info(
    f"Started processing document {document_id}",
    extra={"trace_id": f"doc-{document_id}"}
)
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            return

        document.status = "processing"
        db.commit()

        # 1️⃣ OCR / Text extraction
        raw_text = extract_text(document.storage_path)

        # 2️⃣ NLP cleanup / chunking
        cleaned_text = clean_text(raw_text)

        # 3️⃣ Embeddings
        generate_embeddings(cleaned_text, document_id=document.id)

        document.status = "completed"
        db.commit()
        duration = time.perf_counter() - start_time

        logger.info(f"Document {document_id} processed successfully in {duration:.2f}s",extra={"trace_id": f"doc-{document_id}"}) 

    except Exception as e:
        document.status = "failed"
        db.commit()
        logger.exception(f"Document {document_id} failed")

    finally:
        db.close()
