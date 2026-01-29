from fastapi import FastAPI
from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1 import api_router
from app.db.base import Base
from app.db.session import engine
from app.db import models  # noqa: F401 - Import models to register them

setup_logging()

# Create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
)

app.include_router(api_router, prefix=settings.API_V1_STR)
