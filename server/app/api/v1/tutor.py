"""
AI Tutor API Endpoints.
"""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.schemas.tutor import TutorChatRequest, TutorChatResponse
from app.services.tutor.tutor_service import tutor_service

router = APIRouter(prefix="/tutor", tags=["Tutor"])


@router.post("/chat", response_model=TutorChatResponse)
async def chat_with_tutor(request: TutorChatRequest):
    """Processes a pedagogical question and returns structured guidance."""
    return await tutor_service.chat(request)


@router.post("/stream")
async def stream_tutor_chat(request: TutorChatRequest):
    """Streams the tutor response token-by-token using Server-Sent Events (SSE)."""
    async def event_generator():
        async for token in tutor_service.stream_chat(request):
            yield f"data: {token}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/modes")
async def get_tutor_modes():
    """Returns available pedagogical modes."""
    return {
        "modes": [
            {"id": "explain", "label": "Explain Concept", "description": "Deep conceptual breakdown with analogies."},
            {"id": "hint", "label": "Give Hint", "description": "Socratic guidance without giving away answers."},
            {"id": "practice", "label": "Practice Problem", "description": "Targeted coding exercise."},
            {"id": "debug", "label": "Debug Analysis", "description": "Root-cause diagnostics and reasoning."},
            {"id": "review", "label": "Code Review", "description": "Complexity and idiomatic quality check."},
            {"id": "quiz", "label": "Quick Quiz", "description": "Active recall multiple-choice question."},
        ]
    }
