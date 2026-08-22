"""
System Status & Performance Metrics Schemas.
"""

from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class ModelStatusInfo(BaseModel):
    status: str = Field(..., json_schema_extra={"example": "ready"}, description="Model status: ready, unloaded, loading, error")
    name: str = Field(..., json_schema_extra={"example": "Qwen2.5-Coder-3B-Instruct"})
    provider: str = Field(..., json_schema_extra={"example": "mock"})
    format: str = Field(default="GGUF", json_schema_extra={"example": "GGUF"})
    context_size: int = Field(default=2048)
    threads: int = Field(default=4)
    gpu_layers: int = Field(default=0)


class RAGStatusInfo(BaseModel):
    status: str = Field(default="ready")
    documents_indexed: int = Field(default=0)
    embedding_model: str = Field(default="lightweight-local")


class DatabaseStatusInfo(BaseModel):
    status: str = Field(default="ready")
    engine: str = Field(default="sqlite")


class SystemResourceMetrics(BaseModel):
    cpu_percent: float = Field(..., description="Current system CPU utilization %")
    ram_used_gb: float = Field(..., description="System RAM used in GB")
    ram_total_gb: float = Field(..., description="Total system RAM in GB")
    ram_percent: float = Field(..., description="System RAM utilization %")
    process_rss_mb: float = Field(..., description="CodeTutor backend RSS memory in MB")
    process_rss_gb: float = Field(..., description="CodeTutor backend RSS memory in GB")
    thermal_celsius: Optional[float] = Field(default=None, description="CPU Package temperature if available")
    is_throttled: bool = Field(default=False, description="Whether CPU thermal throttling is detected")


class SystemStatusResponse(BaseModel):
    app_name: str
    version: str
    offline_mode: bool = True
    environment: str
    model: ModelStatusInfo
    rag: RAGStatusInfo
    database: DatabaseStatusInfo
    resources: SystemResourceMetrics


class InferenceMetrics(BaseModel):
    prompt_tokens: int = Field(default=0)
    completion_tokens: int = Field(default=0)
    total_tokens: int = Field(default=0)
    latency_ms: float = Field(default=0.0)
    tokens_per_second: float = Field(default=0.0)
    model_name: str = Field(default="")
