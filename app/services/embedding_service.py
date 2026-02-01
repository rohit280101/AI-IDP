import faiss
import numpy as np
import logging
import time

logger = logging.getLogger(__name__)

dimension = 384
index = faiss.IndexFlatL2(dimension)

doc_id_map = []

def generate_embeddings(text: str, document_id: int = None):
    if not text or not text.strip():
        logger.warning("Empty text provided for embedding generation")
        return None
    
    try:
        # Import here to avoid circular dependency at module load time
        from app.core.ai_models import embedding_model, load_models
        
        # Ensure model is loaded with retry logic
        model = embedding_model
        if model is None:
            logger.info("Embedding model not loaded, loading now...")
            try:
                load_models()
                # Re-import to get the loaded model
                from app.core.ai_models import embedding_model as loaded_model
                model = loaded_model
                if model is None:
                    raise RuntimeError("Failed to load embedding model after calling load_models()")
            except Exception as load_err:
                logger.error(f"Failed to load embedding model: {load_err}")
                raise RuntimeError(f"Cannot load embedding model: {load_err}")
        else:
            logger.debug("Embedding model already loaded")
        
        logger.info(f"Generating embeddings for text of length {len(text)}...")
        start = time.time()
        vector = model.encode([text])
        vector = np.asarray(vector, dtype="float32")
        duration = time.time() - start
        logger.info(f"Embeddings generated in {duration:.2f}s")
        
        # Only add to index if document_id is provided (during document processing)
        if document_id is not None:
            index.add(vector)
            doc_id_map.append(document_id)
            logger.info(f"Added embedding to index for document {document_id}")
        
        return vector
    
    except Exception as e:
        logger.error(f"Error generating embeddings: {e}")
        raise

