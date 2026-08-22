"""
Integration Test: Tutor API Endpoints and Modes.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_tutor_chat_api(async_client: AsyncClient):
    payload = {
        "message": "Explain the difference between mutable and immutable objects in Python.",
        "language": "python",
        "mode": "explain",
    }
    response = await async_client.post("/api/v1/tutor/chat", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "answer" in data
    assert data["mode"] == "explain"
    assert data["language"] == "python"
    assert "metrics" in data
    assert data["metrics"]["tokens_per_second"] > 0


@pytest.mark.asyncio
async def test_tutor_modes_api(async_client: AsyncClient):
    response = await async_client.get("/api/v1/tutor/modes")
    assert response.status_code == 200
    data = response.json()
    assert len(data["modes"]) >= 5


@pytest.mark.asyncio
async def test_practice_and_learning_apis(async_client: AsyncClient):
    # Test learning courses
    courses_resp = await async_client.get("/api/v1/learning/courses")
    assert courses_resp.status_code == 200
    assert len(courses_resp.json()) > 0

    # Test practice exercises
    exercises_resp = await async_client.get("/api/v1/practice/exercises")
    assert exercises_resp.status_code == 200
    assert len(exercises_resp.json()) > 0
