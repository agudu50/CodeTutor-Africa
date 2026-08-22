"""
Lightweight Health Check Endpoint.
Does NOT load or invoke the LLM to ensure O(1) instantaneous response with zero RAM impact.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["Health"])


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "0.1.0"
    offline: bool = True


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Returns basic service health status."""
    return HealthResponse()
