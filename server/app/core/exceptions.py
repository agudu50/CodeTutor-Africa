"""
Domain and API Exception Definitions.
Provides centralized error structures without leaking stack traces to clients.
"""

from typing import Any, Dict, Optional
from fastapi import HTTPException, status


class AppBaseException(Exception):
    """Base exception for all domain and service level errors."""

    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_ERROR",
        details: Optional[Dict[str, Any]] = None,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
    ):
        super().__init__(message)
        self.message = message
        self.code = code
        self.details = details or {}
        self.status_code = status_code


class ModelNotReadyError(AppBaseException):
    """Raised when an inference call is made but the local model is not loaded."""

    def __init__(self, message: str = "Local AI model is not loaded or ready."):
        super().__init__(
            message=message,
            code="MODEL_NOT_READY",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        )


class ConcurrencyLimitExceededError(AppBaseException):
    """Raised when inference capacity is at max to preserve RAM."""

    def __init__(self, message: str = "AI inference queue is busy. Please retry shortly."):
        super().__init__(
            message=message,
            code="CONCURRENCY_LIMIT_EXCEEDED",
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        )


class ResourceNotFoundError(AppBaseException):
    """Raised when a course, lesson, or entity is not found."""

    def __init__(self, message: str = "Requested resource not found."):
        super().__init__(
            message=message,
            code="RESOURCE_NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
        )


class ValidationError(AppBaseException):
    """Raised when request payload or parameters fail validation."""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            code="VALIDATION_ERROR",
            details=details,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )
