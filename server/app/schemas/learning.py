"""
Learning & Curriculum Schemas.
"""

from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class QuizQuestionSchema(BaseModel):
    id: str
    type: str  # 'mcq' | 'fill_in' | 'code'
    question: str
    options: Optional[List[str]] = None
    correctAnswer: Any
    explanation: str
    codeSnippet: Optional[str] = None
    initialCode: Optional[str] = None
    testCases: Optional[List[Dict[str, str]]] = None
    hint: Optional[str] = None


class LessonDetailSchema(BaseModel):
    id: str
    title: str
    slug: str
    description: str
    duration_minutes: int
    order: int
    is_completed: bool = False
    video_url: Optional[str] = None
    content_markdown: str
    quiz_questions: Optional[List[QuizQuestionSchema]] = None


class ModuleDetailSchema(BaseModel):
    id: str
    title: str
    description: str
    order: int
    lessons: List[LessonDetailSchema] = Field(default_factory=list)


class GameLinkSchema(BaseModel):
    id: str
    title: str
    type: str
    description: str


class GenerateCourseRequest(BaseModel):
    prompt: str
    language: str = "javascript"
    difficulty: str = "beginner"
    module_count: int = 3
    include_videos: bool = True
    include_games: bool = True


class CourseDetailResponse(BaseModel):
    id: str
    title: str
    slug: str
    description: str
    category: str
    language: str
    difficulty: str
    thumbnail_url: Optional[str] = None
    total_lessons: int
    estimated_hours: int
    progress_percentage: int = 0
    modules: List[ModuleDetailSchema] = Field(default_factory=list)
    is_ai_generated: bool = True
    generated_prompt: Optional[str] = None
    games: Optional[List[GameLinkSchema]] = None


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
