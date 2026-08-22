"""
Mock Code Runner.
Safely evaluates deterministic code tests without executing unsandboxed code directly in the server process.
"""

import time
from app.infrastructure.code_runner.base import CodeRunner, ExecutionResult


class MockCodeRunner(CodeRunner):
    """Deterministic mock test runner for safe offline evaluation."""

    async def run(
        self,
        code: str,
        language: str,
        stdin: str = "",
        timeout_seconds: float = 5.0,
        memory_limit_mb: int = 128,
    ) -> ExecutionResult:
        start = time.perf_counter()

        # Check for syntax keywords to simulate simple results
        lower = code.lower()
        if "syntaxerror" in lower or "invalid syntax" in lower:
            return ExecutionResult(
                stdout="",
                stderr="SyntaxError: invalid syntax on line 2",
                exit_code=1,
                duration_ms=round((time.perf_counter() - start) * 1000, 2),
                memory_mb=12.4,
            )

        return ExecutionResult(
            stdout=f"Output: Test executed successfully for {language}\nResult: 42",
            stderr="",
            exit_code=0,
            duration_ms=round((time.perf_counter() - start) * 1000, 2),
            memory_mb=14.2,
        )
