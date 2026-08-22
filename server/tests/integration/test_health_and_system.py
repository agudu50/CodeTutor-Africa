"""
Integration Test: Health & System Status Endpoints.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_endpoint(async_client: AsyncClient):
    response = await async_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["offline"] is True


@pytest.mark.asyncio
async def test_system_status_endpoint(async_client: AsyncClient):
    response = await async_client.get("/api/v1/system/status")
    assert response.status_code == 200
    data = response.json()

    assert data["offline_mode"] is True
    assert "model" in data
    assert "resources" in data
    assert data["resources"]["process_rss_mb"] > 0
    assert data["resources"]["ram_total_gb"] > 0


@pytest.mark.asyncio
async def test_system_metrics_endpoint(async_client: AsyncClient):
    response = await async_client.get("/api/v1/system/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "cpu_percent" in data
    assert "process_rss_mb" in data
