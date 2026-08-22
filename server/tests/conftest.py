"""
Pytest Fixtures and Test Setup.
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.config import Settings, get_settings


@pytest.fixture(scope="session")
def test_settings() -> Settings:
    return Settings(
        APP_ENV="testing",
        MODEL_PROVIDER="mock",
        DATABASE_URL="sqlite+aiosqlite:///:memory:",
    )


@pytest_asyncio.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client
