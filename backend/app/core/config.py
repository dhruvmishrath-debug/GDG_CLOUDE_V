"""Healthcare Platform — core configuration via pydantic-settings."""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # ── App ──
    APP_NAME: str = "HealthcarePlatform"
    DEBUG: bool = False
    SECRET_KEY: str = "CHANGE_ME"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # ── Database ──
    DATABASE_URL: str = "postgresql+asyncpg://healthcare:healthcare@localhost:5432/healthcare_db"

    # ── Redis ──
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── JWT ──
    JWT_SECRET_KEY: str = "CHANGE_ME_jwt_secret_key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── S3 / MinIO ──
    S3_ENDPOINT_URL: str = "http://localhost:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    S3_BUCKET_NAME: str = "healthcare-documents"
    S3_REGION: str = "us-east-1"

    # ── AI: Vision OCR (Gemini) ──
    GOOGLE_API_KEY: str = ""
    GEMINI_VISION_MODEL: str = "gemini-1.5-pro"

    # ── AI: Clinical structuring (NVIDIA NIM / Nemotron) ──
    # Nemotron is a text model: OCR (Gemini) -> transcription -> Nemotron structuring.
    NVIDIA_API_KEY: str = ""
    NVIDIA_BASE_URL: str = "https://integrate.api.nvidia.com/v1"
    NVIDIA_MODEL: str = "nvidia/nemotron-3.5-lightning-30b-a3b"
    NVIDIA_ENABLE_THINKING: bool = True
    NVIDIA_REASONING_BUDGET: int = 16384
    NVIDIA_MAX_TOKENS: int = 16384
    NVIDIA_TEMPERATURE: float = 1.0
    NVIDIA_TOP_P: float = 0.95
    NVIDIA_TIMEOUT_SECONDS: float = 120.0
    NVIDIA_MAX_RETRIES: int = 3

    # ── Legacy / optional providers ──
    ANTHROPIC_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    CONFIDENCE_THRESHOLD: float = 0.80


@lru_cache()
def get_settings() -> Settings:
    return Settings()
