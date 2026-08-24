"""
Pytest Fixtures and Test Setup.
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.config import Settings, get_settings


import os
os.environ["MODEL_PROVIDER"] = "mock"
os.environ["APP_ENV"] = "testing"

from app.core.config import get_settings
from app.services.model_manager.manager import model_manager
get_settings.cache_clear()

@pytest.fixture(scope="session", autouse=True)
def test_settings() -> Settings:
    get_settings.cache_clear()
    settings = Settings(
        APP_ENV="testing",
        MODEL_PROVIDER="mock",
        DATABASE_URL="sqlite+aiosqlite:///:memory:",
    )
    model_manager.reset(settings)
    return settings


@pytest_asyncio.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client
