"""
Local Offline Multi-Language Code Sandbox Execution Engine.
Executes Python, JavaScript, TypeScript, Java, and SQL with process isolation and strict timeouts.
"""

import os
import sys
import time
import asyncio
import tempfile
from typing import List, Optional
from app.infrastructure.code_runner.base import (
    CodeRunner,
    ExecutionResult,
    TestCase,
    TestCaseResult,
)
from app.infrastructure.code_runner.sql_runner import sql_runner
from app.core.logging import logger

MAX_OUTPUT_BYTES = 16 * 1024  # 16 KB output limit to protect memory


class LocalCodeRunner(CodeRunner):
    """Safe local subprocess code execution sandbox."""

    async def execute(
        self,
        code: str,
        language: str,
        stdin_input: Optional[str] = None,
        timeout_seconds: float = 3.0,
    ) -> ExecutionResult:
        lang = language.lower()

        if lang == "sql":
            stdout, stderr, exit_code, duration_ms = sql_runner.execute_query(code)
            return ExecutionResult(
                stdout=stdout,
                stderr=stderr,
                exit_code=exit_code,
                execution_time_ms=duration_ms,
                is_timeout=False,
                all_passed=exit_code == 0,
            )

        start_time = time.perf_counter()
        with tempfile.TemporaryDirectory(prefix="codetutor_sandbox_") as temp_dir:
            file_name, cmd = self._prepare_execution_command(lang, code, temp_dir)
            if not cmd:
                return ExecutionResult(
                    stdout="",
                    stderr=f"Unsupported execution runtime for language: {language}",
                    exit_code=1,
                    execution_time_ms=0.0,
                    all_passed=False,
                )

            try:
                # Spawn subprocess asynchronously
                proc = await asyncio.create_subprocess_exec(
                    *cmd,
                    cwd=temp_dir,
                    stdin=asyncio.subprocess.PIPE,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                )

                input_bytes = stdin_input.encode("utf-8") if stdin_input else None
                stdout_bytes, stderr_bytes = await asyncio.wait_for(
                    proc.communicate(input=input_bytes),
                    timeout=timeout_seconds,
                )

                stdout = stdout_bytes[:MAX_OUTPUT_BYTES].decode("utf-8", errors="replace").strip()
                stderr = stderr_bytes[:MAX_OUTPUT_BYTES].decode("utf-8", errors="replace").strip()
                exit_code = proc.returncode or 0
                is_timeout = False

            except asyncio.TimeoutError:
                try:
                    proc.kill()
                    await proc.wait()
                except Exception:
                    pass
                stdout = ""
                stderr = f"Execution Timeout Error: Code exceeded the {timeout_seconds}s safety limit."
                exit_code = 124
                is_timeout = True
            except Exception as e:
                stdout = ""
                stderr = f"Runtime Execution Exception: {str(e)}"
                exit_code = 1
                is_timeout = False

            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

            return ExecutionResult(
                stdout=stdout,
                stderr=stderr,
                exit_code=exit_code,
                execution_time_ms=duration_ms,
                is_timeout=is_timeout,
                all_passed=exit_code == 0 and not is_timeout,
            )

    async def run_tests(
        self,
        code: str,
        language: str,
        test_cases: List[TestCase],
        timeout_seconds: float = 3.0,
    ) -> ExecutionResult:
        if not test_cases:
            single_res = await self.execute(code, language, timeout_seconds=timeout_seconds)
            return single_res

        total_start = time.perf_counter()
        test_results: List[TestCaseResult] = []
        all_passed = True
        last_stdout = ""
        last_stderr = ""
        exit_code = 0

        for tc in test_cases:
            res = await self.execute(
                code=code,
                language=language,
                stdin_input=tc.input_data,
                timeout_seconds=timeout_seconds,
            )

            last_stdout = res.stdout
            last_stderr = res.stderr
            if res.exit_code != 0:
                exit_code = res.exit_code

            # Compare output (normalized whitespace)
            actual_clean = res.stdout.strip()
            expected_clean = tc.expected_output.strip()
            passed = (actual_clean == expected_clean) and (res.exit_code == 0) and not res.is_timeout

            if not passed:
                all_passed = False

            test_results.append(
                TestCaseResult(
                    test_id=tc.id,
                    passed=passed,
                    input_data=tc.input_data,
                    expected_output=tc.expected_output,
                    actual_output=res.stdout,
                    error_message=res.stderr if not passed else None,
                    execution_time_ms=res.execution_time_ms,
                )
            )

        total_duration_ms = round((time.perf_counter() - total_start) * 1000, 2)

        return ExecutionResult(
            stdout=last_stdout,
            stderr=last_stderr,
            exit_code=exit_code,
            execution_time_ms=total_duration_ms,
            is_timeout=any(r.execution_time_ms >= (timeout_seconds * 1000) for r in test_results),
            all_passed=all_passed,
            test_results=test_results,
        )

    def _prepare_execution_command(self, language: str, code: str, temp_dir: str):
        """Prepares language files and returns executable command."""
        if language in ("python", "py"):
            file_path = os.path.join(temp_dir, "solution.py")
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(code)
            return file_path, [sys.executable, "-u", file_path]

        elif language in ("javascript", "js", "typescript", "ts"):
            file_path = os.path.join(temp_dir, "solution.js")
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(code)
            # Use node runtime
            return file_path, ["node", "--no-warnings", file_path]

        elif language == "java":
            # Extract or default class name
            class_name = "Solution"
            file_path = os.path.join(temp_dir, f"{class_name}.java")
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(code)
            return file_path, ["java", file_path]

        return None, None


local_code_runner = LocalCodeRunner()
