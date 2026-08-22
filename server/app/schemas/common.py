"""
Common reusable API schemas and error structures.
"""

from typing import Generic, Optional, TypeVar, Any, Dict
from pydantic import BaseModel, Field

DataT = TypeVar("DataT")


class ErrorDetail(BaseModel):
    code: str = Field(..., description="Machine readable error code")
    message: str = Field(..., description="Human readable error message")
    details: Optional[Dict[str, Any]] = Field(default=None, description="Optional extra error context")


class ErrorResponse(BaseModel):
    error: ErrorDetail


class StandardResponse(BaseModel, Generic[DataT]):
    success: bool = True
    data: DataT
    message: Optional[str] = None
