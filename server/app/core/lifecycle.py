"""
Application Lifecycle Management (FastAPI Lifespan).

Handles:
- Startup logging and system capability checks
- Local database table creation
- Optional background model pre-warming
- Graceful shutdown and model memory cleanup
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.config import get_settings
from app.core.logging import logger
from app.infrastructure.database.session import init_db
from app.services.model_manager.manager import model_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION} ({settings.APP_ENV})")
    logger.info(f"Target Resource Profile: 8GB RAM Budget (Budget limit: {settings.PEAK_MEMORY_BUDGET_GB} GB)")
    logger.info(f"Active LLM Provider: {settings.MODEL_PROVIDER.upper()}")

    # 1. Initialize Local Database Tables
    try:
        await init_db()
        logger.info("Local SQLite database initialized successfully.")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")

    # 2. Check/Pre-load model if configured
    if settings.MODEL_PROVIDER == "mock":
        await model_manager.load_model()
    elif settings.MODEL_PROVIDER == "gguf":
        logger.info(f"GGUF model configured at: {settings.MODEL_PATH} (will load on-demand or pre-warm)")

    yield

    # Shutdown: Release memory
    logger.info("Shutting down CodeTutor backend. Releasing model memory...")
    await model_manager.unload_model()
    logger.info("Shutdown complete.")
