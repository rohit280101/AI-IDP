from fastapi import FastAPI
from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1 import api_router
from app.api.v1 import documents

from app.core.middleware import add_trace_id
from app.core.metrics_middleware import metrics_middleware
from app.db.base import Base
from app.db.session import engine
from app.db import models  # noqa: F401 - Import models to register them
from fastapi import Response
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest

setup_logging()

# Create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
)


@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

app.middleware("http")(add_trace_id)
app.middleware("http")(metrics_middleware)

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
