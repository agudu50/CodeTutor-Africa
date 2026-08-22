"""
Learning API Endpoints.
"""

from typing import List
from fastapi import APIRouter
from app.schemas.learning import CourseResponse, CourseDetailResponse, GenerateCourseRequest
from app.services.learning.learning_service import learning_service

router = APIRouter(prefix="/learning", tags=["Learning"])


@router.get("/courses", response_model=List[CourseResponse])
async def list_courses():
    """Returns all available offline curricula and course modules."""
    return learning_service.get_all_courses()


@router.post("/generate-course", response_model=CourseDetailResponse)
async def generate_course(request: GenerateCourseRequest):
    """
    Synthesizes a complete curriculum, technical lesson guides,
    quizzes, and coding challenges using the local offline LLM model.
    """
    return await learning_service.generate_ai_course(request)
