"""
Application Configuration Module.

Designed for the Africa Deep Tech Challenge (ADTC) 2026 Laptop LLM Track.
Target Hardware Profile:
- CPU: Intel Core i5 (10-12th gen) / AMD Ryzen 5 (3000-5000)
- RAM: 8 GB DDR4 (7.0 GB peak budget limit)
- GPU: Integrated Graphics Only (GPU Layers = 0)
- Storage: 256 GB SSD
- OS: Ubuntu 22.04 LTS / Cross-platform
"""

import os
from functools import lru_cache
from typing import List, Literal
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Application Info
    APP_NAME: str = "CodeTutor Africa Backend"
    APP_VERSION: str = "0.1.0"
    APP_ENV: Literal["development", "production", "testing", "benchmarking"] = "development"
    DEBUG: bool = False
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    LOG_LEVEL: str = "INFO"

    # API Configuration
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # Database Configuration (SQLite Local)
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/database/codetutor.db"
    DATABASE_SYNC_URL: str = "sqlite:///./data/database/codetutor.db"

    # LLM / GGUF Model Runtime Configuration
    # Options: 'mock' (zero-RAM fast testing), 'gguf' (local llama.cpp runtime)
    MODEL_PROVIDER: Literal["mock", "gguf"] = "gguf"
    MODEL_PATH: str = "../models/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf"
    MODEL_NAME: str = "Qwen2.5-Coder-1.5B-Instruct"
    MODEL_CONTEXT_SIZE: int = Field(
        default=2048,
        description="Context window tokens. Kept bounded for 8GB RAM budget.",
    )
    MODEL_THREADS: int = Field(
        default=4,
        description="Optimal CPU threads for 4-6 physical core laptops.",
    )
    MODEL_BATCH_SIZE: int = Field(
        default=256,
        description="Prompt eval batch size.",
    )
    MODEL_GPU_LAYERS: int = Field(
        default=0,
        description="Must be 0 for ADTC standard CPU-only integrated graphics target.",
    )
    MODEL_USE_MMAP: bool = Field(
        default=True,
        description="Memory-mapping reduces initial load time and allows OS paging.",
    )
    MODEL_USE_MLOCK: bool = Field(
        default=False,
        description="False to prevent locking scarce 8GB RAM in memory.",
    )

    # Concurrency & Memory Constraints (ADTC Score Guardrails)
    MAX_CONCURRENT_INFERENCES: int = Field(
        default=1,
        description="Restricts concurrent LLM inferences to 1 to guarantee deterministic RAM bounds.",
    )
    PEAK_MEMORY_BUDGET_GB: float = Field(
        default=7.0,
        description="Maximum RSS threshold for ADTC efficiency scoring (Seff).",
    )
    THERMAL_ALERT_THRESHOLD_C: float = Field(
        default=80.0,
        description="Thermal warning threshold before reaching the 85°C penalty zone.",
    )

    # Inference Default Parameters
    DEFAULT_TEMPERATURE: float = 0.2
    DEFAULT_TOP_P: float = 0.95
    DEFAULT_MAX_TOKENS: int = 512
    DEFAULT_REPEAT_PENALTY: float = 1.1


@lru_cache()
def get_settings() -> Settings:
    """Cached settings singleton."""
    return Settings()
