"""
AI Tutor Request and Response Schemas.
Supports pedagogical modes: explain, hint, practice, debug, review, quiz.
"""

from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.system import InferenceMetrics

TutorMode = Literal["explain", "hint", "practice", "debug", "review", "quiz"]
SupportedLanguage = Literal["python", "javascript", "java", "typescript", "sql", "general"]


class TutorSource(BaseModel):
    document: str = Field(..., description="Source document or curriculum name")
    course_id: Optional[str] = None
    lesson_id: Optional[str] = None
    section: Optional[str] = None
    snippet: Optional[str] = None


class TutorChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000, description="Student query or prompt")
    language: SupportedLanguage = Field(default="python", description="Target programming language")
    mode: TutorMode = Field(default="explain", description="Pedagogical tutoring mode")
    course_id: Optional[str] = Field(default=None, description="Current course context")
    lesson_id: Optional[str] = Field(default=None, description="Current lesson context")
    code_context: Optional[str] = Field(default=None, description="Student's current editor code")
    session_id: Optional[str] = Field(default=None, description="Session identifier for multi-turn history")


class TutorChatResponse(BaseModel):
    answer: str = Field(..., description="Tutor's pedagogical explanation, hint, or guidance")
    mode: TutorMode = Field(default="explain")
    language: SupportedLanguage = Field(default="python")
    sources: List[TutorSource] = Field(default_factory=list)
    suggested_followups: List[str] = Field(default_factory=list)
    model: str = Field(default="Qwen2.5-Coder-3B-Instruct")
    metrics: Optional[InferenceMetrics] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
