"""
Debugger Service.
Analyzes code, compiler/runtime outputs, and provides Socratic diagnostic hints.
"""

from app.schemas.debugger import DebugAnalyzeRequest, DebugAnalyzeResponse, BugLocation
from app.services.inference.inference_service import inference_service
from app.infrastructure.code_runner.local_runner import local_code_runner


class DebuggerService:
    async def analyze(self, req: DebugAnalyzeRequest) -> DebugAnalyzeResponse:
        error_msg = req.error_message
        has_error = error_msg is not None or "error" in req.code.lower()

        # If no error message supplied, execute code in sandbox to detect runtime/compiler trace
        if not error_msg and req.code.strip():
            run_res = await local_code_runner.execute(req.code, req.language, timeout_seconds=2.0)
            if run_res.exit_code != 0 or run_res.stderr:
                error_msg = run_res.stderr
                has_error = True

        prompt = (
            f"Analyze the following {req.language} code for bugs and logic issues.\n"
            f"Error message: {error_msg or 'None provided'}\n\n"
            f"Code:\n```{req.language}\n{req.code}\n```"
        )
        system_prompt = "You are an expert compiler and runtime diagnostics assistant. Identify the root cause and provide a guided fix."

        explanation, metrics = await inference_service.generate_response(prompt, system_prompt)

        return DebugAnalyzeResponse(
            has_bugs=has_error,
            summary=f"Detected error in {req.language} execution: {error_msg[:100]}" if (has_error and error_msg) else ("Identified potential logic/syntax issue." if has_error else "Code executed cleanly without errors."),
            error_type="RuntimeError" if has_error else None,
            locations=[BugLocation(line=1, column=1, snippet=req.code.splitlines()[0] if req.code.splitlines() else None)] if has_error else [],
            root_cause_explanation=explanation,
            guided_fix_hint="Ensure you check variable bounds, handle empty inputs, and avoid unintended state mutation.",
            fixed_code_snippet=None,
        )


debugger_service = DebuggerService()
