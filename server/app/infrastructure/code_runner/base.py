"""
Code Runner Interface.
Provides strict abstraction for future secure sandboxed execution (Docker / Linux cgroups / gVisor).
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from pydantic import BaseModel


class ExecutionResult(BaseModel):
    stdout: str = ""
    stderr: str = ""
    exit_code: int = 0
    duration_ms: float = 0.0
    memory_mb: float = 0.0
    timeout: bool = False
    error: Optional[str] = None


class CodeRunner(ABC):
    """Abstract Base Class for safe language runtimes."""

    @abstractmethod
    async def run(
        self,
        code: str,
        language: str,
        stdin: str = "",
        timeout_seconds: float = 5.0,
        memory_limit_mb: int = 128,
    ) -> ExecutionResult:
        """Executes student code within isolated boundary and returns output."""
        pass
