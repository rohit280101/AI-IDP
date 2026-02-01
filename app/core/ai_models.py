from sentence_transformers import SentenceTransformer
import logging
import threading

logger = logging.getLogger(__name__)

embedding_model = None
classifier = None
_model_lock = threading.Lock()
_models_loaded = False

def load_models():
    """Load AI models with thread-safe initialization"""
    global embedding_model, classifier, _models_loaded
    
    if _models_loaded:
        return
    
    with _model_lock:
        # Double-check pattern to avoid redundant loads
        if _models_loaded:
            return
        
        try:
            logger.info("Loading embedding model (all-MiniLM-L6-v2)...")
            embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
            logger.info("Embedding model loaded successfully")
            
            logger.info("Loading classifier model...")
            try:
                from transformers import pipeline
                classifier = pipeline("text-classification", model="distilbert-base-uncased")
                logger.info("Classifier model loaded successfully")
            except Exception as e:
                logger.warning(f"Could not load classifier: {e}")
                classifier = None
            
            _models_loaded = True
        except Exception as e:
            logger.error(f"Failed to load models: {e}")
            raise
