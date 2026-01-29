from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Document Processing Platform"
    API_V1_STR: str = "/api/v1"

    JWT_SECRET_KEY: str = "dev-secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Support both Docker (PostgreSQL) and local development (SQLite)
    # Set DATABASE_URL env var to override, default to SQLite for local dev
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./docai.db"  # SQLite for local development
    )

    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    class Config:
        env_file = ".env"

settings = Settings()
