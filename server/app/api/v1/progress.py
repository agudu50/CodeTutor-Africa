"""
Progress API Endpoints.
"""

from fastapi import APIRouter
from app.schemas.progress import ProgressSummaryResponse
from app.services.progress.progress_service import progress_service

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("", response_model=ProgressSummaryResponse)
@router.get("/", response_model=ProgressSummaryResponse)
@router.get("/summary", response_model=ProgressSummaryResponse)
async def get_progress():
    """Returns student progress, streaks, and topic mastery overview."""
    return progress_service.get_progress_summary()
