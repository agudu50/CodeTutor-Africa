"""
Main API Router Aggregator for Version 1.
"""

from fastapi import APIRouter
from app.api.v1.system import router as system_router
from app.api.v1.tutor import router as tutor_router
from app.api.v1.practice import router as practice_router
from app.api.v1.debugger import debugger_router
from app.api.v1.learning import router as learning_router
from app.api.v1.progress import router as progress_router
from app.api.v1.games import router as games_router

api_v1_router = APIRouter()

api_v1_router.include_router(system_router)
api_v1_router.include_router(tutor_router)
api_v1_router.include_router(practice_router)
api_v1_router.include_router(debugger_router)
api_v1_router.include_router(learning_router)
api_v1_router.include_router(progress_router)
api_v1_router.include_router(games_router)
