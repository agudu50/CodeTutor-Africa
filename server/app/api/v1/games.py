"""
Games API Endpoints.
"""

from fastapi import APIRouter
from app.schemas.games import GamesListResponse
from app.services.games.games_service import games_service

router = APIRouter(prefix="/games", tags=["Games"])


@router.get("", response_model=GamesListResponse)
@router.get("/", response_model=GamesListResponse)
async def list_games():
    """Returns available offline curriculum coding mini-games."""
    return games_service.get_all_games()
