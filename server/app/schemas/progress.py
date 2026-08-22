"""
Student Progress & Mastery Schemas.
"""

from typing import List, Dict
from pydantic import BaseModel, Field


class TopicMastery(BaseModel):
    topic: str
    language: str
    mastery_score: int = Field(default=0, ge=0, le=100)
    exercises_completed: int = 0


class ProgressSummaryResponse(BaseModel):
    total_study_minutes: int = 0
    completed_lessons: int = 0
    total_exercises_attempted: int = 0
    total_exercises_passed: int = 0
    accuracy_percentage: float = 0.0
    current_streak_days: int = 1
    best_streak_days: int = 1
    mastery_by_topic: List[TopicMastery] = Field(default_factory=list)
    recent_activities: List[Dict[str, str]] = Field(default_factory=list)
