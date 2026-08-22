"""
Learning API Endpoints.
"""

from typing import List
from fastapi import APIRouter
from app.schemas.learning import CourseResponse
from app.services.learning.learning_service import learning_service

router = APIRouter(prefix="/learning", tags=["Learning"])


@router.get("/courses", response_model=List[CourseResponse])
async def list_courses():
    """Returns all available offline curricula and course modules."""
    return learning_service.get_all_courses()
