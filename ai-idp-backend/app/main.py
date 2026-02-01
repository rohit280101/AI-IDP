from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1 import api_router
from app.api.v1 import documents

from app.core.middleware import add_timing, add_trace_id
from app.core.metrics_middleware import metrics_middleware
from app.db.base import Base
from app.db.session import engine
from app.db import models  # noqa: F401 - Import models to register them
from fastapi import Response
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest
import logging
import threading
from app.core.vector_store import load_vector_store

setup_logging()
logger = logging.getLogger(__name__)

# Create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods including OPTIONS
    allow_headers=["*"],  # Allow all headers
)

@app.on_event("startup")
def startup():
    """Startup event - pre-load AI models and vector store"""
    logger.info("Server starting up...")
    
    # Load AI models synchronously to ensure they're ready
    try:
        from app.core.ai_models import load_models
        logger.info("Pre-loading AI models...")
        load_models()
        logger.info("AI models pre-loaded successfully")
    except Exception as e:
        logger.warning(f"AI models will be loaded on-demand: {e}")
        # Don't fail startup, models will load on first use
    
    # Load vector store
    load_vector_store()
    logger.info("Server startup complete")





@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

app.middleware("http")(add_trace_id)
app.middleware("http")(add_timing)
app.middleware("http")(metrics_middleware)

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
