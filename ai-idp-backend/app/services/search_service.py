# Search service
from app.services.embedding_service import index, doc_id_map
import numpy as np
import logging

from app.services.embedding_service import generate_embeddings
from app.db.session import get_db
from app.db.models import Document

logger = logging.getLogger(__name__)

def semantic_search(query: str, limit: int):
    """Perform semantic search on indexed documents."""
    # Use the same index that embeddings are added to during document processing
    if index.ntotal == 0:
        logger.warning("No documents indexed yet")
        return []

    # 1. Embed query (pass document_id=None to only get vector, don't add to index)
    try:
        query_vector = generate_embeddings(query, document_id=None)
    except Exception as e:
        logger.error(f"Failed to embed query: {e}")
        return []
    
    if query_vector is None:
        return []
    
    query_vector = query_vector.reshape(1, -1)

    # 2. FAISS search (using the same index as document processing)
    try:
        scores, indices = index.search(query_vector, limit)
    except Exception as e:
        logger.error(f"FAISS search failed: {e}")
        return []

    results = []
    db = next(get_db())

    try:
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:
                continue

            if idx >= len(doc_id_map):
                logger.warning(f"Index {idx} out of range for doc_id_map")
                continue

            doc_id = doc_id_map[idx]
            document = db.query(Document).filter(Document.id == doc_id).first()

            if not document:
                logger.warning(f"Document {doc_id} not found in database")
                continue

            # Extract classification label safely
            classification_label = None
            if document.classification:
                if isinstance(document.classification, dict):
                    classification_label = document.classification.get("label")
                else:
                    # If it's stored as string, try to parse it
                    classification_label = str(document.classification)

            results.append({
                "document_id": doc_id,
                "score": float(score),
                "snippet": document.cleaned_text[:200] if document.cleaned_text else "",
                "classification": classification_label
            })
    finally:
        db.close()

    return results