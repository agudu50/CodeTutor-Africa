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


class ThreatEventModel(BaseModel):
    id: str
    timestamp: str
    origin_ip: str
    origin_location: str
    target_component: str
    attack_vector: str
    severity: str  # critical, high, medium, low
    status: str    # blocked, mitigated, quarantined, under_review
    payload_sample: str
    mitigation_action: str


class VulnerabilityItemModel(BaseModel):
    id: str
    cve_id: str
    title: str
    category: str  # LLM Guardrails, Client Sandbox, Storage & Tokens, API & Auth
    severity: str  # critical, high, medium, low
    cvss_score: float
    status: str    # unmitigated, active_patch, mitigated
    exploit_vector: str
    affected_component: str
    remediation_action_id: Optional[str] = None
    description: str


class SecurityStatsModel(BaseModel):
    total_attacks_received: int
    attacks_blocked: int
    mitigation_rate_percent: float
    active_threat_level: str  # low, guarded, elevated, high, critical
    attack_rate_per_min: float
    open_vulnerabilities_count: int
    patched_vulnerabilities_count: int
    shield_status: str  # active, strict, bypass


class SecurityTelemetryResponse(BaseModel):
    stats: SecurityStatsModel
    recent_threats: list[ThreatEventModel]
    vulnerabilities: list[VulnerabilityItemModel]
    defense_modules: Dict[str, Any]
    last_audit_timestamp: str

