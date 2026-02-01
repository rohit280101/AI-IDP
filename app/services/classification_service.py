import logging

logger = logging.getLogger(__name__)

def classify_text(text: str):
    if not text:
        return None
    
    try:
        from app.core.ai_models import classifier, load_models
        
        # Ensure model is loaded with retry logic
        clf = classifier
        if clf is None:
            logger.info("Classifier not loaded, loading now...")
            try:
                load_models()
                from app.core.ai_models import classifier as loaded_clf
                clf = loaded_clf
                if clf is None:
                    logger.warning("Classifier could not be loaded after calling load_models()")
                    return None
            except Exception as load_err:
                logger.error(f"Failed to load classifier model: {load_err}")
                return None
        else:
            logger.debug("Classifier model already loaded")
        
        # limit text length (huggingface safety)
        result = clf(text[:512])
        return result[0]  # {label, score}
    except Exception as e:
        logger.error(f"Error classifying text: {e}")
        return None
