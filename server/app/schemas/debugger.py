"""
Code Debugger Schemas.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class DebugAnalyzeRequest(BaseModel):
    code: str = Field(..., description="Student code to analyze")
    language: str = Field(default="python", description="Language of the code")
    error_message: Optional[str] = Field(default=None, description="Compiler or runtime error message if any")
    context: Optional[str] = Field(default=None, description="Problem goal or assignment context")


class BugLocation(BaseModel):
    line: int
    column: Optional[int] = None
    snippet: Optional[str] = None


class DebugAnalyzeResponse(BaseModel):
    has_bugs: bool
    summary: str
    error_type: Optional[str] = None
    locations: List[BugLocation] = Field(default_factory=list)
    root_cause_explanation: str
    guided_fix_hint: str
    fixed_code_snippet: Optional[str] = None
