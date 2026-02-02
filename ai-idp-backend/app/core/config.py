from pydantic_settings import BaseSettings
import os
from pathlib import Path

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Document Processing Platform"
    API_V1_STR: str = "/api/v1"

    JWT_SECRET_KEY: str = "dev-secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Support both Docker (PostgreSQL) and local development (SQLite)
    # Set DATABASE_URL env var to override, default to SQLite for local dev
    _base_dir = Path(__file__).resolve().parents[2]
    _sqlite_path = _base_dir / "docai.db"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{_sqlite_path.as_posix()}"  # SQLite for local development
    )

    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # Rate limiting settings
    UPLOAD_RATE_LIMIT: int = int(os.getenv("UPLOAD_RATE_LIMIT", "10"))  # requests
    UPLOAD_RATE_WINDOW: int = int(os.getenv("UPLOAD_RATE_WINDOW", "60"))  # seconds
    SEARCH_RATE_LIMIT: int = int(os.getenv("SEARCH_RATE_LIMIT", "30"))  # requests
    SEARCH_RATE_WINDOW: int = int(os.getenv("SEARCH_RATE_WINDOW", "60"))  # seconds

    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra fields from .env file

settings = Settings()
