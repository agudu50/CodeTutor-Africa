"""
Integration Test: Games & Progress Endpoints.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_games_endpoint(async_client: AsyncClient):
    response = await async_client.get("/api/v1/games")
    assert response.status_code == 200
    data = response.json()

    assert "games" in data
    assert data["total_games"] == 4
    game_ids = [g["id"] for g in data["games"]]
    assert "syntax-speedrun" in game_ids
    assert "bug-hunt" in game_ids
    assert "output-predictor" in game_ids
    assert "code-shuffle" in game_ids


@pytest.mark.asyncio
async def test_progress_endpoints(async_client: AsyncClient):
    # Test GET /api/v1/progress
    resp1 = await async_client.get("/api/v1/progress")
    assert resp1.status_code == 200
    data1 = resp1.json()
    assert "total_study_minutes" in data1
    assert "mastery_by_topic" in data1

    # Test GET /api/v1/progress/summary
    resp2 = await async_client.get("/api/v1/progress/summary")
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2["accuracy_percentage"] > 0
