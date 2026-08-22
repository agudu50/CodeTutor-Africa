"""
Games Subsystem Service.
Exposes offline arcade programming mini-games linked to curriculum courses.
"""

from typing import List
from app.schemas.games import GameModeInfo, GamesListResponse

AVAILABLE_GAMES: List[GameModeInfo] = [
    GameModeInfo(
        id="syntax-speedrun",
        title="Syntax Speedrun",
        description="High-velocity syntax recall challenge with real-time 3D streak particle reactions.",
        icon="Zap",
        supported_languages=["python", "javascript", "typescript", "java", "sql"],
        difficulties=["beginner", "intermediate", "advanced"],
        has_3d_animation=True,
        offline_available=True,
    ),
    GameModeInfo(
        id="bug-hunt",
        title="Bug Hunt",
        description="Identify subtle logic, reference mutation, and runtime syntax errors with 3D diagnostic grid pulses.",
        icon="Bug",
        supported_languages=["python", "javascript", "typescript", "java", "sql"],
        difficulties=["beginner", "intermediate", "advanced"],
        has_3d_animation=True,
        offline_available=True,
    ),
    GameModeInfo(
        id="output-predictor",
        title="Output Predictor",
        description="Predict exact terminal outputs, loop states, and async execution order before execution.",
        icon="Terminal",
        supported_languages=["python", "javascript", "typescript", "java", "sql"],
        difficulties=["beginner", "intermediate", "advanced"],
        has_3d_animation=True,
        offline_available=True,
    ),
    GameModeInfo(
        id="code-shuffle",
        title="Code Shuffle",
        description="Reconstruct scrambled algorithms and function blocks in proper logical execution sequence.",
        icon="Layers",
        supported_languages=["python", "javascript", "typescript", "java", "sql"],
        difficulties=["beginner", "intermediate", "advanced"],
        has_3d_animation=True,
        offline_available=True,
    ),
]


class GamesService:
    def get_all_games(self) -> GamesListResponse:
        return GamesListResponse(
            games=AVAILABLE_GAMES,
            total_games=len(AVAILABLE_GAMES),
            offline_status="ready",
        )


games_service = GamesService()
