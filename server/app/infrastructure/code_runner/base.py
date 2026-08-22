"""
Code Runner Base Interface and Data Contracts.
"""

from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class TestCase(BaseModel):
    __test__ = False
    id: str
    input_data: Optional[str] = None
    expected_output: str
    is_hidden: bool = False
    description: Optional[str] = None


class TestCaseResult(BaseModel):
    __test__ = False
    test_id: str
    passed: bool
    input_data: Optional[str] = None
    expected_output: str
    actual_output: str
    error_message: Optional[str] = None
    execution_time_ms: float = 0.0


class ExecutionResult(BaseModel):
    stdout: str = ""
    stderr: str = ""
    exit_code: int = 0
    execution_time_ms: float = 0.0
    is_timeout: bool = False
    memory_used_mb: Optional[float] = None
    all_passed: bool = True
    test_results: List[TestCaseResult] = Field(default_factory=list)


class CodeRunner(ABC):
    """Abstract interface for local language sandboxes."""

    @abstractmethod
    async def execute(
        self,
        code: str,
        language: str,
        stdin_input: Optional[str] = None,
        timeout_seconds: float = 3.0,
    ) -> ExecutionResult:
        """Executes a single code snippet safely."""
        pass

    @abstractmethod
    async def run_tests(
        self,
        code: str,
        language: str,
        test_cases: List[TestCase],
        timeout_seconds: float = 3.0,
    ) -> ExecutionResult:
        """Runs code against multiple test cases and computes pass/fail."""
        pass
