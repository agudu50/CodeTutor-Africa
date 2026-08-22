"""
System Status and Resource Metrics Endpoints.
"""

from fastapi import APIRouter
from app.core.config import get_settings
from app.schemas.system import (
    SystemStatusResponse,
    ModelStatusInfo,
    RAGStatusInfo,
    DatabaseStatusInfo,
    SystemResourceMetrics,
)
from app.services.model_manager.manager import model_manager
from app.infrastructure.monitoring.performance import performance_monitor

router = APIRouter(prefix="/system", tags=["System"])


@router.get("/status", response_model=SystemStatusResponse)
async def get_system_status():
    """Returns comprehensive offline system health, model readiness, and memory footprint."""
    settings = get_settings()
    model_info = model_manager.get_status()
    resources = performance_monitor.get_system_metrics()
    from app.services.rag.knowledge_service import knowledge_service
    rag_stats = knowledge_service.get_stats()

    return SystemStatusResponse(
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        offline_mode=True,
        environment=settings.APP_ENV,
        model=ModelStatusInfo(
            status="ready" if model_info.get("is_loaded") else "unloaded",
            name=model_info.get("name", settings.MODEL_NAME),
            provider=model_info.get("provider", settings.MODEL_PROVIDER),
            format=model_info.get("format", "GGUF"),
            context_size=model_info.get("context_size", settings.MODEL_CONTEXT_SIZE),
            threads=model_info.get("threads", settings.MODEL_THREADS),
            gpu_layers=model_info.get("gpu_layers", settings.MODEL_GPU_LAYERS),
        ),
        rag=RAGStatusInfo(
            status=rag_stats.get("status", "ready"),
            documents_indexed=rag_stats.get("documents_indexed", 4),
            embedding_model=rag_stats.get("embedding_model", "LightweightSparse-128D"),
        ),
        database=DatabaseStatusInfo(
            status="ready",
            engine="sqlite",
        ),
        resources=resources,
    )


@router.get("/metrics", response_model=SystemResourceMetrics)
async def get_resource_metrics():
    """Returns real-time CPU, RAM, and process RSS metrics."""
    return performance_monitor.get_system_metrics()
