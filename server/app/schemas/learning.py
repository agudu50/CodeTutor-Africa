"""
Learning & Curriculum Schemas.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class LessonSummary(BaseModel):
    id: str
    title: str
    slug: str
    duration_minutes: int
    order: int
    is_completed: bool = False


class ModuleSummary(BaseModel):
    id: str
    title: str
    description: str
    order: int
    lessons: List[LessonSummary] = Field(default_factory=list)


class CourseResponse(BaseModel):
    id: str
    title: str
    slug: str
    description: str
    category: str
    language: str
    difficulty: str
    total_lessons: int
    estimated_hours: int
    progress_percentage: int = 0
    modules: List[ModuleSummary] = Field(default_factory=list)
