"""
Practice API Endpoints.
"""

from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.practice import PracticeExercise, SubmissionRequest, SubmissionEvaluation
from app.services.practice.practice_service import practice_service

router = APIRouter(prefix="/practice", tags=["Practice"])


@router.get("/exercises", response_model=List[PracticeExercise])
async def list_exercises(language: Optional[str] = Query(default=None)):
    """Lists available practice exercises."""
    return practice_service.get_exercises(language)


@router.post("/evaluate", response_model=SubmissionEvaluation)
async def evaluate_exercise(submission: SubmissionRequest):
    """Safely evaluates a student code submission against test cases."""
    return await practice_service.evaluate_submission(submission)
