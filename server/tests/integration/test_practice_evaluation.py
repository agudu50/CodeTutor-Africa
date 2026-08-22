"""
Integration Tests for Practice Evaluation & Diagnostics Endpoints.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_practice_evaluate_correct_solution(async_client: AsyncClient):
    payload = {
        "exercise_id": "ex-py-1",
        "language": "python",
        "code": "nums = list(map(int, input().split()))\nprint(sum(1 for x in nums if x > 0))\n",
    }

    response = await async_client.post("/api/v1/practice/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["exercise_id"] == "ex-py-1"
    assert data["passed"] is True
    assert data["passed_tests"] == 2
    assert data["total_tests"] == 2
    assert "Outstanding" in data["feedback"]


@pytest.mark.asyncio
async def test_practice_evaluate_incorrect_solution(async_client: AsyncClient):
    payload = {
        "exercise_id": "ex-py-1",
        "language": "python",
        "code": "nums = list(map(int, input().split()))\nprint(0)\n",
    }

    response = await async_client.post("/api/v1/practice/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["passed"] is False
    assert data["passed_tests"] < data["total_tests"]
    assert data["suggested_hint"] is not None


@pytest.mark.asyncio
async def test_debugger_runtime_error_analysis(async_client: AsyncClient):
    payload = {
        "code": "data = [1, 2, 3]\nprint(data[10])\n",
        "language": "python",
        "error_message": None,
    }

    response = await async_client.post("/api/v1/debugger/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["has_bugs"] is True
    assert "IndexError" in data["summary"] or data["error_type"] == "RuntimeError"
