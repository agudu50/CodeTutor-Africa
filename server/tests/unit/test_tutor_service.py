"""
Unit Test: Tutor Service Modes and Structured Responses.
"""

import pytest
from app.services.tutor.tutor_service import TutorService
from app.schemas.tutor import TutorChatRequest


@pytest.mark.asyncio
async def test_tutor_service_explain_mode():
    service = TutorService()
    req = TutorChatRequest(
        message="Why is b = a copying references in Python?",
        language="python",
        mode="explain",
    )
    res = await service.chat(req)

    assert res.mode == "explain"
    assert res.language == "python"
    assert len(res.answer) > 0
    assert len(res.suggested_followups) > 0
    assert res.metrics is not None


@pytest.mark.asyncio
async def test_tutor_service_hint_mode():
    service = TutorService()
    req = TutorChatRequest(
        message="My loop terminates early. What is wrong?",
        language="python",
        mode="hint",
    )
    res = await service.chat(req)

    assert res.mode == "hint"
    assert len(res.answer) > 0
