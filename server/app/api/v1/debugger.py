"""
Debugger, Learning, and Progress API Endpoints.
"""

from typing import List
from fastapi import APIRouter
from app.schemas.debugger import DebugAnalyzeRequest, DebugAnalyzeResponse
from app.schemas.learning import CourseResponse
from app.schemas.progress import ProgressSummaryResponse
from app.services.debugger.debugger_service import debugger_service
from app.services.learning.learning_service import learning_service
from app.services.progress.progress_service import progress_service

debugger_router = APIRouter(prefix="/debugger", tags=["Debugger"])
learning_router = APIRouter(prefix="/learning", tags=["Learning"])
progress_router = APIRouter(prefix="/progress", tags=["Progress"])


@debugger_router.post("/analyze", response_model=DebugAnalyzeResponse)
async def analyze_code(request: DebugAnalyzeRequest):
    """Analyzes student code and error logs for root cause and guided fix."""
    return await debugger_service.analyze(request)


@learning_router.get("/courses", response_model=List[CourseResponse])
async def list_courses():
    """Returns all available offline curricula and course modules."""
    return learning_service.get_all_courses()


@progress_router.get("/summary", response_model=ProgressSummaryResponse)
async def get_progress():
    """Returns student progress, streaks, and topic mastery overview."""
    return progress_service.get_progress_summary()
