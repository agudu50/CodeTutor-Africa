"""
Unit Test: LLM Provider and Model Manager.
"""

import pytest
from app.infrastructure.llm.mock_provider import MockLLMProvider
from app.services.model_manager.manager import ModelManager
from app.core.config import Settings


@pytest.mark.asyncio
async def test_mock_llm_provider_generation():
    provider = MockLLMProvider(model_name="Test-Qwen-3B")
    assert provider.is_loaded() is True

    text, metrics = await provider.generate(prompt="Explain Python list slicing", max_tokens=100)
    assert len(text) > 0
    assert metrics.completion_tokens > 0
    assert metrics.tokens_per_second > 0
    assert metrics.latency_ms > 0


@pytest.mark.asyncio
async def test_mock_llm_provider_streaming():
    provider = MockLLMProvider()
    tokens = []
    async for token in provider.stream(prompt="Explain recursion"):
        tokens.append(token)

    assert len(tokens) > 0
    full_text = "".join(tokens)
    assert len(full_text) > 0


def test_model_manager_mock_init():
    settings = Settings(MODEL_PROVIDER="mock")
    manager = ModelManager(settings)
    status = manager.get_status()

    assert status["provider"] == "mock"
    assert status["is_loaded"] is True
