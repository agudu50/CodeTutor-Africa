"""
Practice and Interactive Coding Exercise Schemas.
"""

from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

DifficultyLevel = Literal["beginner", "intermediate", "advanced"]


class TestCase(BaseModel):
    input: str
    expected_output: str
    is_hidden: bool = False


class PracticeExercise(BaseModel):
    id: str
    title: str
    description: str
    language: str
    difficulty: DifficultyLevel
    course_id: Optional[str] = None
    lesson_id: Optional[str] = None
    starter_code: str
    test_cases: List[TestCase] = Field(default_factory=list)
    hints: List[str] = Field(default_factory=list)


class SubmissionRequest(BaseModel):
    exercise_id: str
    code: str
    language: str


class TestCaseResult(BaseModel):
    passed: bool
    input: str
    expected: str
    actual: Optional[str] = None
    error: Optional[str] = None


class SubmissionEvaluation(BaseModel):
    exercise_id: str
    passed: bool
    total_tests: int
    passed_tests: int
    test_results: List[TestCaseResult] = Field(default_factory=list)
    feedback: str
    suggested_hint: Optional[str] = None
