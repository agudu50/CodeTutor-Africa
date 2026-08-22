"""
Interactive Coding Games Schemas.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class GameModeInfo(BaseModel):
    id: str = Field(..., description="Unique game identifier: syntax-speedrun, bug-hunt, output-predictor, code-shuffle")
    title: str
    description: str
    icon: str
    supported_languages: List[str]
    difficulties: List[str]
    has_3d_animation: bool = True
    offline_available: bool = True


class GamesListResponse(BaseModel):
    games: List[GameModeInfo]
    total_games: int
    offline_status: str = "ready"
